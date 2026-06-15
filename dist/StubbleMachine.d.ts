import { StubbleMessage } from "./StubbleMessages";
import { StubbleContext } from "./StubbleContext";
import { StubbleResult } from "./StubbleResult";
export declare class StubbleMachine {
    private _stack;
    private _res;
    private _line;
    private _symbol;
    private _template;
    constructor(tpl: string);
    run(context: StubbleContext): string;
    _process(msg: StubbleMessage, context: StubbleContext): void;
    _processResult(r: StubbleResult, context: StubbleContext): void;
    _pop(): void;
    _currentLine(): number;
}
