"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBlockSequenceTypeState = void 0;
const _1 = require("./");
const StubbleMessages_1 = require("../StubbleMessages");
class GetBlockSequenceTypeState {
    getName() {
        return "GetBlockSequenceTypeState";
    }
    canAcceptMessage(msg) {
        if (msg instanceof StubbleMessages_1.InitMessage || msg instanceof StubbleMessages_1.NotifyMessage) {
            return true;
        }
        return false;
    }
    handleMessage(msg, context) {
        if (msg instanceof StubbleMessages_1.InitMessage) {
            return this.init(msg, context);
        }
        if (msg instanceof StubbleMessages_1.NotifyMessage) {
            return this.notify(msg, context);
        }
        return null;
    }
    init(msg, context) {
        return {
            state: new _1.GetBlockNameState(),
        };
    }
    notify(msg, context) {
        const blockName = msg.value;
        const res = {
            pop: true,
            message: new StubbleMessages_1.ProcessMessage(msg.charCode || 0),
        };
        switch (blockName) {
            case "if":
                res.state = new _1.GetIfBlockState(context.symbol, context.line);
                break;
            case "with":
                res.state = new _1.GetWithBlockState(context.symbol, context.line);
                break;
            case "each":
                res.state = new _1.GetEachBlockState(context.symbol, context.line);
                break;
            default:
                res.state = new _1.GetBlockHelperState(blockName, context.symbol, context.line);
                break;
        }
        return res;
    }
}
exports.GetBlockSequenceTypeState = GetBlockSequenceTypeState;
//# sourceMappingURL=GetBlockSequenceTypeState.js.map