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

class GetEachBlockState extends StubbleState {


  getName() {
    return "GetEachBlockState";
  }

  constructor(symbol, line) {
    super();

    this._path = '';
    this._body = '';

    this._symbol = symbol;
    this._line = line;
  }

  process(msg, context) {
    let charCode = msg.charCode;

    if (charCode == chars.EOS) {
      return new StubbleResult({
        err: new StubbleError(
          errors.ERROR_UNTERMINATED_BLOCK,
          `Unterminated "EACH" block at ${this._line}:${this._symbol}`
        )
      });
    } else if (charCode == chars.CLOSE_BRACKET) {
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
          state: new GetBlockEndState('each')
        });

      case notifies.NOTIFY_BLOCK_END_RESULT:
        this._body = msg.value;
        return this.result(context);
    }
  }

  result(context) {
    let result = new StubbleResult({});

    if (!this._path) {
      result.err = new StubbleError(
        errors.ERROR_PATH_NOT_SPECIFIED,
        '"EACH" block requires path as parameter');
    } else {
      try {
        let data = context.get(this._path);

        if (data) {
          if (_.isArray(data) || _.isObject(data)) {
            let fn = context.compile(this._body);
            let res = '';

            _.forEach(data, (item) => {
              res += fn(item);
            });

            return new StubbleResult({
              result: res,
              pop: true,
            });

          } else {
            result.err = new StubbleError(
              errors.ERROR_WITH_DATA_MALFORMED,
              '"EACH" block data should have "Array" or "Object" type');
          }
        } else {
          result.err = new StubbleError(
            errors.ERROR_PATH_WRONG_SPECIFIED,
            `Can\'t get data from context by path "${this._path}"`);
        }
      } catch (e) {
        result.err = new StubbleError(
          errors.ERROR_CALLING_HELPER, e.toString()
        );
      }
    }

    return result;
  }
}

module.exports = GetEachBlockState;