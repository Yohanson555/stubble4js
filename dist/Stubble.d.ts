import { HelperFunction } from "./StubbleContext";
export declare type SubbleOptions = {
    ignoreUnregisteredHelperErrors?: boolean;
    ignoreTagCaseSensetive?: boolean;
};
export declare class Stubble {
    private _helpers;
    private _options;
    constructor(helpers: {
        [key: string]: HelperFunction;
    }, options?: SubbleOptions);
    compile(template: string): (data: {
        [key: string]: any;
    }) => string;
    registerHelper(name: string, helper: HelperFunction): boolean;
    removeHelper(name: string): boolean;
    dropHelpers(): boolean;
    helperCount(): number;
    setOption<T extends keyof SubbleOptions>(name: T, value: any): void;
}
export default Stubble;
