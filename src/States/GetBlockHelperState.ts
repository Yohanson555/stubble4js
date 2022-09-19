import { CloseBracketState, GetAttributeState, GetBlockEndState } from "./";

import * as chars from "../Characters";
import * as errors from "../Errors";
import * as notifies from "../Notify";

import { StubbleError } from "../StubbleError";
import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";

import {
  ProcessMessage,
  NotifyMessage,
  StubbleMessage,
} from "../StubbleMessages";

export class GetBlockHelperState implements StubbleState {
  private _helper: string = "";
  private _symbol: number = 0;
  private _line: number = 0;

  private _attributes: (string | number | boolean)[];
  private _body: string;

  constructor(helper: string, symbol: number, line: number) {
    this._helper = helper;
    this._attributes = [];
    this._body = "";

    this._symbol = symbol;
    this._line = line;
  }

  getName() {
    return "GetBlockHelperState";
  }

  canAcceptMessage(msg: StubbleMessage): boolean {
    if (msg instanceof ProcessMessage) {
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
          `Unterminated block helper "${this._helper}" at ${this._line}:${this._symbol}`
        ),
      };
    } else if (charCode == chars.CLOSE_BRACKET) {
      return { state: new CloseBracketState() };
    } else if (charCode == chars.SPACE) {
      return null;
    }

    return {
      state: new GetAttributeState(),
      message: new ProcessMessage(charCode),
    };
  }

  notify(msg: NotifyMessage, context: StubbleContext): StubbleResult | null {
    switch (msg.type) {
      case notifies.NOTIFY_SECOND_CLOSE_BRACKET_FOUND:
        return {
          state: new GetBlockEndState(this._helper),
        };

      case notifies.NOTIFY_ATTR_RESULT:
        this._attributes.push(msg.value);

        if (msg.charCode != null) {
          return {
            message: new ProcessMessage(msg.charCode),
          };
        }
        break;

      case notifies.NOTIFY_BLOCK_END_RESULT:
        this._body = msg.value;

        return this.result(context);
    }

    return null;
  }

  result(context: StubbleContext): StubbleResult {
    if (!context.callable(this._helper)) {
      return {
        pop: true,
        err: new StubbleError(
          errors.ERROR_HELPER_UNREGISTERED,
          `Helper "${this._helper}" is unregistered`
        ),
      };
    }

    let result: StubbleResult = {};

    try {
      if (!this._attributes || this._attributes.length <= 0) {
        this._attributes.push(context.data());
      }

      result.result = context.call(
        this._helper,
        this._attributes,
        context.compile(this._body)
      );
      result.pop = true;
    } catch (e: any) {
      console.error(e);
      result.err = new StubbleError(
        errors.ERROR_CALLING_HELPER,
        `Helper "${this._helper}" error: ${e.toString()}`
      );
    }

    return result;
  }
}
