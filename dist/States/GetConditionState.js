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
exports.GetConditionState = void 0;
const chars = __importStar(require("../Characters"));
const errors = __importStar(require("../Errors"));
const notifies = __importStar(require("../Notify"));
const StubbleMessages_1 = require("../StubbleMessages");
const StubbleError_1 = require("../StubbleError");
class GetConditionState {
    constructor() {
        this._condition = "";
    }
    getName() {
        return "GetConditionState";
    }
    canAcceptMessage(msg) {
        if (msg instanceof StubbleMessages_1.ProcessMessage) {
            return true;
        }
        return false;
    }
    handleMessage(msg, context) {
        if (msg instanceof StubbleMessages_1.ProcessMessage) {
            return this.process(msg, context);
        }
        return null;
    }
    process(msg, context) {
        let charCode = msg.charCode;
        if (charCode === chars.EOS) {
            return {
                err: new StubbleError_1.StubbleError(errors.ERROR_UNEXPECTED_END_OF_SOURCE, "IF condition error: unexpected end of source"),
            };
        }
        else if (charCode == chars.MORE ||
            charCode == chars.LESS ||
            charCode == chars.EQUAL ||
            charCode == chars.EXCL_MARK) {
            this._condition += String.fromCharCode(charCode);
            return null;
        }
        else if (charCode == chars.CLOSE_BRACKET || charCode == chars.SPACE) {
            if (this._condition.length > 2 ||
                ["==", "!=", "<", ">", "<=", ">="].indexOf(this._condition) < 0) {
                return {
                    err: new StubbleError_1.StubbleError(errors.ERROR_IF_BLOCK_CONDITION_MALFORMED, `If block condition malformed: "${this._condition}"`),
                };
            }
            else {
                return {
                    pop: true,
                    message: new StubbleMessages_1.NotifyMessage(notifies.NOTIFY_CONDITION_RESULT, charCode, this._condition),
                };
            }
        }
        return {
            err: new StubbleError_1.StubbleError(errors.ERROR_GETTING_ATTRIBUTE, `Wrong condition character "${String.fromCharCode(charCode)}" (${charCode})`),
        };
    }
}
exports.GetConditionState = GetConditionState;
//# sourceMappingURL=GetConditionState.js.map