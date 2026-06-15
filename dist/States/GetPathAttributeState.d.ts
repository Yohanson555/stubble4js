import { NotifyMessage, InitMessage, StubbleMessage } from "../StubbleMessages";
import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";
export declare class GetPathAttributeState implements StubbleState {
    getName(): string;
    canAcceptMessage(msg: StubbleMessage): boolean;
    handleMessage(msg: StubbleMessage, context: StubbleContext): StubbleResult | null;
    init(msg: InitMessage, context: StubbleContext): StubbleResult;
    notify(msg: NotifyMessage, context: StubbleContext): StubbleResult | null;
}
