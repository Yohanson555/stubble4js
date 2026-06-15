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
exports.GetBlockNameState = void 0;
const chars = __importStar(require("../Characters"));
const errors = __importStar(require("../Errors"));
const notifies = __importStar(require("../Notify"));
const StubbleMessages_1 = require("../StubbleMessages");
const StubbleError_1 = require("../StubbleError");
class GetBlockNameState {
    constructor(name) {
        this.name = name || "";
    }
    getName() {
        return "GetBlockNameState";
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
                err: new StubbleError_1.StubbleError(errors.ERROR_UNEXPECTED_END_OF_SOURCE, "block name error: unexpected end of source"),
            };
        }
        else if (charCode >= 48 && charCode <= 57) {
            if (!this.name) {
                return {
                    err: new StubbleError_1.StubbleError(errors.ERROR_BLOCK_NAME_WRONG_SPECIFIED, "Block name should not start with number character"),
                };
            }
            this.name += String.fromCharCode(charCode);
        }
        else if ((charCode >= 65 && charCode <= 90) ||
            (charCode >= 97 && charCode <= 122) ||
            charCode == 95) {
            this.name += String.fromCharCode(charCode);
        }
        else if (charCode == chars.SPACE || charCode == chars.CLOSE_BRACKET) {
            if (!this.name) {
                return {
                    err: new StubbleError_1.StubbleError(errors.ERROR_BLOCK_NAME_WRONG_SPECIFIED, "Block name is empty"),
                };
            }
            return {
                pop: true,
                message: new StubbleMessages_1.NotifyMessage(notifies.NOTIFY_NAME_RESULT, charCode, this.name),
            };
        }
        else {
            return {
                err: new StubbleError_1.StubbleError(errors.ERROR_NOT_A_VALID_BLOCK_NAME_CHAR, `Character "${String.fromCharCode(charCode)}" is not a valid in block name`),
            };
        }
        return null;
    }
}
exports.GetBlockNameState = GetBlockNameState;
//# sourceMappingURL=GetBlockNameState.js.map