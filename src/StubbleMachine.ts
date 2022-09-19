import _ from "lodash";
import * as CHARS from "./Characters";
import { RootState } from "./States";
import { ProcessMessage, StubbleMessage } from "./StubbleMessages";
import { ERROR_HELPER_UNREGISTERED } from "./Errors";
import { StubbleContext } from "./StubbleContext";
import { StubbleState } from "./StubbleState";
import { StubbleResult } from "./StubbleResult";

export class StubbleMachine {
  private _stack: StubbleState[] = [];
  private _res: string = "";
  private _line: number = 0; // template lining support
  private _symbol: number = 0;
  private _template: string = "";

  constructor(tpl: string) {
    this._template = tpl;
  }

  run(context: StubbleContext) {
    this._stack = [];
    this._res = "";
    this._stack.push(new RootState());

    if (this._template) {
      let lines = this._template.split("\n");

      for (var l = 0; l < lines.length; l++) {
        this._line = l + 1;
        let line = lines[l];

        for (var i = 0; i < line.length; i++) {
          let s = _.last(this._stack);
          this._symbol = i;
          let charCode = line.charCodeAt(i);

          context.symbol = this._symbol;
          context.line = this._line;

          //console.log(`State is ${s.getName()}; Character is ${String.fromCharCode(charCode)}`);

          this._process(new ProcessMessage(charCode), context);
        }

        if (l < lines.length - 1) {
          this._process(new ProcessMessage(CHARS.ENTER), context);
        }
      }

      this._process(new ProcessMessage(CHARS.EOS), context);
    }

    return this._res;
  }

  _process(msg: StubbleMessage, context: StubbleContext) {
    let state = _.last(this._stack);

    if (state != null && state.canAcceptMessage(msg)) {

      let res = state.handleMessage(msg, context);

      //let res = typeof state["init"] === "function" ? state[msg.getName()](msg, context) : null;

      if (res != null) {
        this._processResult(res, context);
      }
    }
  }

  _processResult(r: StubbleResult, context: StubbleContext) {
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
      if (
        context.opt("ignoreUnregisteredHelperErrors") === true &&
        r.err.code === ERROR_HELPER_UNREGISTERED
      ) {
        console.log(`Warning: ${r.err.text}`);
      } else {
        let e = `Error (${r.err.code}) on ${this._currentLine()}:${
          this._symbol
        } ${r.err.text}`;

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
