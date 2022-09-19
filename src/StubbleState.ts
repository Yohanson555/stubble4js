import { StubbleContext } from "./StubbleContext";
import { StubbleMessage } from "./StubbleMessages";
import { StubbleResult } from "./StubbleResult";

export interface StubbleState {
  canAcceptMessage(msg: StubbleMessage): boolean;

  handleMessage(
    msg: StubbleMessage,
    context: StubbleContext
  ): StubbleResult | null;
}
