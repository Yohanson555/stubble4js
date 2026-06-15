"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetHelperState = void 0;
const _1 = require("./");
const chars = __importStar(require("../Characters"));
const errors = __importStar(require("../Errors"));
const notifies = __importStar(require("../Notify"));
const StubbleError_1 = require("../StubbleError");
const StubbleMessages_1 = require("../StubbleMessages");
class GetHelperState {
    constructor() {
        this._helper = "";
        this._attributes = [];
    }
    getName() {
        return "GetHelperState";
    }
    canAcceptMessage(msg) {
        return true;
    }
    handleMessage(msg, context) {
        if (msg instanceof StubbleMessages_1.ProcessMessage) {
            return this.process(msg, context);
        }
        if (msg instanceof StubbleMessages_1.InitMessage) {
            return this.init(msg, context);
        }
        if (msg instanceof StubbleMessages_1.NotifyMessage) {
            return this.notify(msg, context);
        }
        return null;
    }
    init(msg, context) {
        this._helper = "";
        this._attributes = [];
        return {
            state: new _1.GetBlockNameState(),
        };
    }
    process(msg, context) {
        let charCode = msg.charCode;
        if (charCode == chars.CLOSE_BRACKET) {
            return {
                state: new _1.CloseBracketState(),
            };
        }
        else if (charCode == chars.SPACE) {
            return null;
        }
        return {
            state: new _1.GetAttributeState(),
            message: new StubbleMessages_1.ProcessMessage(charCode),
        };
    }
    notify(msg, context) {
        switch (msg.type) {
            case notifies.NOTIFY_NAME_RESULT:
                this._helper = msg.value;
                return {
                    message: new StubbleMessages_1.ProcessMessage(msg.charCode),
                };
            case notifies.NOTIFY_SECOND_CLOSE_BRACKET_FOUND:
                return this.result(context);
            case notifies.NOTIFY_ATTR_RESULT:
                this._attributes.push(msg.value);
                if (msg.charCode != null) {
                    return {
                        message: new StubbleMessages_1.ProcessMessage(msg.charCode),
                    };
                }
                break;
        }
        return null;
    }
    result(context) {
        if (!context.callable(this._helper)) {
            return {
                pop: true,
                err: new StubbleError_1.StubbleError(errors.ERROR_HELPER_UNREGISTERED, `Helper "${this._helper}" is unregistered`),
            };
        }
        const result = {};
        try {
            if (!this._attributes || this._attributes.length == 0) {
                this._attributes = [context.data()];
            }
            result.result = context.call(this._helper, this._attributes, () => "");
            result.pop = true;
        }
        catch (e) {
            result.err = new StubbleError_1.StubbleError(errors.ERROR_CALLING_HELPER, `Error in helper function ${this._helper}: ${e.toString()}`);
        }
        return result;
    }
}
exports.GetHelperState = GetHelperState;
//# sourceMappingURL=GetHelperState.js.map