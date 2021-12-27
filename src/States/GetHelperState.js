const CloseBracketState = require('./CloseBracketState');
const GetAttributeState = require('./GetAttributeState');
const GetBlockNameState = require('./GetBlockNameState');
const chars = require('../Characters');
const errors = require('../Errors');
const notifies = require('../Notify');
const StubbleError = require('../StubbleError');
const { ProcessMessage } = require('../StubbleMessages');
const StubbleResult = require('../StubbleResult');
const StubbleState = require('../StubbleState');

class GetHelperState extends StubbleState {
  getName() {
    return "GetHelperState";
  }

  constructor() {
    super();

    this._helper = '';
    this._attributes = [];
  }

  init(/* msg, context */) {
    this._helper = '';
    this._attributes = [];

    return new StubbleResult({
      state: new GetBlockNameState()
    });
  }

  process(msg, /* context */) {
    let charCode = msg.charCode;

    if (charCode == chars.CLOSE_BRACKET) {
      return new StubbleResult({
        state: new CloseBracketState()
      });
    } else if (charCode == chars.SPACE) {
      return null;
    }

    return new StubbleResult({
      state: new GetAttributeState(),
      message: new ProcessMessage(charCode)
    });
  }

  notify(msg, context) {
    switch (msg.type) {
      case notifies.NOTIFY_NAME_RESULT:
        this._helper = msg.value;

        return new StubbleResult({
          message: new ProcessMessage(msg.charCode)
        });

      case notifies.NOTIFY_SECOND_CLOSE_BRACKET_FOUND:
        return this.result(context);

      case notifies.NOTIFY_ATTR_RESULT:
        this._attributes.push(msg.value);

        if (msg.charCode != null) {
          return new StubbleResult({
            message: new ProcessMessage(msg.charCode)
          });
        }

        break;
    }

    return null;
  }

  result(context) {
    if (!context.callable(this._helper)) {
      return new StubbleResult({
        pop: true,
        err: new StubbleError(
          errors.ERROR_HELPER_UNREGISTERED,
          `Helper "${this._helper}" is unregistered`
        )
      });
    }

    let result = new StubbleResult({});

    try {
      if (!this._attributes || this._attributes.length == 0) {
        this._attributes = [context.data()];
      }

      result.result = context.call(this._helper, this._attributes, null);
      result.pop = true;
    } catch (e) {
      result.err = new StubbleError(
        errors.ERROR_CALLING_HELPER,
        `Error in helper function ${this._helper}: ${e.toString()}`);
    }

    return result;
  }
}

module.exports = GetHelperState;