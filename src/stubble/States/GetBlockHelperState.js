const CloseBracketState = require('./CloseBracketState');
const GetAttributeState = require('./GetAttributeState');
const GetBlockEndState = require('./GetBlockEndState');
const chars = require('../Characters');
const errors = require('../Errors');
const notifies = require('../Notify');
const StubbleError = require('../StubbleError');
const { ProcessMessage } = require('../StubbleMessages');
const StubbleResult = require('../StubbleResult');
const StubbleState = require('../StubbleState');


class GetBlockHelperState extends StubbleState {
  getName = () => "GetBlockHelperState";

  constructor(helper) {
    super();

    this._helper = helper;
    this._attributes = [];
    this._body = '';
  }

  process(msg, context) {
    let charCode = msg.charCode;

    if (charCode == chars.CLOSE_BRACKET) {
      return new StubbleResult({ state: new CloseBracketState() });
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
      case notifies.NOTIFY_SECOND_CLOSE_BRACKET_FOUND:
        return new StubbleResult({ state: new GetBlockEndState(this._helper) });
      case notifies.NOTIFY_ATTR_RESULT:
        this._attributes.push(msg.value);

        if (msg.charCode != null) {
          return new StubbleResult({ message: new ProcessMessage(msg.charCode) });
        }

        break;
      case notifies.NOTIFY_BLOCK_END_RESULT:
        this._body = msg.value;
        return this.result(context);
      default:
        break;
    }

    return null;
  }

  result(context) {
    let result = new StubbleResult({});

    try {
      if (this._attributes && this._attributes.length) {
        this._attributes.push(context.data);
      }

      result.result = context.call(this._helper, this._attributes, context.compile(this._body));
      result.pop = true;
    } catch (e) {
      console.log(e);
      result.err = new StubbleError(errors.ERROR_CALLING_HELPER, e.toString());
    }

    return result;
  }
}

module.exports = GetBlockHelperState;