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
exports.GetDataState = void 0;
const _1 = require("./");
const chars = __importStar(require("../Characters"));
const errors = __importStar(require("../Errors"));
const notifies = __importStar(require("../Notify"));
const StubbleMessages_1 = require("../StubbleMessages");
const StubbleError_1 = require("../StubbleError");
class GetDataState {
    constructor() {
        this._path = "";
    }
    getName() {
        return "GetDataState";
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
        let path = msg.value;
        return {
            state: new _1.GetPathState(path),
        };
    }
    process(msg, context) {
        let charCode = msg.charCode;
        switch (charCode) {
            case chars.EOS:
                return {
                    err: new StubbleError_1.StubbleError(errors.ERROR_UNEXPECTED_END_OF_SOURCE, "unexpected end of source"),
                };
            case chars.SPACE:
                return null;
            case chars.CLOSE_BRACKET:
                return {
                    state: new _1.CloseBracketState(),
                };
            default:
                return {
                    err: new StubbleError_1.StubbleError(errors.ERROR_WRONG_DATA_SEQUENCE_CHARACTER, `Wrong character "${String.fromCharCode(charCode)}" found`),
                };
        }
    }
    notify(msg, context) {
        switch (msg.type) {
            case notifies.NOTIFY_PATH_RESULT:
                this._path = msg.value;
                return {
                    message: new StubbleMessages_1.ProcessMessage(msg.charCode || 0),
                };
            case notifies.NOTIFY_SECOND_CLOSE_BRACKET_FOUND:
                return {
                    pop: true,
                    result: this.getResult(context),
                };
            default:
                return null;
        }
    }
    getResult(context) {
        let result = "";
        let value = context.get(this._path);
        if (value != null) {
            result = value.toString();
        }
        return result;
    }
}
exports.GetDataState = GetDataState;
//# sourceMappingURL=GetDataState.js.map