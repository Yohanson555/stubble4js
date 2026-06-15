import { ProcessMessage, StubbleMessage } from "../StubbleMessages";
import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";
export declare class GetBlockNameState implements StubbleState {
    name: string;
    constructor(name?: string);
    getName(): string;
    canAcceptMessage(msg: StubbleMessage): boolean;
    handleMessage(msg: StubbleMessage, context: StubbleContext): StubbleResult | null;
    process(msg: ProcessMessage, context: StubbleContext): StubbleResult | null;
}
