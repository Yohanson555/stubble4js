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

export class OpenBracketState implements StubbleState {
  getName() {
    return "OpenBracketState";
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

    return null;
  }

  process(msg: ProcessMessage, context: StubbleContext): StubbleResult {
    let charCode = msg.charCode;
    let res: StubbleResult = {};

    switch (charCode) {
      case chars.OPEN_BRACKET:
        res.pop = true;
        res.message = new NotifyMessage(
          notifies.NOTIFY_SECOND_OPEN_BRACKET_FOUND,
          charCode
        );

        break;

      default:
        res.err = new StubbleError(
          errors.ERROR_CHAR_NOT_A_OPEN_BRACKET,
          'Wrong character is given. Expected "{"'
        );
    }

    return res;
  }
}
