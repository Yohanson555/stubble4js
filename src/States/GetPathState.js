const chars = require('../Characters');
const errors = require('../Errors');
const notifies = require('../Notify');
const StubbleError = require('../StubbleError');
const { ProcessMessage, NotifyMessage } = require('../StubbleMessages');
const StubbleResult = require('../StubbleResult');
const StubbleState = require('../StubbleState');

class GetPathState extends StubbleState {
  getName() {
    return "GetPathState";
  }

  constructor(path) {
    super();
    this.path = path || '';
    this.lastChar;
  }

  process(msg, context) {
    let charCode = msg.charCode;

    if (charCode == chars.EOS) {
      return new StubbleResult({
        pop: true,
        message: new ProcessMessage(charCode)
      });
    } else if (charCode == chars.DOT) {
      if (!this.path) {
        return new StubbleResult({
          err: new StubbleError(
            errors.ERROR_PATH_WRONG_SPECIFIED,
            'Path should not start with point character'
          )
        });
      }

      this.path += String.fromCharCode(charCode);
    } else if ((charCode >= 48 && charCode <= 57)) {
      if (!this.path) {
        return new StubbleResult({
          err: new StubbleError(
            errors.ERROR_PATH_WRONG_SPECIFIED,
            'Path should not start with number character')
        });
      }

      this.path += String.fromCharCode(charCode);
    } else if ((charCode >= 65 && charCode <= 90) ||
      (charCode >= 97 && charCode <= 122) ||
      charCode == 95) {
      this.path += String.fromCharCode(charCode);
    } else if (charCode == chars.SPACE || charCode == chars.CLOSE_BRACKET) {
      if (this.lastChar == chars.DOT) {
        return new StubbleResult({
          err: new StubbleError(
            errors.ERROR_PATH_WRONG_SPECIFIED,
            'Path should not end with dot character'
          )
        });
      }
      return new StubbleResult({
        pop: true,
        message: new NotifyMessage({
          type: notifies.NOTIFY_PATH_RESULT,
          value: this.path,
          charCode: charCode
        })
      });
    } else {
      return new StubbleResult({
        err: new StubbleError(
          errors.ERROR_NOT_A_VALID_PATH_CHAR,
          `Character "${String.fromCharCode(charCode)}" is not a valid in path`)
      });
    }

    this.lastChar = charCode;

    return null;
  }
}

module.exports = GetPathState;