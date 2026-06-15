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
exports.GetPathState = void 0;
const chars = __importStar(require("../Characters"));
const errors = __importStar(require("../Errors"));
const notifies = __importStar(require("../Notify"));
const StubbleMessages_1 = require("../StubbleMessages");
const StubbleError_1 = require("../StubbleError");
class GetPathState {
    constructor(path) {
        this.lastChar = 0;
        this.path = path || "";
    }
    getName() {
        return "GetPathState";
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
        if (charCode == chars.EOS) {
            return {
                pop: true,
                message: new StubbleMessages_1.ProcessMessage(charCode),
            };
        }
        else if (charCode == chars.DOT) {
            if (!this.path) {
                return {
                    err: new StubbleError_1.StubbleError(errors.ERROR_PATH_WRONG_SPECIFIED, "Path should not start with point character"),
                };
            }
            this.path += String.fromCharCode(charCode);
        }
        else if (charCode >= 48 && charCode <= 57) {
            if (!this.path) {
                return {
                    err: new StubbleError_1.StubbleError(errors.ERROR_PATH_WRONG_SPECIFIED, "Path should not start with number character"),
                };
            }
            this.path += String.fromCharCode(charCode);
        }
        else if ((charCode >= 65 && charCode <= 90) ||
            (charCode >= 97 && charCode <= 122) ||
            charCode == 95) {
            this.path += String.fromCharCode(charCode);
        }
        else if (charCode == chars.SPACE || charCode == chars.CLOSE_BRACKET) {
            if (this.lastChar == chars.DOT) {
                return {
                    err: new StubbleError_1.StubbleError(errors.ERROR_PATH_WRONG_SPECIFIED, "Path should not end with dot character"),
                };
            }
            return {
                pop: true,
                message: new StubbleMessages_1.NotifyMessage(notifies.NOTIFY_PATH_RESULT, charCode, this.path),
            };
        }
        else {
            return {
                err: new StubbleError_1.StubbleError(errors.ERROR_NOT_A_VALID_PATH_CHAR, `Character "${String.fromCharCode(charCode)}" is not a valid in path`),
            };
        }
        this.lastChar = charCode;
        return null;
    }
}
exports.GetPathState = GetPathState;
//# sourceMappingURL=GetPathState.js.map