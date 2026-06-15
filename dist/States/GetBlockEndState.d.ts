import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";
import { ProcessMessage, StubbleMessage } from "../StubbleMessages";
export declare class GetBlockEndState implements StubbleState {
    private _blockName;
    private _look;
    private _tmp;
    private _body;
    private _openTag;
    private _search;
    private _esc;
    private _count;
    private _innerOpened;
    constructor(blockName: string);
    getName(): string;
    canAcceptMessage(msg: StubbleMessage): boolean;
    handleMessage(msg: StubbleMessage, context: StubbleContext): StubbleResult | null;
    process(msg: ProcessMessage, context: StubbleContext): StubbleResult | null;
}
