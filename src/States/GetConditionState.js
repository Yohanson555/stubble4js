const chars = require('../Characters');
const errors = require('../Errors');
const notifies = require('../Notify');
const StubbleError = require('../StubbleError');
const { NotifyMessage } = require('../StubbleMessages');
const StubbleResult = require('../StubbleResult');
const StubbleState = require('../StubbleState');

class GetConditionState extends StubbleState {
  getName() {
    return 'GetConditionState';
  };

  constructor() {
    super();

    this._condition = '';
  }

  process(msg, context) {
    let charCode = msg.charCode;

    if (charCode === chars.EOS) {
      return new StubbleResult({
        err: new StubbleError(
          errors.ERROR_UNEXPECTED_END_OF_SOURCE,
          'IF condition error: unexpected end of source')
      });
    } else if (charCode == chars.MORE ||
      charCode == chars.LESS ||
      charCode == chars.EQUAL ||
      charCode == chars.EXCL_MARK) {
      this._condition += String.fromCharCode(charCode);

      return null;
    } else if (charCode == chars.CLOSE_BRACKET || charCode == chars.SPACE) {
       if (this._condition.length > 2 || ['==', '!=', '<', '>', '<=', '>='].indexOf(this._condition) < 0) {
        return new StubbleResult({
          err: new StubbleError(
            errors.ERROR_IF_BLOCK_CONDITION_MALFORMED,
            `If block condition malformed: "${this._condition}"`)
        });
      } else {
        return new StubbleResult({
          pop: true,
          message: new NotifyMessage({
            type: notifies.NOTIFY_CONDITION_RESULT,
            value: this._condition,
            charCode: charCode
          })
        });
      }
    }

    return new StubbleResult({
      err: new StubbleError(
        errors.ERROR_GETTING_ATTRIBUTE,
        `Wrong condition character "${String.fromCharCode(charCode)}" (${charCode})`)
    });
  }
}

module.exports = GetConditionState;