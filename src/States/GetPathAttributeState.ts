import { GetPathState } from "./";
import * as notifies from "../Notify";
import { NotifyMessage, InitMessage, StubbleMessage } from "../StubbleMessages";
import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";

export class GetPathAttributeState implements StubbleState {
  getName() {
    return "GetPathAttributeState";
  }

  canAcceptMessage(msg: StubbleMessage): boolean {
    if (msg instanceof InitMessage || msg instanceof NotifyMessage) {
      return true;
    }

    return false;
  }

  handleMessage(
    msg: StubbleMessage,
    context: StubbleContext
  ): StubbleResult | null {
    if (msg instanceof InitMessage) {
      return this.init(msg, context);
    }

    if (msg instanceof NotifyMessage) {
      return this.notify(msg, context);
    }

    return null;
  }

  init(msg: InitMessage, context: StubbleContext): StubbleResult {
    return {
      state: new GetPathState(msg.value),
    };
  }

  notify(msg: NotifyMessage, context: StubbleContext): StubbleResult | null {
    switch (msg.type) {
      case notifies.NOTIFY_PATH_RESULT:
        return {
          pop: true,
          message: new NotifyMessage(
            notifies.NOTIFY_ATTR_RESULT,
            msg.charCode,
            context.get(msg.value)
          ),
        };

      default:
        return null;
    }
  }
}
