import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";
import { InitMessage, NotifyMessage, StubbleMessage } from "../StubbleMessages";
export declare class GetBlockSequenceTypeState implements StubbleState {
    getName(): string;
    canAcceptMessage(msg: StubbleMessage): boolean;
    handleMessage(msg: StubbleMessage, context: StubbleContext): StubbleResult | null;
    init(msg: InitMessage, context: StubbleContext): StubbleResult | null;
    notify(msg: NotifyMessage, context: StubbleContext): StubbleResult | null;
}
