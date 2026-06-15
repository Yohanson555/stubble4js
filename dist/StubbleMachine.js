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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StubbleMachine = void 0;
const lodash_1 = __importDefault(require("lodash"));
const CHARS = __importStar(require("./Characters"));
const States_1 = require("./States");
const StubbleMessages_1 = require("./StubbleMessages");
const Errors_1 = require("./Errors");
class StubbleMachine {
    constructor(tpl) {
        this._stack = [];
        this._res = "";
        this._line = 0; // template lining support
        this._symbol = 0;
        this._template = "";
        this._template = tpl;
    }
    run(context) {
        this._stack = [];
        this._res = "";
        this._stack.push(new States_1.RootState());
        if (this._template) {
            let lines = this._template.split("\n");
            for (var l = 0; l < lines.length; l++) {
                this._line = l + 1;
                let line = lines[l];
                for (var i = 0; i < line.length; i++) {
                    let s = lodash_1.default.last(this._stack);
                    this._symbol = i;
                    let charCode = line.charCodeAt(i);
                    context.symbol = this._symbol;
                    context.line = this._line;
                    this._process(new StubbleMessages_1.ProcessMessage(charCode), context);
                }
                if (l < lines.length - 1) {
                    this._process(new StubbleMessages_1.ProcessMessage(CHARS.ENTER), context);
                }
            }
            this._process(new StubbleMessages_1.ProcessMessage(CHARS.EOS), context);
        }
        return this._res;
    }
    _process(msg, context) {
        let state = lodash_1.default.last(this._stack);
        // console.log(
        //   `State is ${state?.getName()}; Message is "${msg.getName()}"; charCode ${msg.getCode()}`
        // );
        if (state != null && state.canAcceptMessage(msg)) {
            let res = state.handleMessage(msg, context);
            //let res = typeof state["init"] === "function" ? state[msg.getName()](msg, context) : null;
            if (res != null) {
                this._processResult(res, context);
            }
        }
    }
    _processResult(r, context) {
        if (r.result) {
            this._res += r.result;
        }
        if (r.pop == true) {
            this._pop();
        }
        if (r.state) {
            this._stack.push(r.state);
        }
        if (r.message) {
            this._process(r.message, context);
        }
        if (r.err) {
            if (context.opt("ignoreUnregisteredHelperErrors") === true &&
                r.err.code === Errors_1.ERROR_HELPER_UNREGISTERED) {
                console.log(`Warning: ${r.err.text}`);
            }
            else {
                let e = `Error (${r.err.code}) on ${this._currentLine()}:${this._symbol} ${r.err.text}`;
                console.error(e);
                throw new Error(e);
            }
        }
    }
    _pop() {
        this._stack.pop();
    }
    _currentLine() {
        return this._line;
    }
}
exports.StubbleMachine = StubbleMachine;
//# sourceMappingURL=StubbleMachine.js.map