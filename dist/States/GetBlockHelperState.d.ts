import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";
import { ProcessMessage, NotifyMessage, StubbleMessage } from "../StubbleMessages";
export declare class GetBlockHelperState implements StubbleState {
    private _helper;
    private _symbol;
    private _line;
    private _attributes;
    private _body;
    constructor(helper: string, symbol: number, line: number);
    getName(): string;
    canAcceptMessage(msg: StubbleMessage): boolean;
    handleMessage(msg: StubbleMessage, context: StubbleContext): StubbleResult | null;
    process(msg: ProcessMessage, context: StubbleContext): StubbleResult | null;
    notify(msg: NotifyMessage, context: StubbleContext): StubbleResult | null;
    result(context: StubbleContext): StubbleResult;
}
