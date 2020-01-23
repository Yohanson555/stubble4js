const chars = require('../Characters');
const errors = require('../Errors');
const notifies = require('../Notify');
const StubbleError = require('../StubbleError');
const { NotifyMessage } = require('../StubbleMessages');
const StubbleResult = require('../StubbleResult');
const StubbleState = require('../StubbleState');

class GetSequenceState extends StubbleState {
  getName = () => "GetSequenceState";

  process(msg, context) {
    let charCode = msg.charCode;
    let res = new StubbleResult({});

    if (charCode == chars.DOLLAR) {
      res.pop = true;
      res.message = new NotifyMessage({
        charCode: charCode,
        type: notifies.NOTIFY_IS_HELPER_SEQUENCE,
      });
    } else if (charCode == chars.SHARP) {
      res.pop = true;
      res.message = new NotifyMessage({
        charCode: charCode,
        type: notifies.NOTIFY_IS_BLOCK_SEQUENCE,
      });
    } else if ((charCode >= 65 && charCode <= 90) ||
        (charCode >= 97 && charCode <= 122)) {
      res.pop = true;
      res.message = new NotifyMessage({
        charCode: charCode,
        type: notifies.NOTIFY_IS_DATA_SEQUENCE,
        value: String.fromCharCode(charCode)});
    } else {
      res.err = new StubbleError(
          errors.ERROR_WRONG_SEQUENCE_CHARACTER,
          `Wrong character "${String.fromCharCode(charCode)}" found`);
    }

    return res;
  }
}

module.exports = GetSequenceState;