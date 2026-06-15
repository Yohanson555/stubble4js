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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEachBlockState = void 0;
const lodash_1 = __importDefault(require("lodash"));
const _1 = require("./");
const chars = __importStar(require("../Characters"));
const errors = __importStar(require("../Errors"));
const notifies = __importStar(require("../Notify"));
const StubbleError_1 = require("../StubbleError");
const StubbleMessages_1 = require("../StubbleMessages");
class GetEachBlockState {
    constructor(symbol, line) {
        this._path = "";
        this._body = "";
        this._symbol = symbol;
        this._line = line;
    }
    getName() {
        return "GetEachBlockState";
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
                err: new StubbleError_1.StubbleError(errors.ERROR_UNTERMINATED_BLOCK, `Unterminated "EACH" block at ${this._line}:${this._symbol}`),
            };
        }
        else if (charCode == chars.CLOSE_BRACKET) {
            return {
                state: new _1.CloseBracketState(),
            };
        }
        else if (charCode == chars.SPACE) {
            return null;
        }
        return {
            state: new _1.GetPathState(""),
            message: new StubbleMessages_1.ProcessMessage(charCode),
        };
    }
    notify(msg, context) {
        switch (msg.type) {
            case notifies.NOTIFY_PATH_RESULT:
                this._path = msg.value;
                return {
                    message: new StubbleMessages_1.ProcessMessage(msg.charCode),
                };
            case notifies.NOTIFY_SECOND_CLOSE_BRACKET_FOUND:
                return {
                    state: new _1.GetBlockEndState("each"),
                };
            case notifies.NOTIFY_BLOCK_END_RESULT:
                this._body = msg.value;
                return this.result(context);
        }
        return null;
    }
    result(context) {
        var _a;
        const result = {};
        if (!this._path) {
            result.err = new StubbleError_1.StubbleError(errors.ERROR_PATH_NOT_SPECIFIED, '"EACH" block requires path as parameter');
        }
        else {
            try {
                let data = (_a = context.get(this._path)) !== null && _a !== void 0 ? _a : [];
                if (lodash_1.default.isArray(data) || lodash_1.default.isObject(data)) {
                    let fn = context.compile(this._body);
                    let res = "";
                    lodash_1.default.forEach(data, (item) => {
                        res += fn ? fn(item) : "";
                    });
                    return {
                        result: res,
                        pop: true,
                    };
                }
                else {
                    result.err = new StubbleError_1.StubbleError(errors.ERROR_WITH_DATA_MALFORMED, '"EACH" block data should have "Array" or "Object" type');
                }
            }
            catch (e) {
                result.err = new StubbleError_1.StubbleError(errors.ERROR_CALLING_HELPER, e.toString());
            }
        }
        return result;
    }
}
exports.GetEachBlockState = GetEachBlockState;
//# sourceMappingURL=GetEachBlockState.js.map