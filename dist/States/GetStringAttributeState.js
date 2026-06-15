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
exports.GetStringAttributeState = void 0;
const chars = __importStar(require("../Characters"));
const notifies = __importStar(require("../Notify"));
const errors = __importStar(require("../Errors"));
const StubbleMessages_1 = require("../StubbleMessages");
const StubbleError_1 = require("../StubbleError");
class GetStringAttributeState {
    constructor(quoteSymbol) {
        this._value = "";
        this._escape = false;
        this.quoteSymbol = quoteSymbol;
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
    getName() {
        return "GetStringAttributeState";
    }
    process(msg, context) {
        let charCode = msg.charCode;
        if (this._escape) {
            this._escape = false;
            this._value += String.fromCharCode(charCode);
        }
        else {
            if (charCode == chars.OPEN_BRACKET || charCode == chars.CLOSE_BRACKET) {
                return {
                    err: new StubbleError_1.StubbleError(errors.ERROR_STRING_ATTRIBUTE_MALFORMED, `Wrong attribute value character "${String.fromCharCode(charCode)}"`),
                };
            }
            else if (charCode == chars.BACK_SLASH) {
                this._escape = true;
            }
            else if (charCode == this.quoteSymbol) {
                return {
                    pop: true,
                    message: new StubbleMessages_1.NotifyMessage(notifies.NOTIFY_ATTR_RESULT, undefined, this._value),
                };
            }
            else {
                this._value += String.fromCharCode(charCode);
            }
        }
        return null;
    }
}
exports.GetStringAttributeState = GetStringAttributeState;
//# sourceMappingURL=GetStringAttributeState.js.map