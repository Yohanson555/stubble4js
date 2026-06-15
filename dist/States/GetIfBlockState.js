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
exports.GetIfBlockState = void 0;
const _1 = require("./");
const chars = __importStar(require("../Characters"));
const errors = __importStar(require("../Errors"));
const notifies = __importStar(require("../Notify"));
const StubbleError_1 = require("../StubbleError");
const StubbleMessages_1 = require("../StubbleMessages");
class GetIfBlockState {
    constructor(symbol, line) {
        this._res = false;
        this._body = "";
        this._symbol = 0;
        this._line = 0;
        this._symbol = symbol;
        this._line = line;
    }
    getName() {
        return "GetIfBlockState";
    }
    canAcceptMessage(msg) {
        if (msg instanceof StubbleMessages_1.ProcessMessage || msg instanceof StubbleMessages_1.NotifyMessage) {
            return true;
        }
        return false;
    }
    handleMessage(msg, context) {
        if (msg instanceof StubbleMessages_1.ProcessMessage) {
            return this.process(msg, context);
        }
        if (msg instanceof StubbleMessages_1.NotifyMessage) {
            return this.notify(msg, context);
        }
        return null;
    }
    process(msg, context) {
        let charCode = msg.charCode;
        if (charCode == chars.EOS) {
            return {
                err: new StubbleError_1.StubbleError(errors.ERROR_UNTERMINATED_BLOCK, `Unterminated "IF" block at ${this._line}:${this._symbol}`),
            };
        }
        else if (charCode == chars.SPACE) {
            return null;
        }
        else if (charCode == chars.CLOSE_BRACKET) {
            return {
                state: new _1.CloseBracketState(),
            };
        }
        return {
            state: new _1.GetIfConditionState(),
            message: new StubbleMessages_1.ProcessMessage(charCode),
        };
    }
    notify(msg, context) {
        switch (msg.type) {
            case notifies.NOTIFY_CONDITION_RESULT:
                this._res = msg.value || false;
                if (msg.charCode != null) {
                    return {
                        message: new StubbleMessages_1.ProcessMessage(msg.charCode),
                    };
                }
                return {};
            case notifies.NOTIFY_SECOND_CLOSE_BRACKET_FOUND:
                return {
                    state: new _1.GetBlockEndState("if"),
                };
            case notifies.NOTIFY_BLOCK_END_RESULT:
                this._body = msg.value;
                return this.result(context);
            default:
                return {};
        }
    }
    result(context) {
        let res = "";
        try {
            let fn = context.compile(this._body);
            res = fn ? fn(context.data()) : "";
        }
        catch (e) {
            return {
                err: new StubbleError_1.StubbleError(errors.ERROR_IF_BLOCK_MALFORMED, `If block error: ${e}`),
            };
        }
        if (this._res !== true) {
            res = "";
        }
        return {
            pop: true,
            result: res,
        };
    }
}
exports.GetIfBlockState = GetIfBlockState;
//# sourceMappingURL=GetIfBlockState.js.map