const GetBlockSequenceTypeState = require('./GetBlockSequenceTypeState');
const GetDataState = require('./GetDataState');
const GetHelperState = require('./GetHelperState');
const GetSequenceState = require('./GetSequenceState');
const OpenBracketState = require('./OpenBracketState');
const chars = require('../Characters');
const notifies = require('../Notify');
const { InitMessage } = require('../StubbleMessages');
const StubbleResult = require('../StubbleResult');
const StubbleState = require('../StubbleState');

class RootState extends StubbleState {
  getName() {
    return 'RootState';
  }

  constructor() {
    super();

    this._escape = false;
  }

  process(msg, context) {
    let res = new StubbleResult({});
    let charCode = msg.charCode;

    if (charCode == chars.EOS) return null;

    if (this._escape) {
      this._escape = false;

      res.result = String.fromCharCode(charCode);
    } else {
      switch (charCode) {
        case chars.BACK_SLASH:
          this._escape = true;
          break;
        case chars.OPEN_BRACKET:
          res.state = new OpenBracketState();
          break;
        default:
          res.result = String.fromCharCode(charCode);
      }
    }

    return res;
  }

  notify(msg, context) {
    let res = new StubbleResult({});

    switch (msg.type) {
      case notifies.NOTIFY_SECOND_OPEN_BRACKET_FOUND: // done
        res.state = new GetSequenceState();
        break;
      case notifies.NOTIFY_IS_HELPER_SEQUENCE: // done
        res.message = new InitMessage();
        res.state = new GetHelperState();
        break;
      case notifies.NOTIFY_IS_BLOCK_SEQUENCE: // done
        res.message = new InitMessage();
        res.state = new GetBlockSequenceTypeState();
        break;
      case notifies.NOTIFY_IS_DATA_SEQUENCE: // done
        res.state = new GetDataState();
        res.message = new InitMessage(msg.value);
        break;
    }

    return res;
  }
}

module.exports = RootState;