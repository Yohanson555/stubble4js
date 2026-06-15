import { ProcessMessage, NotifyMessage, StubbleMessage } from "../StubbleMessages";
import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";
export declare class GetEachBlockState implements StubbleState {
    private _path;
    private _body;
    private _symbol;
    private _line;
    constructor(symbol: number, line: number);
    getName(): string;
    canAcceptMessage(msg: StubbleMessage): boolean;
    handleMessage(msg: StubbleMessage, context: StubbleContext): StubbleResult | null;
    process(msg: ProcessMessage, context: StubbleContext): StubbleResult | null;
    notify(msg: NotifyMessage, context: StubbleContext): StubbleResult | null;
    result(context: StubbleContext): StubbleResult;
}
