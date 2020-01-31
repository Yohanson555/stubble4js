const chars = require('../Characters');
const errors = require('../Errors');
const notifies = require('../Notify');
const StubbleError = require('../StubbleError');
const { NotifyMessage } = require('../StubbleMessages');
const StubbleResult = require('../StubbleResult');
const StubbleState = require('../StubbleState');

class OpenBracketState extends StubbleState {
  getName() {
    return 'OpenBracketState';
  }

  process(msg, context) {
    let charCode = msg.charCode;
    let res = new StubbleResult({});

    switch (charCode) {
      case chars.OPEN_BRACKET:
        res.pop = true;
        res.message = new NotifyMessage({
          charCode: charCode,
          type: notifies.NOTIFY_SECOND_OPEN_BRACKET_FOUND,
        });

        break;
      default:
        res.err = new StubbleError(
          errors.ERROR_CHAR_NOT_A_OPEN_BRACKET,
          'Wrong character is given. Expected "{"');
    }

    return res;
  }
}

module.exports = OpenBracketState;