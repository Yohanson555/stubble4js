const GetNumberAttribute = require('./GetNumberAttribute');
const GetPathAttribute = require('./GetPathAttribute');
const GetStringAttribute = require('./GetStringAttribute');
const chars = require('../Characters');
const errors = require('../Errors');
const StubbleError = require('../StubbleError');
const {InitMessage, ProcessMessage } = require('../StubbleMessages');
const StubbleResult = require('../StubbleResult');
const StubbleState = require('../StubbleState');

class GetAttributeState extends StubbleState {
  getName() {
    return "GetAttributeState";
  }

  process(msg, context) {
    let charCode = msg.charCode;

    if (charCode == chars.QUOTE || charCode == chars.SINGLE_QUOTE) {
      return new StubbleResult({
        pop: true,
        state: new GetStringAttribute(charCode),
      });
    } else if (charCode >= 48 && charCode <= 57) {
      return new StubbleResult({
        pop: true,
        state: new GetNumberAttribute(),
        message: new ProcessMessage(charCode)
      });
    } else if ((charCode >= 65 && charCode <= 90) ||
      (charCode >= 97 && charCode <= 122) ||
      charCode == 95) {
      return new StubbleResult({
        pop: true,
        message: new InitMessage(String.fromCharCode(charCode)),
        state: new GetPathAttribute(),
      });
    }
    return new StubbleResult({
      err: new StubbleError(
        errors.ERROR_GETTING_ATTRIBUTE,
        `Wrong attribute character "${String.fromCharCode(charCode)}"`)
    });
  }
}

module.exports = GetAttributeState;