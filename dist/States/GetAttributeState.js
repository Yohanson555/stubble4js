"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAttributeState = void 0;
const _1 = require("./");
const chars = require("../Characters");
const errors = require("../Errors");
const StubbleError_1 = require("../StubbleError");
const StubbleMessages_1 = require("../StubbleMessages");
class GetAttributeState {
    getName() {
        return "GetAttributeState";
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
        if (charCode == chars.QUOTE || charCode == chars.SINGLE_QUOTE) {
            return {
                pop: true,
                state: new _1.GetStringAttributeState(charCode),
            };
        }
        else if (charCode >= 48 && charCode <= 57) {
            return {
                pop: true,
                state: new _1.GetNumberAttributeState(),
                message: new StubbleMessages_1.ProcessMessage(charCode),
            };
        }
        else if ((charCode >= 65 && charCode <= 90) ||
            (charCode >= 97 && charCode <= 122) ||
            charCode == 95) {
            return {
                pop: true,
                message: new StubbleMessages_1.InitMessage(String.fromCharCode(charCode)),
                state: new _1.GetPathAttributeState(),
            };
        }
        return {
            err: new StubbleError_1.StubbleError(errors.ERROR_GETTING_ATTRIBUTE, `Wrong attribute character "${String.fromCharCode(charCode)}"`),
        };
    }
}
exports.GetAttributeState = GetAttributeState;
//# sourceMappingURL=GetAttributeState.js.map