const chars = require('../Characters');
const notifies = require('../Notify');
const { NotifyMessage } = require('../StubbleMessages');
const StubbleResult = require('../StubbleResult');
const StubbleState = require('../StubbleState');

class GetStringAttribute extends StubbleState {
  getName = () => "GetStringAttribute";

  constructor(quoteSymbol) {
    super();

    this.quoteSymbol = quoteSymbol;
    this._value = '';
    this._escape = false;
  }

  process(msg, context) {
    let charCode = msg.charCode;

    if (charCode == this.quoteSymbol && !this._escape) {
      return new StubbleResult({
        pop: true,
        message: new NotifyMessage({
          type: notifies.NOTIFY_ATTR_RESULT,
          value: this._value,
          charCode: null
        })
      });
    } else if (charCode == chars.BACK_SLASH && !this._escape) {
      this._escape = true;
    } else {
      this._value += String.fromCharCode(charCode);
    }

    return null;
  }
}

module.exports = GetStringAttribute;