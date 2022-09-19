import { CloseBracketState, GetPathState } from "./";

import * as chars from "../Characters";
import * as errors from "../Errors";
import * as notifies from "../Notify";

import {
  ProcessMessage,
  InitMessage,
  NotifyMessage,
  StubbleMessage,
} from "../StubbleMessages";

import { StubbleError } from "../StubbleError";
import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";

export class GetDataState implements StubbleState {
  private _path: string = "";

  getName() {
    return "GetDataState";
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
    let path = msg.value;

    return {
      state: new GetPathState(path),
    };
  }

  process(msg: ProcessMessage, context: StubbleContext): StubbleResult | null {
    let charCode = msg.charCode;

    switch (charCode) {
      case chars.EOS:
        return {
          err: new StubbleError(
            errors.ERROR_UNEXPECTED_END_OF_SOURCE,
            "unexpected end of source"
          ),
        };

      case chars.SPACE:
        return null;
      case chars.CLOSE_BRACKET:
        return {
          state: new CloseBracketState(),
        };

      default:
        return {
          err: new StubbleError(
            errors.ERROR_WRONG_DATA_SEQUENCE_CHARACTER,
            `Wrong character "${String.fromCharCode(charCode)}" found`
          ),
        };
    }
  }

  notify(msg: NotifyMessage, context: StubbleContext): StubbleResult | null {
    switch (msg.type) {
      case notifies.NOTIFY_PATH_RESULT:
        this._path = msg.value;

        return {
          message: new ProcessMessage(msg.charCode || 0),
        };

      case notifies.NOTIFY_SECOND_CLOSE_BRACKET_FOUND:
        return {
          pop: true,
          result: this.getResult(context),
        };

      default:
        return null;
    }
  }

  getResult(context: StubbleContext): string {
    let result = "";

    let value = context.get(this._path);

    if (value != null) {
      result = value.toString();
    }

    return result;
  }
}
