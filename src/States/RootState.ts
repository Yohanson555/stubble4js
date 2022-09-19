import {
  GetBlockSequenceTypeState,
  GetDataState,
  GetHelperState,
  GetSequenceState,
  OpenBracketState,
} from "./";

import * as chars from "../Characters";
import * as notifies from "../Notify";
import {
  ProcessMessage,
  InitMessage,
  NotifyMessage,
  StubbleMessage,
} from "../StubbleMessages";

import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";

export class RootState implements StubbleState {
  private _escape: boolean = false;

  getName() {
    return "RootState";
  }

  canAcceptMessage(msg: StubbleMessage): boolean {
    if (msg instanceof ProcessMessage || msg instanceof NotifyMessage) {
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

    if (msg instanceof NotifyMessage) {
      return this.notify(msg, context);
    }

    return null;
  }

  process(msg: ProcessMessage, context: StubbleContext): StubbleResult | null {
    let res: StubbleResult = {};
    let charCode = msg.charCode;

    if (charCode == chars.EOS) return null;

    if (this._escape) {
      this._escape = false;

      res.result = String.fromCharCode(charCode);
    } else {
      switch (charCode) {
        case chars.BACK_SLASH:
          this._escape = true;
          break;
        case chars.OPEN_BRACKET:
          res.state = new OpenBracketState();
          break;
        default:
          res.result = String.fromCharCode(charCode);
      }
    }

    return res;
  }

  notify(msg: NotifyMessage, context: StubbleContext): StubbleResult {
    const res: StubbleResult = {};

    switch (msg.type) {
      case notifies.NOTIFY_SECOND_OPEN_BRACKET_FOUND: // done
        res.state = new GetSequenceState();
        break;

      case notifies.NOTIFY_IS_HELPER_SEQUENCE: // done
        res.message = new InitMessage();
        res.state = new GetHelperState();
        break;

      case notifies.NOTIFY_IS_BLOCK_SEQUENCE: // done
        res.message = new InitMessage();
        res.state = new GetBlockSequenceTypeState();
        break;

      case notifies.NOTIFY_IS_DATA_SEQUENCE: // done
        res.state = new GetDataState();
        res.message = new InitMessage(msg.value);
        break;
    }

    return res;
  }
}
