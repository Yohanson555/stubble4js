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
exports.RootState = void 0;
const _1 = require("./");
const chars = __importStar(require("../Characters"));
const notifies = __importStar(require("../Notify"));
const StubbleMessages_1 = require("../StubbleMessages");
class RootState {
    constructor() {
        this._escape = false;
    }
    getName() {
        return "RootState";
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
        let res = {};
        let charCode = msg.charCode;
        if (charCode == chars.EOS)
            return null;
        if (this._escape) {
            this._escape = false;
            res.result = String.fromCharCode(charCode);
        }
        else {
            switch (charCode) {
                case chars.BACK_SLASH:
                    this._escape = true;
                    break;
                case chars.OPEN_BRACKET:
                    res.state = new _1.OpenBracketState();
                    break;
                default:
                    res.result = String.fromCharCode(charCode);
            }
        }
        return res;
    }
    notify(msg, context) {
        const res = {};
        switch (msg.type) {
            case notifies.NOTIFY_SECOND_OPEN_BRACKET_FOUND: // done
                res.state = new _1.GetSequenceState();
                break;
            case notifies.NOTIFY_IS_HELPER_SEQUENCE: // done
                res.message = new StubbleMessages_1.InitMessage();
                res.state = new _1.GetHelperState();
                break;
            case notifies.NOTIFY_IS_BLOCK_SEQUENCE: // done
                res.message = new StubbleMessages_1.InitMessage();
                res.state = new _1.GetBlockSequenceTypeState();
                break;
            case notifies.NOTIFY_IS_DATA_SEQUENCE: // done
                res.state = new _1.GetDataState();
                res.message = new StubbleMessages_1.InitMessage(msg.value);
                break;
        }
        return res;
    }
}
exports.RootState = RootState;
//# sourceMappingURL=RootState.js.map