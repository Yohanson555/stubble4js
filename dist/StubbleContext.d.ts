export declare type HelperFunction = (attributes: any[], fn: CompillerFunction) => string;
export declare type CompillerFunction = (data: {
    [key: string]: any;
}) => string;
export declare type BuilderFunction = null | ((template: string) => CompillerFunction);
export declare class StubbleContext {
    private _data;
    private _helpers;
    private _options;
    private _fn;
    symbol: number;
    line: number;
    constructor(_data: any, _helpers: {
        [key: string]: HelperFunction;
    }, _options: {
        [key: string]: any;
    }, _fn: BuilderFunction);
    callable(helper: string): boolean;
    call(helper: string, attributes: any[], fn: CompillerFunction): string;
    compile(template: string): CompillerFunction;
    get(path: string | string[]): any;
    opt(name: string): any;
    data(): any;
    helpers(): {
        [key: string]: HelperFunction;
    };
}
