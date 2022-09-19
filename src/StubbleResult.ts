import { StubbleError } from "./StubbleError";
import { StubbleMessage } from "./StubbleMessages";
import { StubbleState } from "./StubbleState";

export type StubbleResult = {
  state?: StubbleState;
  message?: StubbleMessage;
  pop?: boolean;
  err?: StubbleError;
  result?: string;
};
