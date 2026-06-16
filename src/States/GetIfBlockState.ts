import { CloseBracketState, GetBlockEndState, GetIfConditionState } from "./";

import * as chars from "../Characters";
import * as errors from "../Errors";
import * as notifies from "../Notify";

import { StubbleError } from "../StubbleError";
import {
  ProcessMessage,
  NotifyMessage,
  StubbleMessage,
} from "../StubbleMessages";

import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";

type IfBranchKind = "if" | "elseif" | "else";

interface IfBranch {
  kind: IfBranchKind;
  condition?: string;
  body: string;
}

export class GetIfBlockState implements StubbleState {
  private _res: boolean = false;
  private _body: string = "";
  private _symbol: number = 0;
  private _line: number = 0;

  constructor(symbol: number, line: number) {
    this._symbol = symbol;
    this._line = line;
  }

  getName() {
    return "GetIfBlockState";
  }

  canAcceptMessage(msg: StubbleMessage): boolean {
    if (msg instanceof ProcessMessage || msg instanceof NotifyMessage) {
      return true;
    }

    return false;
  }

  handleMessage(
    msg: StubbleMessage,
    context: StubbleContext,
  ): StubbleResult | null {
    if (msg instanceof ProcessMessage) {
      return this.process(msg, context);
    }

    if (msg instanceof NotifyMessage) {
      return this.notify(msg, context);
    }

    return null;
  }

  process(msg: ProcessMessage, context: StubbleContext): StubbleResult | null {
    let charCode = msg.charCode;

    if (charCode == chars.EOS) {
      return {
        err: new StubbleError(
          errors.ERROR_UNTERMINATED_BLOCK,
          `Unterminated "IF" block at ${this._line}:${this._symbol}`,
        ),
      };
    } else if (charCode == chars.SPACE) {
      return null;
    } else if (charCode == chars.CLOSE_BRACKET) {
      return {
        state: new CloseBracketState(),
      };
    }

    return {
      state: new GetIfConditionState(),
      message: new ProcessMessage(charCode),
    };
  }

  notify(msg: NotifyMessage, context: StubbleContext): StubbleResult {
    switch (msg.type) {
      case notifies.NOTIFY_CONDITION_RESULT:
        this._res = msg.value || false;

        if (msg.charCode != null) {
          return {
            message: new ProcessMessage(msg.charCode),
          };
        }

        return {};

      case notifies.NOTIFY_SECOND_CLOSE_BRACKET_FOUND:
        return {
          state: new GetBlockEndState("if"),
        };

      case notifies.NOTIFY_BLOCK_END_RESULT:
        this._body = msg.value;

        return this.result(context);

      default:
        return {};
    }
  }

  result(context: StubbleContext): StubbleResult {
    const branches = this.splitBody(this._body);

    let selected: IfBranch | null = null;

    for (let i = 0; i < branches.length; i++) {
      const b = branches[i];
      let ok = false;

      if (b.kind === "if") {
        ok = this._res === true;
      } else if (b.kind === "elseif") {
        try {
          ok = this.evalElseifCondition(b.condition || "", context);
        } catch (e) {
          return {
            err: new StubbleError(
              errors.ERROR_IF_BLOCK_MALFORMED,
              `If block error: ${e}`,
            ),
          };
        }
      } else {
        ok = true;
      }

      if (ok) {
        selected = b;
        break;
      }
    }

    let res: string = "";

    if (selected && selected.body) {
      try {
        let fn = context.compile(selected.body);
        res = fn ? fn(context.data()) : "";
      } catch (e) {
        return {
          err: new StubbleError(
            errors.ERROR_IF_BLOCK_MALFORMED,
            `If block error: ${e}`,
          ),
        };
      }
    }

    return {
      pop: true,
      result: res,
    };
  }

  private splitBody(body: string): IfBranch[] {
    const branches: IfBranch[] = [{ kind: "if", body: "" }];
    let depth = 0;
    let segmentStart = 0;
    let esc = false;
    let i = 0;

    while (i < body.length) {
      const ch = body[i];

      if (ch === "\\" && !esc) {
        esc = true;
        i++;
        continue;
      }

      if (ch === "{" && !esc && body[i + 1] === "{") {
        let j = i + 2;
        while (
          j < body.length - 1 &&
          !(body[j] === "}" && body[j + 1] === "}")
        ) {
          j++;
        }

        if (j >= body.length - 1) {
          break;
        }

        const tag = body.slice(i + 2, j).trim();

        if (depth === 0 && tag === "else") {
          branches[branches.length - 1].body = body.slice(segmentStart, i);
          branches.push({ kind: "else", body: "" });
          segmentStart = j + 2;
          i = j + 2;
          continue;
        }

        if (depth === 0 && /^elseif(\s+|$)/.test(tag)) {
          const cond = tag.replace(/^elseif\s*/, "");
          branches[branches.length - 1].body = body.slice(segmentStart, i);
          branches.push({ kind: "elseif", condition: cond, body: "" });
          segmentStart = j + 2;
          i = j + 2;
          continue;
        }

        if (tag.charAt(0) === "#") {
          depth++;
        } else if (tag.charAt(0) === "/") {
          depth--;
        }

        i = j + 2;
        esc = false;
        continue;
      }

      esc = false;
      i++;
    }

    branches[branches.length - 1].body = body.slice(segmentStart);
    return branches;
  }

  private evalElseifCondition(
    condition: string,
    context: StubbleContext,
  ): boolean {
    const cond = (condition || "").trim();

    if (!cond) {
      return false;
    }

    const probe = "\u0001ELSEIF_TRUE\u0001";
    const tpl = `{{#if ${cond}}}${probe}{{/if}}`;
    const fn = context.compile(tpl);

    if (!fn) {
      return false;
    }

    return fn(context.data()) === probe;
  }
}
