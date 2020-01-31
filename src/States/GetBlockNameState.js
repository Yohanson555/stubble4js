const chars = require('../Characters');
const errors = require('../Errors');
const notifies = require('../Notify');
const StubbleError = require('../StubbleError');
const { NotifyMessage } = require('../StubbleMessages');
const StubbleResult = require('../StubbleResult');
const StubbleState = require('../StubbleState');

class GetBlockNameState extends StubbleState {
  getName() {
    return 'GetBlockNameState';
  }

  constructor(name) {
    super();

    this.name = name || '';
  }

  process(msg, context) {
    let charCode = msg.charCode;

    if (charCode === chars.EOS) {
      return new StubbleResult({
        err: new StubbleError(
          errors.ERROR_UNEXPECTED_END_OF_SOURCE,
          'block name error: unexpected end of source')
      });
    } else if (charCode >= 48 && charCode <= 57) {
      if (!this.name) {
        return new StubbleResult({
          err: new StubbleError(
            errors.ERROR_BLOCK_NAME_WRONG_SPECIFIED,
            'Block name should not start with number character')
        });
      }

      this.name += String.fromCharCode(charCode);
    } else if ((charCode >= 65 && charCode <= 90) ||
      (charCode >= 97 && charCode <= 122) ||
      charCode == 95) {
      this.name += String.fromCharCode(charCode);
    } else if (charCode == chars.SPACE || charCode == chars.CLOSE_BRACKET) {
      if (!this.name) {
        return new StubbleResult({
          err: new StubbleError(
            errors.ERROR_BLOCK_NAME_WRONG_SPECIFIED,
            'Block name is empty')
        });
      }

      return new StubbleResult({
        pop: true,
        message: new NotifyMessage({
          type: notifies.NOTIFY_NAME_RESULT,
          value: this.name,
          charCode: charCode
        })
      });
    } else {
      return new StubbleResult({
        err: new StubbleError(
          errors.ERROR_NOT_A_VALID_BLOCK_NAME_CHAR,
          `Character "${String.fromCharCode(charCode)}" is not a valid in block name`)
      });
    }

    return null;
  }
}

module.exports = GetBlockNameState;