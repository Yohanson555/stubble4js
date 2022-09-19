import {
  GetNumberAttributeState,
  GetPathAttributeState,
  GetStringAttributeState,
} from "./";

import chars = require("../Characters");
import errors = require("../Errors");
import { StubbleError } from "../StubbleError";

import {
  InitMessage,
  ProcessMessage,
  StubbleMessage,
} from "../StubbleMessages";

import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";

export class GetAttributeState implements StubbleState {
  getName() {
    return "GetAttributeState";
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

    if (charCode == chars.QUOTE || charCode == chars.SINGLE_QUOTE) {
      return {
        pop: true,
        state: new GetStringAttributeState(charCode),
      };
    } else if (charCode >= 48 && charCode <= 57) {
      return {
        pop: true,
        state: new GetNumberAttributeState(),
        message: new ProcessMessage(charCode),
      };
    } else if (
      (charCode >= 65 && charCode <= 90) ||
      (charCode >= 97 && charCode <= 122) ||
      charCode == 95
    ) {
      return {
        pop: true,
        message: new InitMessage(String.fromCharCode(charCode)),
        state: new GetPathAttributeState(),
      };
    }

    return {
      err: new StubbleError(
        errors.ERROR_GETTING_ATTRIBUTE,
        `Wrong attribute character "${String.fromCharCode(charCode)}"`
      ),
    };
  }
}
