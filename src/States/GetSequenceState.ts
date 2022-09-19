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

export class GetSequenceState implements StubbleState {
  getName() {
    return "GetSequenceState";
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

    if (charCode == chars.DOLLAR) {
      res.pop = true;
      res.message = new NotifyMessage(
        notifies.NOTIFY_IS_HELPER_SEQUENCE,
        charCode
      );
    } else if (charCode == chars.SHARP) {
      res.pop = true;
      res.message = new NotifyMessage(
        notifies.NOTIFY_IS_BLOCK_SEQUENCE,
        charCode
      );
    } else if (
      (charCode >= 65 && charCode <= 90) ||
      (charCode >= 97 && charCode <= 122)
    ) {
      res.pop = true;
      res.message = new NotifyMessage(
        notifies.NOTIFY_IS_DATA_SEQUENCE,
        charCode,
        String.fromCharCode(charCode)
      );
    } else {
      res.err = new StubbleError(
        errors.ERROR_WRONG_SEQUENCE_CHARACTER,
        `Wrong character "${String.fromCharCode(charCode)}" found`
      );
    }

    return res;
  }
}
