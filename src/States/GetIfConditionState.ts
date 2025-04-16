import { GetAttributeState, GetConditionState } from "./";

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

export class GetIfConditionState implements StubbleState {
  private leftPart: any = "";
  private rightPart: any = "";
  private condition: string = "";

  private _state = 0;

  getName() {
    return "GetIfConditionState";
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
    let charCode = msg.charCode;

    if (charCode === chars.EOS) {
      return {
        err: new StubbleError(
          errors.ERROR_UNEXPECTED_END_OF_SOURCE,
          "unexpected end of source"
        ),
      };
    } else if (charCode == chars.CLOSE_BRACKET) {
      return {
        pop: true,
        message: new NotifyMessage(
          notifies.NOTIFY_CONDITION_RESULT,
          msg.charCode,
          this.checkCondition()
        ),
      };
      // return {
      //   err: new StubbleError(
      //     errors.ERROR_IF_BLOCK_MALFORMED,
      //     "If block condition malformed"
      //   ),
      // };
    } else if (charCode == chars.SPACE) {
      return null;
    } else {
      switch (this._state) {
        case 0:
          return {
            state: new GetAttributeState(),
            message: new ProcessMessage(charCode),
          };

        case 1:
          return {
            state: new GetConditionState(),
            message: new ProcessMessage(charCode),
          };

        case 2:
          return {
            state: new GetAttributeState(),
            message: new ProcessMessage(charCode),
          };
      }
    }

    return null;
  }

  notify(msg: NotifyMessage, context: StubbleContext): StubbleResult | null {
    switch (msg.type) {
      case notifies.NOTIFY_ATTR_RESULT:
        if (this._state == 0) {
          this.leftPart = msg.value;
          this._state++;
        } else {
          this.rightPart = msg.value;

          return {
            pop: true,
            message: new NotifyMessage(
              notifies.NOTIFY_CONDITION_RESULT,
              msg.charCode,
              this.checkCondition()
            ),
          };
        }

        if (msg.charCode != null) {
          return {
            message: new ProcessMessage(msg.charCode),
          };
        }

        break;

      case notifies.NOTIFY_CONDITION_RESULT:
        this.condition = msg.value;
        this._state++;

        return {
          message: new ProcessMessage(msg.charCode!),
        };
    }

    return null;
  }

  checkCondition(): boolean {
    const { condition, leftPart, rightPart } = this;

    if (!leftPart) return false;

    if (!condition) {
      return !!leftPart;
    }

    switch (condition) {
      case "<":
        return leftPart < rightPart;
      case "<=":
        return leftPart <= rightPart;
      case ">":
        return leftPart > rightPart;
      case ">=":
        return leftPart >= rightPart;
      case "==":
        return leftPart == rightPart;
      case "!=":
        return leftPart != rightPart;

      default:
        return false;
    }
  }
}
