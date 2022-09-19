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
    context: StubbleContext
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
          `Unterminated "IF" block at ${this._line}:${this._symbol}`
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
    let res: string = "";

    try {
      let fn = context.compile(this._body);
      res = fn ? fn(context.data()) : "";
    } catch (e) {
      return {
        err: new StubbleError(
          errors.ERROR_IF_BLOCK_MALFORMED,
          `If block error: ${e}`
        ),
      };
    }

    if (this._res !== true) {
      res = "";
    }

    return {
      pop: true,
      result: res,
    };
  }
}
