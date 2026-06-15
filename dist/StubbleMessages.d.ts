export interface StubbleMessage {
    getName(): string;
    getCode(): string;
}
export declare class InitMessage implements StubbleMessage {
    readonly value?: any;
    constructor(value?: any);
    getName(): string;
    getCode(): string;
}
export declare class ProcessMessage implements StubbleMessage {
    readonly charCode: number;
    constructor(charCode: number);
    getName(): string;
    getCode(): string;
}
export declare class NotifyMessage implements StubbleMessage {
    readonly type: number;
    readonly charCode?: number | undefined;
    readonly value?: any;
    constructor(type: number, charCode?: number | undefined, value?: any);
    getName(): string;
    getCode(): string;
}
