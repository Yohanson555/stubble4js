import * as chars from "../Characters";
import * as errors from "../Errors";
import * as notifies from "../Notify";

import {
  NotifyMessage,
  ProcessMessage,
  StubbleMessage,
} from "../StubbleMessages";

import { StubbleError } from "../StubbleError";
import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";

export class GetConditionState implements StubbleState {
  private _condition: string = "";

  getName() {
    return "GetConditionState";
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
          "IF condition error: unexpected end of source"
        ),
      };
    } else if (
      charCode == chars.MORE ||
      charCode == chars.LESS ||
      charCode == chars.EQUAL ||
      charCode == chars.EXCL_MARK
    ) {
      this._condition += String.fromCharCode(charCode);

      return null;
    } else if (charCode == chars.CLOSE_BRACKET || charCode == chars.SPACE) {
      if (
        this._condition.length > 2 ||
        ["==", "!=", "<", ">", "<=", ">="].indexOf(this._condition) < 0
      ) {
        return {
          err: new StubbleError(
            errors.ERROR_IF_BLOCK_CONDITION_MALFORMED,
            `If block condition malformed: "${this._condition}"`
          ),
        };
      } else {
        return {
          pop: true,
          message: new NotifyMessage(
            notifies.NOTIFY_CONDITION_RESULT,
            charCode,
            this._condition
          ),
        };
      }
    }

    return {
      err: new StubbleError(
        errors.ERROR_GETTING_ATTRIBUTE,
        `Wrong condition character "${String.fromCharCode(
          charCode
        )}" (${charCode})`
      ),
    };
  }
}
