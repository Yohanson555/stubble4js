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
exports.GetIfBlockState = void 0;
const _1 = require("./");
const chars = __importStar(require("../Characters"));
const errors = __importStar(require("../Errors"));
const notifies = __importStar(require("../Notify"));
const StubbleError_1 = require("../StubbleError");
const StubbleMessages_1 = require("../StubbleMessages");
class GetIfBlockState {
    constructor(symbol, line) {
        this._res = false;
        this._body = "";
        this._symbol = 0;
        this._line = 0;
        this._symbol = symbol;
        this._line = line;
    }
    getName() {
        return "GetIfBlockState";
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
        if (charCode == chars.EOS) {
            return {
                err: new StubbleError_1.StubbleError(errors.ERROR_UNTERMINATED_BLOCK, `Unterminated "IF" block at ${this._line}:${this._symbol}`),
            };
        }
        else if (charCode == chars.SPACE) {
            return null;
        }
        else if (charCode == chars.CLOSE_BRACKET) {
            return {
                state: new _1.CloseBracketState(),
            };
        }
        return {
            state: new _1.GetIfConditionState(),
            message: new StubbleMessages_1.ProcessMessage(charCode),
        };
    }
    notify(msg, context) {
        switch (msg.type) {
            case notifies.NOTIFY_CONDITION_RESULT:
                this._res = msg.value || false;
                if (msg.charCode != null) {
                    return {
                        message: new StubbleMessages_1.ProcessMessage(msg.charCode),
                    };
                }
                return {};
            case notifies.NOTIFY_SECOND_CLOSE_BRACKET_FOUND:
                return {
                    state: new _1.GetBlockEndState("if"),
                };
            case notifies.NOTIFY_BLOCK_END_RESULT:
                this._body = msg.value;
                return this.result(context);
            default:
                return {};
        }
    }
    result(context) {
        const branches = this.splitBody(this._body);
        let selected = null;
        for (let i = 0; i < branches.length; i++) {
            const b = branches[i];
            let ok = false;
            if (b.kind === "if") {
                ok = this._res === true;
            }
            else if (b.kind === "elseif") {
                try {
                    ok = this.evalElseifCondition(b.condition || "", context);
                }
                catch (e) {
                    return {
                        err: new StubbleError_1.StubbleError(errors.ERROR_IF_BLOCK_MALFORMED, `If block error: ${e}`),
                    };
                }
            }
            else {
                ok = true;
            }
            if (ok) {
                selected = b;
                break;
            }
        }
        let res = "";
        if (selected && selected.body) {
            try {
                let fn = context.compile(selected.body);
                res = fn ? fn(context.data()) : "";
            }
            catch (e) {
                return {
                    err: new StubbleError_1.StubbleError(errors.ERROR_IF_BLOCK_MALFORMED, `If block error: ${e}`),
                };
            }
        }
        return {
            pop: true,
            result: res,
        };
    }
    splitBody(body) {
        const branches = [{ kind: "if", body: "" }];
        let depth = 0;
        let segmentStart = 0;
        let esc = false;
        let i = 0;
        while (i < body.length) {
            const ch = body[i];
            if (ch === "\\" && !esc) {
                esc = true;
                i++;
                continue;
            }
            if (ch === "{" && !esc && body[i + 1] === "{") {
                let j = i + 2;
                while (j < body.length - 1 &&
                    !(body[j] === "}" && body[j + 1] === "}")) {
                    j++;
                }
                if (j >= body.length - 1) {
                    break;
                }
                const tag = body.slice(i + 2, j).trim();
                if (depth === 0 && tag === "else") {
                    branches[branches.length - 1].body = body.slice(segmentStart, i);
                    branches.push({ kind: "else", body: "" });
                    segmentStart = j + 2;
                    i = j + 2;
                    continue;
                }
                if (depth === 0 && /^elseif(\s+|$)/.test(tag)) {
                    const cond = tag.replace(/^elseif\s*/, "");
                    branches[branches.length - 1].body = body.slice(segmentStart, i);
                    branches.push({ kind: "elseif", condition: cond, body: "" });
                    segmentStart = j + 2;
                    i = j + 2;
                    continue;
                }
                if (tag.charAt(0) === "#") {
                    depth++;
                }
                else if (tag.charAt(0) === "/") {
                    depth--;
                }
                i = j + 2;
                esc = false;
                continue;
            }
            esc = false;
            i++;
        }
        branches[branches.length - 1].body = body.slice(segmentStart);
        return branches;
    }
    evalElseifCondition(condition, context) {
        const cond = (condition || "").trim();
        if (!cond) {
            return false;
        }
        const probe = "\u0001ELSEIF_TRUE\u0001";
        const tpl = `{{#if ${cond}}}${probe}{{/if}}`;
        const fn = context.compile(tpl);
        if (!fn) {
            return false;
        }
        return fn(context.data()) === probe;
    }
}
exports.GetIfBlockState = GetIfBlockState;
//# sourceMappingURL=GetIfBlockState.js.map