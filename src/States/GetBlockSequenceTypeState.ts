import {
  GetBlockHelperState,
  GetBlockNameState,
  GetEachBlockState,
  GetIfBlockState,
  GetWithBlockState,
} from "./";

import * as errors from "../Errors";
import * as notifies from "../Notify";

import { StubbleError } from "../StubbleError";
import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";
import {
  InitMessage,
  ProcessMessage,
  NotifyMessage,
  StubbleMessage,
} from "../StubbleMessages";

export class GetBlockSequenceTypeState implements StubbleState {
  getName() {
    return "GetBlockSequenceTypeState";
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

  init(msg: InitMessage, context: StubbleContext): StubbleResult | null {
    return {
      state: new GetBlockNameState(),
    };
  }

  notify(msg: NotifyMessage, context: StubbleContext): StubbleResult | null {
    const blockName = msg.value;
    const res: StubbleResult = {
      pop: true,
      message: new ProcessMessage(msg.charCode || 0),
    };

    switch (blockName) {
      case "if":
        res.state = new GetIfBlockState(context.symbol, context.line);
        break;

      case "with":
        res.state = new GetWithBlockState(context.symbol, context.line);
        break;

      case "each":
        res.state = new GetEachBlockState(context.symbol, context.line);
        break;

      default:
        res.state = new GetBlockHelperState(
          blockName,
          context.symbol,
          context.line
        );
        break;
    }

    return res;
  }
}
