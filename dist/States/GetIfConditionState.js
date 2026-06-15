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
exports.GetIfConditionState = void 0;
const _1 = require("./");
const chars = __importStar(require("../Characters"));
const errors = __importStar(require("../Errors"));
const notifies = __importStar(require("../Notify"));
const StubbleMessages_1 = require("../StubbleMessages");
const StubbleError_1 = require("../StubbleError");
class GetIfConditionState {
    constructor() {
        this.leftPart = "";
        this.rightPart = "";
        this.condition = "";
        this._state = 0;
    }
    getName() {
        return "GetIfConditionState";
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
        if (charCode === chars.EOS) {
            return {
                err: new StubbleError_1.StubbleError(errors.ERROR_UNEXPECTED_END_OF_SOURCE, "unexpected end of source"),
            };
        }
        else if (charCode == chars.CLOSE_BRACKET) {
            return {
                pop: true,
                message: new StubbleMessages_1.NotifyMessage(notifies.NOTIFY_CONDITION_RESULT, msg.charCode, this.checkCondition()),
            };
            // return {
            //   err: new StubbleError(
            //     errors.ERROR_IF_BLOCK_MALFORMED,
            //     "If block condition malformed"
            //   ),
            // };
        }
        else if (charCode == chars.SPACE) {
            return null;
        }
        else {
            switch (this._state) {
                case 0:
                    return {
                        state: new _1.GetAttributeState(),
                        message: new StubbleMessages_1.ProcessMessage(charCode),
                    };
                case 1:
                    return {
                        state: new _1.GetConditionState(),
                        message: new StubbleMessages_1.ProcessMessage(charCode),
                    };
                case 2:
                    return {
                        state: new _1.GetAttributeState(),
                        message: new StubbleMessages_1.ProcessMessage(charCode),
                    };
            }
        }
        return null;
    }
    notify(msg, context) {
        switch (msg.type) {
            case notifies.NOTIFY_ATTR_RESULT:
                if (this._state == 0) {
                    this.leftPart = msg.value;
                    this._state++;
                }
                else {
                    this.rightPart = msg.value;
                    return {
                        pop: true,
                        message: new StubbleMessages_1.NotifyMessage(notifies.NOTIFY_CONDITION_RESULT, msg.charCode, this.checkCondition()),
                    };
                }
                if (msg.charCode != null) {
                    return {
                        message: new StubbleMessages_1.ProcessMessage(msg.charCode),
                    };
                }
                break;
            case notifies.NOTIFY_CONDITION_RESULT:
                this.condition = msg.value;
                this._state++;
                return {
                    message: new StubbleMessages_1.ProcessMessage(msg.charCode),
                };
        }
        return null;
    }
    checkCondition() {
        const { condition, leftPart, rightPart } = this;
        if (!condition) {
            return !!leftPart;
        }
        switch (condition) {
            case "<":
                return leftPart < rightPart;
            case "<=":
                return leftPart <= rightPart;
            case ">":
                return leftPart > rightPart;
            case ">=":
                return leftPart >= rightPart;
            case "==":
                return leftPart == rightPart;
            case "!=":
                return leftPart != rightPart;
            default:
                return false;
        }
    }
}
exports.GetIfConditionState = GetIfConditionState;
//# sourceMappingURL=GetIfConditionState.js.map