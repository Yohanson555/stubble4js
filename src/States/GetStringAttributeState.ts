import * as chars from "../Characters";
import * as notifies from "../Notify";
import * as errors from "../Errors";

import {
  ProcessMessage,
  NotifyMessage,
  StubbleMessage,
} from "../StubbleMessages";

import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";
import { StubbleError } from "../StubbleError";

export class GetStringAttributeState implements StubbleState {
  private _value: string = "";
  private _escape: boolean = false;
  private quoteSymbol: number;

  constructor(quoteSymbol: number) {
    this.quoteSymbol = quoteSymbol;
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

  getName() {
    return "GetStringAttributeState";
  }

  process(msg: ProcessMessage, context: StubbleContext): StubbleResult | null {
    let charCode = msg.charCode;

    if (this._escape) {
      this._escape = false;
      this._value += String.fromCharCode(charCode);
    } else {
      if (charCode == chars.OPEN_BRACKET || charCode == chars.CLOSE_BRACKET) {
        return {
          err: new StubbleError(
            errors.ERROR_STRING_ATTRIBUTE_MALFORMED,
            `Wrong attribute value character "${String.fromCharCode(charCode)}"`
          ),
        };
      } else if (charCode == chars.BACK_SLASH) {
        this._escape = true;
      } else if (charCode == this.quoteSymbol) {
        return {
          pop: true,
          message: new NotifyMessage(
            notifies.NOTIFY_ATTR_RESULT,
            undefined,
            this._value
          ),
        };
      } else {
        this._value += String.fromCharCode(charCode);
      }
    }

    return null;
  }
}
