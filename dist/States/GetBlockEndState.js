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
exports.GetBlockEndState = void 0;
const chars = __importStar(require("../Characters"));
const notifies = __importStar(require("../Notify"));
const StubbleMessages_1 = require("../StubbleMessages");
class GetBlockEndState {
    constructor(blockName) {
        this._blockName = blockName; // block name
        this._search = false; // is in close tag searching mode
        this._esc = false; // is escaped character
        this._look = ""; // lookig for tag tpl
        this._tmp = ""; // tmp body
        this._body = ""; // collected body
        this._count = 0; // total character position in searched closed tag
        let _o = String.fromCharCode(chars.OPEN_BRACKET);
        let _c = String.fromCharCode(chars.CLOSE_BRACKET);
        let _s = String.fromCharCode(chars.SLASH);
        let _h = String.fromCharCode(chars.SHARP);
        this._look = `${_o}${_o}${_s}${this._blockName}${_c}${_c}`; // {{/<name>}}
        this._openTag = `${_o}${_o}${_h}${this._blockName}`;
        this._innerOpened = 0;
    }
    getName() {
        return "GetBlockEndState";
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
        if (this._search == true) {
            this._tmp += String.fromCharCode(charCode);
            let l = this._look;
            let t = this._tmp;
            let o = this._openTag;
            let op = context.opt("ignoreTagCaseSensetive");
            if (op === true) {
                l = String(l).toLowerCase();
                t = String(t).toLowerCase();
                o = String(o).toLowerCase();
            }
            if ((l[this._count] != t[this._count] &&
                o[this._count] != t[this._count]) ||
                this._count >= l.length) {
                this._search = false;
                this._body += this._tmp;
            }
            else {
                this._count++;
            }
            if (t === o) {
                this._search = false;
                this._body += this._tmp;
                this._innerOpened++;
            }
            else if (l.length == t.length) {
                if (this._innerOpened > 0) {
                    this._search = false;
                    this._body += this._tmp;
                    this._innerOpened--;
                }
                else {
                    return {
                        pop: true,
                        message: new StubbleMessages_1.NotifyMessage(notifies.NOTIFY_BLOCK_END_RESULT, undefined, this._body),
                    };
                }
            }
        }
        else {
            if (charCode == chars.OPEN_BRACKET && !this._esc) {
                this._search = true;
                this._tmp = "" + String.fromCharCode(chars.OPEN_BRACKET);
                this._count = 0;
            }
            else if (charCode == chars.BACK_SLASH && !this._esc) {
                this._esc = true;
            }
            else {
                this._esc = false;
                this._body += String.fromCharCode(charCode);
            }
        }
        return null;
    }
}
exports.GetBlockEndState = GetBlockEndState;
//# sourceMappingURL=GetBlockEndState.js.map