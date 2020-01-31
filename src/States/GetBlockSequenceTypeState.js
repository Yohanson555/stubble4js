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
  getName() {
    return 'GetBlockSequenceTypeState';
  }

  init(msg, context) {
    return new StubbleResult({
      state: new GetBlockNameState(),
    });
  }

  notify(msg, context) {
    let blockName = msg.value;

    var res = new StubbleResult({
      pop: true,
      message: new ProcessMessage(msg.charCode)
    });

    switch (blockName) {
      case "if":
        res.state = new GetIfBlockState(context.symbol, context.line);
        break;

      case "with":
        res.state = new GetWithBlockState(context.symbol, context.line);
        break;

      case "each":
        res.state = new GetEachBlockState(context.symbol, context.line);
        break;

      default:
        res.state = new GetBlockHelperState(blockName, context.symbol, context.line);
        break;
    }

    return res;
  }
}

module.exports = GetBlockSequenceTypeState;