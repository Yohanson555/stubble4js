const GetBlockHelperState = require('./GetBlockHelperState');
const GetBlockNameState = require('./GetBlockNameState');
const GetEachBlockState = require('./GetEachBlockState');
const GetIfBlockState = require('./GetIfBlockState');
const GetWithBlockState = require('./GetWithBlockState');
const errors = require('../Errors');
const notifies = require('../Notify');
const StubbleError = require('../StubbleError');
const { ProcessMessage, } = require('../StubbleMessages');
const StubbleResult = require('../StubbleResult');
const StubbleState = require('../StubbleState');

class GetBlockSequenceTypeState extends StubbleState {
  getName = () => "GetBlockSequenceTypeState";

  init(msg, context) {
    return new StubbleResult({
      state: new GetBlockNameState(),
    });
  }

  process(msg, context) {
    return new StubbleResult({
      pop: true
    });
  }

  notify(msg, context) {
    if (msg.type == notifies.NOTIFY_NAME_RESULT) {
      let blockName = msg.value;

      if (!blockName) {
        return new StubbleResult({
          err: new StubbleError(
            errors.ERROR_BLOCK_NAME_WRONG_SPECIFIED,
            'Block name not specified')
        });
      } else {
        var res = new StubbleResult({
          pop: true,
          message: new ProcessMessage(msg.charCode)
        });

        switch (blockName) {
          case "if":
            res.state = new GetIfBlockState();
            break;

          case "with":
            res.state = new GetWithBlockState();
            break;

          case "each":
            res.state = new GetEachBlockState();
            break;

          default:
            res.state = new GetBlockHelperState(blockName);
            break;
        }

        return res;
      }
    }

    return StubbleResult({
      err: StubbleError(
        errors.ERROR_UNSUPPORTED_NOTIFY,
        `State "${this.runtimeType}" does not support notifies of type ${msg.type}`)
    });
  }
}

module.exports = GetBlockSequenceTypeState;