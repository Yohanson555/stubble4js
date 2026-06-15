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
exports.GetNumberAttributeState = void 0;
const chars = __importStar(require("../Characters"));
const errors = __importStar(require("../Errors"));
const notifies = __importStar(require("../Notify"));
const StubbleError_1 = require("../StubbleError");
const StubbleMessages_1 = require("../StubbleMessages");
class GetNumberAttributeState {
    constructor(value) {
        this.value = "";
        this.value = value || "";
    }
    getName() {
        return "GetNumberAttributeState";
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
        if (charCode == chars.CLOSE_BRACKET || charCode == chars.SPACE) {
            return {
                pop: true,
                message: new StubbleMessages_1.NotifyMessage(notifies.NOTIFY_ATTR_RESULT, charCode, this.value.indexOf(String.fromCharCode(chars.DOT)) > 0
                    ? parseFloat(this.value)
                    : parseInt(this.value)),
            };
        }
        else if (charCode == chars.DOT) {
            if (this.value.indexOf(String.fromCharCode(chars.DOT)) > 0) {
                return {
                    err: new StubbleError_1.StubbleError(errors.ERROR_NUMBER_ATTRIBUTE_MALFORMED, "Duplicate number delimiter"),
                };
            }
            this.value += String.fromCharCode(charCode);
        }
        else if (charCode >= 48 && charCode <= 57) {
            this.value += String.fromCharCode(charCode);
        }
        else {
            return {
                err: new StubbleError_1.StubbleError(errors.ERROR_NUMBER_ATTRIBUTE_MALFORMED, "Number attribute malformed"),
            };
        }
        return null;
    }
}
exports.GetNumberAttributeState = GetNumberAttributeState;
//# sourceMappingURL=GetNumberAttributeState.js.map