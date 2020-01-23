const GetAttributeState = require('./GetAttributeState');
const GetConditionState = require('./GetConditionState');
const chars = require('../Characters');
const errors = require('../Errors');
const notifies = require('../Notify');
const StubbleError = require('../StubbleError');
const { ProcessMessage, NotifyMessage } = require('../StubbleMessages');
const StubbleResult = require('../StubbleResult');
const StubbleState = require('../StubbleState');

class GetIfConditionState extends StubbleState {
  getName = () => "GetIfConditionState";

  constructor() {
    super();

    this.leftPart;
    this.rightPart;
    this.condition;

    this._state = 0;
  }

  process(msg, context) {
    let charCode = msg.charCode;

    if (charCode == chars.CLOSE_BRACKET) {
      return new StubbleResult({
        err: new StubbleError(
          errors.ERROR_IF_BLOCK_MALFORMED,
          'If block condition malformed')
      });
    } else if (charCode == chars.SPACE) {
      return null;
    } else {
      switch (this._state) {
        case 0:
          return new StubbleResult({
            state: new GetAttributeState(),
            message: new ProcessMessage(charCode),
          });

        case 1:
          return new StubbleResult({
            state: new GetConditionState(),
            message: new ProcessMessage(charCode),
          });
          break;

        case 2:
          return new StubbleResult({
            state: new GetAttributeState(),
            message: new ProcessMessage(charCode)
          });

        default:
          return null;
      }
    }
  }

  notify(msg, context) {
    switch (msg.type) {
      case notifies.NOTIFY_ATTR_RESULT:
        if (this._state == 0) {
          this.leftPart = msg.value;
          this._state++;
        } else if (this._state == 2) {
          this.rightPart = msg.value;

          return new StubbleResult({
            pop: true,
            message: new NotifyMessage({
              value: this.checkCondition(),
              type: notifies.NOTIFY_CONDITION_RESULT,
              charCode: msg.charCode,
            }),
          });
        } else {
          return new StubbleResult({
            err: new StubbleError(
              errors.ERROR_IF_BLOCK_MALFORMED,
              'If block condition malformed'
            )
          });
        }

        if (msg.charCode != null) {
          return new StubbleResult({
            message: new ProcessMessage(msg.charCode)
          });
        }

        break;

      case notifies.NOTIFY_CONDITION_RESULT:
        this.condition = msg.value;
        this._state++;

        if (msg.charCode != null) {
          return new StubbleResult({
            message: new ProcessMessage(msg.charCode)
          });
        }

        break;

      default:
        return new StubbleResult({
          err: new StubbleError(
            errors.ERROR_UNSUPPORTED_NOTIFY,
            `State "${this.getName()}" does not support notifies of type ${msg.type}`)
        });
    }
  }

  checkCondition() {
    const { condition, leftPart, rightPart } = this;

    switch (condition) {
      case '<':
        return leftPart < rightPart;
      case '<=':
        return leftPart <= rightPart;
      case '>':
        return leftPart > rightPart;
      case '>=':
        return leftPart >= rightPart;
      case '==':
        return leftPart == rightPart;
      case '!=':
        return leftPart != rightPart;
      default:
        return false;
    }
  }
}

module.exports = GetIfConditionState;