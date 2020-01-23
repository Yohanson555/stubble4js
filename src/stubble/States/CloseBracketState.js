const chars = require('../Characters');
const errors = require('../Errors');
const notifies = require('../Notify');

const StubbleError = require('../StubbleError');
const { NotifyMessage } = require('../StubbleMessages');
const StubbleResult = require('../StubbleResult');
const StubbleState = require('../StubbleState');

class CloseBracketState extends StubbleState {
  getName = () => "CloseBracketState";

  process(msg, context) {
    let res = new StubbleResult({});
    let charCode = msg.charCode;

    switch (charCode) {
      case chars.CLOSE_BRACKET:
        res.pop = true;
        res.message = new NotifyMessage({type: notifies.NOTIFY_SECOND_CLOSE_BRACKET_FOUND});
        break;
      default:
        res.err = new StubbleError(
          errors.ERROR_CHAR_NOT_A_CLOSE_BRACKET,
          'Wrong character is given. Expected "}"');
    }

    return res;
  }
}

module.exports = CloseBracketState;
