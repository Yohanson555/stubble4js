const chars = require('../Characters');
const notifies = require('../Notify');
const { ProcessMessage, NotifyMessage } = require('../StubbleMessages');
const StubbleResult = require('../StubbleResult');
const StubbleState = require('../StubbleState');

class GetBlockEndState extends StubbleState {
  getName() {
    return "GetBlockEndState";
  }

  constructor(blockName) {
    super();

    this._blockName = blockName; // block name
    this._search = false; // is in close tag searching mode 
    this._esc = false; // is escaped character
    this._look = ''; // lookig for tag tpl
    this._tmp = ''; // tmp body
    this._body = ''; // collected body
    this._count = 0; // total character position in searched closed tag

    let _o = String.fromCharCode(chars.OPEN_BRACKET);
    let _c = String.fromCharCode(chars.CLOSE_BRACKET);
    let _s = String.fromCharCode(chars.SLASH);
    let _h = String.fromCharCode(chars.SHARP);

    this._look = `${_o}${_o}${_s}${this._blockName}${_c}${_c}`; // {{/<name>}}
    this._openTag = `${_o}${_o}${_h}${this._blockName}`;

    this._innerOpened = 0;
  }

  process(msg, context) {
    let charCode = msg.charCode;

    if (charCode == chars.EOS) {
      return new StubbleResult({
        pop: true,
        message: new ProcessMessage(charCode)
      });
    }

    if (this._search == true) {
      this._tmp += String.fromCharCode(charCode);

      let l = this._look;
      let t = this._tmp;
      let o = this._openTag;

      let op = context.opt('ignoreTagCaseSensetive');

      if (op === true) {
        l = String(l).toLowerCase();
        t = String(t).toLowerCase();
        o = String(o).toLowerCase();
      }

      if (
        (
          (l[this._count] != t[this._count]) &&
          (o[this._count] != t[this._count])
        ) || this._count >= l.length
      ) {
        this._search = false;
        this._body += this._tmp;
      } else {
        this._count++;
      }

      if (t === o) {
        this._search = false;
        this._body += this._tmp;
        this._innerOpened++;
      } else if (l.length == t.length) {
        if (this._innerOpened > 0) {
          this._search = false;
          this._body += this._tmp;
          this._innerOpened--;
        } else {
          return new StubbleResult({
            pop: true,
            message: new NotifyMessage({
              charCode: null,
              type: notifies.NOTIFY_BLOCK_END_RESULT,
              value: this._body,
            })
          });
        }
      }
    } else {
      if (charCode == chars.OPEN_BRACKET && !this._esc) {
        this._search = true;
        this._tmp = '' + String.fromCharCode(chars.OPEN_BRACKET);
        this._count = 0;

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