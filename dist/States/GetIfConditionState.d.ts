import { ProcessMessage, NotifyMessage, StubbleMessage } from "../StubbleMessages";
import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";
export declare class GetIfConditionState implements StubbleState {
    private leftPart;
    private rightPart;
    private condition;
    private _state;
    getName(): string;
    canAcceptMessage(msg: StubbleMessage): boolean;
    handleMessage(msg: StubbleMessage, context: StubbleContext): StubbleResult | null;
    process(msg: ProcessMessage, context: StubbleContext): StubbleResult | null;
    notify(msg: NotifyMessage, context: StubbleContext): StubbleResult | null;
    checkCondition(): boolean;
}
