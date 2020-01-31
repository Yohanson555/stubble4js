const chars = require('../Characters');
const notifies = require('../Notify');
const errors = require('../Errors');
const { NotifyMessage } = require('../StubbleMessages');
const StubbleResult = require('../StubbleResult');
const StubbleState = require('../StubbleState');
const StubbleError = require('../StubbleError');

class GetStringAttribute extends StubbleState {
  getName() {
    return 'GetStringAttribute';
  }

  constructor(quoteSymbol) {
    super();

    this.quoteSymbol = quoteSymbol;
    this._value = '';
    this._escape = false;
  }

  process(msg, context) {
    let charCode = msg.charCode;

    if (this._escape) {
      this._escape = false;
      this._value += String.fromCharCode(charCode);
    } else {
      if (charCode == chars.OPEN_BRACKET || charCode == chars.CLOSE_BRACKET) {
        return new StubbleResult({
          err: new StubbleError(
            errors.ERROR_STRING_ATTRIBUTE_MALFORMED,
            `Wrong attribute value character "${String.fromCharCode(charCode)}"`,
          ),
        });
      } else if (charCode == chars.BACK_SLASH) {
        this._escape = true;
      } else if (charCode == this.quoteSymbol) {
        return new StubbleResult({
          pop: true,
          message: new NotifyMessage({
            type: notifies.NOTIFY_ATTR_RESULT,
            value: this._value,
            charCode: null
          })
        });
      } else {
        this._value += String.fromCharCode(charCode);
      }
    }

    return null;
  }
}

module.exports = GetStringAttribute;