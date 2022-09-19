import * as chars from "../Characters";
import * as errors from "../Errors";
import * as notifies from "../Notify";
import { StubbleError } from "../StubbleError";
import {
  NotifyMessage,
  ProcessMessage,
  StubbleMessage,
} from "../StubbleMessages";

import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";

export class GetNumberAttributeState implements StubbleState {
  public value: string = "";

  constructor(value?: string) {
    this.value = value || "";
  }

  getName() {
    return "GetNumberAttributeState";
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

  process(msg: ProcessMessage, context: StubbleContext): StubbleResult | null {
    let charCode = msg.charCode;

    if (charCode == chars.CLOSE_BRACKET || charCode == chars.SPACE) {
      return {
        pop: true,
        message: new NotifyMessage(
          notifies.NOTIFY_ATTR_RESULT,
          charCode,
          this.value.indexOf(String.fromCharCode(chars.DOT)) > 0
            ? parseFloat(this.value)
            : parseInt(this.value)
        ),
      };
    } else if (charCode == chars.DOT) {
      if (this.value.indexOf(String.fromCharCode(chars.DOT)) > 0) {
        return {
          err: new StubbleError(
            errors.ERROR_NUMBER_ATTRIBUTE_MALFORMED,
            "Duplicate number delimiter"
          ),
        };
      }

      this.value += String.fromCharCode(charCode);
    } else if (charCode >= 48 && charCode <= 57) {
      this.value += String.fromCharCode(charCode);
    } else {
      return {
        err: new StubbleError(
          errors.ERROR_NUMBER_ATTRIBUTE_MALFORMED,
          "Number attribute malformed"
        ),
      };
    }

    return null;
  }
}
