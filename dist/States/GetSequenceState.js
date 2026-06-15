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
exports.GetSequenceState = void 0;
const chars = __importStar(require("../Characters"));
const errors = __importStar(require("../Errors"));
const notifies = __importStar(require("../Notify"));
const StubbleError_1 = require("../StubbleError");
const StubbleMessages_1 = require("../StubbleMessages");
class GetSequenceState {
    getName() {
        return "GetSequenceState";
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
        let res = {};
        if (charCode == chars.DOLLAR) {
            res.pop = true;
            res.message = new StubbleMessages_1.NotifyMessage(notifies.NOTIFY_IS_HELPER_SEQUENCE, charCode);
        }
        else if (charCode == chars.SHARP) {
            res.pop = true;
            res.message = new StubbleMessages_1.NotifyMessage(notifies.NOTIFY_IS_BLOCK_SEQUENCE, charCode);
        }
        else if ((charCode >= 65 && charCode <= 90) ||
            (charCode >= 97 && charCode <= 122)) {
            res.pop = true;
            res.message = new StubbleMessages_1.NotifyMessage(notifies.NOTIFY_IS_DATA_SEQUENCE, charCode, String.fromCharCode(charCode));
        }
        else {
            res.err = new StubbleError_1.StubbleError(errors.ERROR_WRONG_SEQUENCE_CHARACTER, `Wrong character "${String.fromCharCode(charCode)}" found`);
        }
        return res;
    }
}
exports.GetSequenceState = GetSequenceState;
//# sourceMappingURL=GetSequenceState.js.map