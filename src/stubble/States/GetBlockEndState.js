const chars = require('../Characters');
const notifies = require('../Notify');
const { NotifyMessage } = require('../StubbleMessages');
const StubbleResult = require('../StubbleResult');
const StubbleState = require('../StubbleState');

class GetBlockEndState extends StubbleState {
  getName = () => "GetBlockEndState";

  constructor(blockName) {
    super();

    this._blockName = blockName;
    this._search = false;
    this._esc = false;
    this._look = '';
    this._tmp = '';
    this._body = '';
    this._count = 0;
  }

  process(msg, context) {
    let charCode = msg.charCode;

    if (this._search == true) {
      if (this._tmp.length < this._look.length) {
        this._tmp += String.fromCharCode(charCode);

        if (this._tmp[this._count] != this._look[this._count]) {
          this._search = false;
          this._body += this._tmp;
        } else {
          this._count++;
        }
      }

      if (this._tmp.length == this._look.length) {
        if (this._tmp == this._look) {
          return new StubbleResult({
            pop: true,
            message: new NotifyMessage({
              charCode: null,
              type: notifies.NOTIFY_BLOCK_END_RESULT,
              value: this._body,
            })
          });
        } else {
          this._search = false;
          this._body += this._tmp;
        }
      }
    } else {
      if (charCode == chars.OPEN_BRACKET && !this._esc) {
        this._search = true;
        this._tmp = '' + String.fromCharCode(chars.OPEN_BRACKET);
        this._count = 0;

        let _o = String.fromCharCode(chars.OPEN_BRACKET);
        let _c = String.fromCharCode(chars.CLOSE_BRACKET);
        let _s = String.fromCharCode(chars.SLASH);

        this._look = `${_o}${_o}${_s}${this._blockName}${_c}${_c}`; // {{/<name>}}
      } else if (charCode == chars.BACK_SLASH && !this._esc) {
        this._esc = true;
      } else {
        this._esc = false;
        this._body += String.fromCharCode(charCode);
      }
    }

    return null;
  }
}

module.exports = GetBlockEndState;