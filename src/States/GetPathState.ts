import * as chars from "../Characters";
import * as errors from "../Errors";
import * as notifies from "../Notify";

import {
  ProcessMessage,
  NotifyMessage,
  StubbleMessage,
} from "../StubbleMessages";

import { StubbleError } from "../StubbleError";
import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";

export class GetPathState implements StubbleState {
  private lastChar: number = 0;
  private path: string | string[];

  constructor(path: string | string[]) {
    this.path = path || "";
  }

  getName() {
    return "GetPathState";
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

    if (charCode == chars.EOS) {
      return {
        pop: true,
        message: new ProcessMessage(charCode),
      };
    } else if (charCode == chars.DOT) {
      if (!this.path) {
        return {
          err: new StubbleError(
            errors.ERROR_PATH_WRONG_SPECIFIED,
            "Path should not start with point character"
          ),
        };
      }

      this.path += String.fromCharCode(charCode);
    } else if (charCode >= 48 && charCode <= 57) {
      if (!this.path) {
        return {
          err: new StubbleError(
            errors.ERROR_PATH_WRONG_SPECIFIED,
            "Path should not start with number character"
          ),
        };
      }

      this.path += String.fromCharCode(charCode);
    } else if (
      (charCode >= 65 && charCode <= 90) ||
      (charCode >= 97 && charCode <= 122) ||
      charCode == 95
    ) {
      this.path += String.fromCharCode(charCode);
    } else if (charCode == chars.SPACE || charCode == chars.CLOSE_BRACKET) {
      if (this.lastChar == chars.DOT) {
        return {
          err: new StubbleError(
            errors.ERROR_PATH_WRONG_SPECIFIED,
            "Path should not end with dot character"
          ),
        };
      }
      return {
        pop: true,
        message: new NotifyMessage(
          notifies.NOTIFY_PATH_RESULT,
          charCode,
          this.path
        ),
      };
    } else {
      return {
        err: new StubbleError(
          errors.ERROR_NOT_A_VALID_PATH_CHAR,
          `Character "${String.fromCharCode(charCode)}" is not a valid in path`
        ),
      };
    }

    this.lastChar = charCode;

    return null;
  }
}
