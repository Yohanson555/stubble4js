const CloseBracketState = require('./CloseBracketState');
const GetBlockEndState = require('./GetBlockEndState');
const GetIfConditionState = require('./GetIfConditionState');
const chars = require('../Characters');
const errors = require('../Errors');
const notifies = require('../Notify');
const StubbleError = require('../StubbleError');
const { ProcessMessage } = require('../StubbleMessages');
const StubbleResult = require('../StubbleResult');
const StubbleState = require('../StubbleState');

class GetIfBlockState extends StubbleState {
  getName() {
    return "GetIfBlockState";
  }

  constructor(symbol, line) {
    super();

    this._res = false;
    this._body;
    this._symbol = symbol;
    this._line = line;
  }

  process(msg, context) {
    let charCode = msg.charCode;

    if (charCode == chars.EOS) {
      return new StubbleResult({
        err: new StubbleError(
          errors.ERROR_UNTERMINATED_BLOCK,
          `Unterminated "IF" block at ${this._line}:${this._symbol}`
        )
      });
    } else if (charCode == chars.SPACE) {
      return null;
    } else if (charCode == chars.CLOSE_BRACKET) {
      return new StubbleResult({
        state: new CloseBracketState()
      });
    }

    return new StubbleResult({
      state: new GetIfConditionState(),
      message: new ProcessMessage(charCode),
    });
  }

  notify(msg, context) {
    switch (msg.type) {
      case notifies.NOTIFY_CONDITION_RESULT:
        this._res = msg.value || false;

        if (msg.charCode != null) {
          return new StubbleResult({
            message: new ProcessMessage(msg.charCode)
          });
        }

        break;
      case notifies.NOTIFY_SECOND_CLOSE_BRACKET_FOUND:
        return new StubbleResult({
          state: new GetBlockEndState('if')
        });

      case notifies.NOTIFY_BLOCK_END_RESULT:
        this._body = msg.value;
        return this.result(context);
    }
  }

  result(context) {
    var res = '';

    if (this._res == true) {
      try {
        let fn = context.compile(this._body);
        res = fn(context.data());
      } catch (e) {
        return new StubbleResult({
          err: new StubbleError(
            errors.ERROR_IF_BLOCK_MALFORMED,
            `If block error: ${e}`)

        });
      }
    }

    return new StubbleResult({
      pop: true,
      result: res
    });
  }
}

module.exports = GetIfBlockState;