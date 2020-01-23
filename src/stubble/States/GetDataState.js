const chars = require('../Characters');
const errors = require('../Errors');
const notifies = require('../Notify');
const CloseBracketState = require('./CloseBracketState');
const GetPathState = require('./GetPathState');
const StubbleError = require('../StubbleError');
const { ProcessMessage,  } = require('../StubbleMessages');
const StubbleResult = require('../StubbleResult');
const StubbleState = require('../StubbleState');

class GetDataState extends StubbleState {
  getName = () => "GetDataState";

  constructor() {
    super();

    this._path = '';
  }

  init(msg, context) {
    let path = msg.value;

    return new StubbleResult({ state: new GetPathState(path) });
  }

  process(msg, context) {
    let charCode = msg.charCode;

    switch (charCode) {
      case chars.SPACE:
        return null;
      case chars.CLOSE_BRACKET:
        return new StubbleResult({
          state: new CloseBracketState()
        });

      default:
        return new StubbleResult({
          err: new StubbleError(
            errors.ERROR_WRONG_DATA_SEQUENCE_CHARACTER,
            `Wrong character "${String.fromCharCode(charCode)}" found`,
          )
        });
    }
  }

  notify(msg, context) {
    switch (msg.type) {
      case notifies.NOTIFY_PATH_RESULT:
        this._path = msg.value;

        return new StubbleResult({ 
          message: new ProcessMessage(msg.charCode)
        });
      case notifies.NOTIFY_SECOND_CLOSE_BRACKET_FOUND:
        return new StubbleResult({
          pop: true, 
          result: this.getResult(context)
        });
      default:
        break;
    }

    return null;
  }

  getResult(context) {
    let result = '';

    if (context != null) {
      let value = context.get(this._path);

      if (value != null) {
        result = value.toString();
      }
    }

    return result;
  }
}

module.exports = GetDataState;
