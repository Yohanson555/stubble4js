const _ = require('lodash');
const CloseBracketState = require('./CloseBracketState');
const GetBlockEndState = require('./GetBlockEndState');
const GetPathState = require('./GetPathState');
const chars = require('../Characters');
const errors = require('../Errors');
const notifies = require('../Notify');
const StubbleError = require('../StubbleError');
const { ProcessMessage } = require('../StubbleMessages');
const StubbleResult = require('../StubbleResult');
const StubbleState = require('../StubbleState');

class GetWithBlockState extends StubbleState {
  getName = () => "GetWithBlockState";

  constructor() {
    super();

    this._path = '';
    this._body = '';
  }

  process(msg, context) {
    let charCode = msg.charCode;

    if (charCode == chars.CLOSE_BRACKET) {
      return new StubbleResult({
        state: new CloseBracketState()
      });
    } else if (charCode == chars.SPACE) {
      return null;
    }

    return new StubbleResult({
      state: new GetPathState(),
      message: new ProcessMessage(charCode)
    });
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
          state: new GetBlockEndState('with')
        });

      case notifies.NOTIFY_BLOCK_END_RESULT:
        this._body = msg.value;
        return this.result(context);

      default:
        return new StubbleResult({
          err: new StubbleError(
            errors.ERROR_UNSUPPORTED_NOTIFY,
            `State "${this.getName()}" does not support notifies of type ${msg.type}`)
        });
    }
  }

  result(context) {
    let result = new StubbleResult({});

    if (!this._path) {
      result.err = new StubbleError(
        errors.ERROR_PATH_NOT_SPECIFIED,
        'With block required path to context data'
      );
    } else {
      try {
        let data = context.get(this._path);

        if (data != null) {
          if (_.isObject(data)) {
            let fn = context.compile(this._body);

            return new StubbleResult({
              result: fn(data),
              pop: true,
            });
          } else {
            result.err = new StubbleError(
              errors.ERROR_WITH_DATA_MALFORMED,
              '"With" block data should have "Object" type');
          }
        } else {
          result.err = new StubbleError(
            errors.ERROR_PATH_WRONG_SPECIFIED,
            `Can\'t get data from context by path "${this._path}"`);
        }
      } catch (e) {
        result.err = new StubbleError(errors.ERROR_CALLING_HELPER, e.toString());
      }
    }

    return result;
  }
}

module.exports = GetWithBlockState;