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

export class GetBlockNameState implements StubbleState {
  public name: string;

  constructor(name?: string) {
    this.name = name || "";
  }

  getName() {
    return "GetBlockNameState";
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

    if (charCode === chars.EOS) {
      return {
        err: new StubbleError(
          errors.ERROR_UNEXPECTED_END_OF_SOURCE,
          "block name error: unexpected end of source"
        ),
      };
    } else if (charCode >= 48 && charCode <= 57) {
      if (!this.name) {
        return {
          err: new StubbleError(
            errors.ERROR_BLOCK_NAME_WRONG_SPECIFIED,
            "Block name should not start with number character"
          ),
        };
      }

      this.name += String.fromCharCode(charCode);
    } else if (
      (charCode >= 65 && charCode <= 90) ||
      (charCode >= 97 && charCode <= 122) ||
      charCode == 95
    ) {
      this.name += String.fromCharCode(charCode);
    } else if (charCode == chars.SPACE || charCode == chars.CLOSE_BRACKET) {
      if (!this.name) {
        return {
          err: new StubbleError(
            errors.ERROR_BLOCK_NAME_WRONG_SPECIFIED,
            "Block name is empty"
          ),
        };
      }

      return {
        pop: true,
        message: new NotifyMessage(
          notifies.NOTIFY_NAME_RESULT,
          charCode,
          this.name
        ),
      };
    } else {
      return {
        err: new StubbleError(
          errors.ERROR_NOT_A_VALID_BLOCK_NAME_CHAR,
          `Character "${String.fromCharCode(
            charCode
          )}" is not a valid in block name`
        ),
      };
    }

    return null;
  }
}
