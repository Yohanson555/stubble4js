const chars = require('../Characters');
const errors = require('../Errors');
const notifies = require('../Notify');
const StubbleError = require('../StubbleError');
const { NotifyMessage } = require('../StubbleMessages');
const StubbleResult = require('../StubbleResult');
const StubbleState = require('../StubbleState');

class GetNumberAttribute extends StubbleState {
  getName() {
    return 'GetNumberAttribute';
  }

  constructor(value) {
    super();

    this.value = value || '';
  }

  process(msg, context) {
    let charCode = msg.charCode;

    if (charCode == chars.CLOSE_BRACKET || charCode == chars.SPACE) {
      return new StubbleResult({
        pop: true,
        message: new NotifyMessage({
          charCode: charCode,
          type: notifies.NOTIFY_ATTR_RESULT,
          value: this.value.indexOf(String.fromCharCode(chars.DOT)) > 0 ? parseFloat(this.value) : parseInt(this.value)
        })
      });
    } else if (charCode == chars.DOT) {   
      if (this.value.indexOf(String.fromCharCode(chars.DOT)) > 0) {
        return new StubbleResult({
          err: new StubbleError(
              errors.ERROR_NUMBER_ATTRIBUTE_MALFORMED,
              'Duplicate number delimiter')
            });
      }

      this.value += String.fromCharCode(charCode);
    } else if (charCode >= 48 && charCode <= 57) {
      this.value += String.fromCharCode(charCode);
    } else {
      return new StubbleResult({
        err: new StubbleError(
          errors.ERROR_NUMBER_ATTRIBUTE_MALFORMED,
          'Number attribute malformed')
      });
    }

    return null;
  }
}

module.exports = GetNumberAttribute;