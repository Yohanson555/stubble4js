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

export class CloseBracketState implements StubbleState {
  getName() {
    return "CloseBracketState";
  }

  canAcceptMessage(msg: StubbleMessage): boolean {
    if (msg instanceof ProcessMessage) {
      return true;
    }

    return false;
  }

  handleMessage(msg: StubbleMessage, context: StubbleContext): StubbleResult | null {
    if (msg instanceof ProcessMessage) {
      return this.process(msg, context);
    }

    return null;
  }

  process(msg: ProcessMessage, context: StubbleContext): StubbleResult | null {
    const res: StubbleResult = {};
    const charCode = msg.charCode;

    switch (charCode) {
      case chars.CLOSE_BRACKET:
        res.pop = true;
        res.message = new NotifyMessage(
          notifies.NOTIFY_SECOND_CLOSE_BRACKET_FOUND
        );
        break;
      default:
        res.err = new StubbleError(
          errors.ERROR_CHAR_NOT_A_CLOSE_BRACKET,
          'Wrong character is given. Expected "}"'
        );
    }

    return res;
  }
}
