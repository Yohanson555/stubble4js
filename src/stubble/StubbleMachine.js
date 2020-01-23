const _ = require('lodash');
const CHARS = require('./Characters');
const RootState = require('./States/RootState');
const { ProcessMessage } = require('./StubbleMessages');

class StubbleMachine {
  constructor(tpl) {
    this._template = tpl;
    this._stack = [];
    this._res = '';
    this._line = 0; // template lining support
    this._symbol = 0;
  }

  run(context) {
    this._stack = [];
    this._res = '';
    this._stack.push(new RootState());
    

    if (this._template) {
      let lines = this._template.split('\n');

      for (var l = 0; l < lines.length; l++) {
        this._line = l;
        let line = lines[l];

        for (var i = 0; i < line.length; i++) {
          let s = _.last(this._stack);
          this._symbol = i;
          let charCode = line.charCodeAt(i);

          //console.log(`current state is ${s.getName()} (${line[i]})`);
          
          this._process(new ProcessMessage(charCode), context);
        }

        if (l < lines.length - 1) {
          this._process(new ProcessMessage(CHARS.ENTER), context);
        }
      }

      if (!(_.last(this._stack) instanceof RootState)) {
        throw new Error(
            'Something go wrong: please check your template for issues.');
      }
    }

    return this._res;
  }

  _process(msg, context) {
    let state = _.last(this._stack)

    if (state != null && state.canAcceptMessage(msg)) {
      let res = state[msg.getName()](msg, context);

      if (res != null) {
        this._processResult(res, context);
      }
    } else {
      throw new Error(`State ${state.getName()} cant accept message of type ${msg.getName()}`);
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
      let e = `Error (${r.err.code}) on ${this._currentLine()}:${this._symbol} ${r.err.text}`;

      console.error(e);

      throw new Error(e);
    }
  }

  _pop() {
    this._stack.pop();
  }

  _currentLine() {
    return this._line + 1;
  }
}

module.exports = StubbleMachine;