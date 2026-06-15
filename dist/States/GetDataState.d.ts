import { ProcessMessage, InitMessage, NotifyMessage, StubbleMessage } from "../StubbleMessages";
import { StubbleResult } from "../StubbleResult";
import { StubbleState } from "../StubbleState";
import { StubbleContext } from "../StubbleContext";
export declare class GetDataState implements StubbleState {
    private _path;
    getName(): string;
    canAcceptMessage(msg: StubbleMessage): boolean;
    handleMessage(msg: StubbleMessage, context: StubbleContext): StubbleResult | null;
    init(msg: InitMessage, context: StubbleContext): StubbleResult | null;
    process(msg: ProcessMessage, context: StubbleContext): StubbleResult | null;
    notify(msg: NotifyMessage, context: StubbleContext): StubbleResult | null;
    getResult(context: StubbleContext): string;
}
