import { CloseBracketState, GetAttributeState, GetBlockNameState } from "./";

import * as chars from "../Characters";
import * as errors from "../Errors";
import * as notifies from "../Notify";

import { StubbleError } from "../StubbleError";
import {
  ProcessMessage,
  InitMessage,
  NotifyMessage,
  StubbleMessage,
} from "../StubbleMessages";

import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";

export class GetHelperState implements StubbleState {
  private _helper: string = "";
  private _attributes: any[] = [];

  getName() {
    return "GetHelperState";
  }

  canAcceptMessage(msg: StubbleMessage): boolean {
    return true;
  }

  handleMessage(
    msg: StubbleMessage,
    context: StubbleContext
  ): StubbleResult | null {
    if (msg instanceof ProcessMessage) {
      return this.process(msg, context);
    }

    if (msg instanceof InitMessage) {
      return this.init(msg, context);
    }

    if (msg instanceof NotifyMessage) {
      return this.notify(msg, context);
    }

    return null;
  }

  init(msg: InitMessage, context: StubbleContext): StubbleResult | null {
    this._helper = "";
    this._attributes = [];

    return {
      state: new GetBlockNameState(),
    };
  }

  process(msg: ProcessMessage, context: StubbleContext): StubbleResult | null {
    let charCode = msg.charCode;

    if (charCode == chars.CLOSE_BRACKET) {
      return {
        state: new CloseBracketState(),
      };
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
      case notifies.NOTIFY_NAME_RESULT:
        this._helper = msg.value;

        return {
          message: new ProcessMessage(msg.charCode!),
        };

      case notifies.NOTIFY_SECOND_CLOSE_BRACKET_FOUND:
        return this.result(context);

      case notifies.NOTIFY_ATTR_RESULT:
        this._attributes.push(msg.value);

        if (msg.charCode != null) {
          return {
            message: new ProcessMessage(msg.charCode),
          };
        }

        break;
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

    const result: StubbleResult = {};

    try {
      if (!this._attributes || this._attributes.length == 0) {
        this._attributes = [context.data()];
      }

      result.result = context.call(this._helper, this._attributes, () => "");
      result.pop = true;
    } catch (e: any) {
      result.err = new StubbleError(
        errors.ERROR_CALLING_HELPER,
        `Error in helper function ${this._helper}: ${e.toString()}`
      );
    }

    return result;
  }
}
