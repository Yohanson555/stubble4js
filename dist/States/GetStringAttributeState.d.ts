import { ProcessMessage, StubbleMessage } from "../StubbleMessages";
import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";
export declare class GetStringAttributeState implements StubbleState {
    private _value;
    private _escape;
    private quoteSymbol;
    constructor(quoteSymbol: number);
    canAcceptMessage(msg: StubbleMessage): boolean;
    handleMessage(msg: StubbleMessage, context: StubbleContext): StubbleResult | null;
    getName(): string;
    process(msg: ProcessMessage, context: StubbleContext): StubbleResult | null;
}
