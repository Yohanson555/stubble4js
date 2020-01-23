const GetPathState = require('./GetPathState');
const notifies = require('../Notify');
const { NotifyMessage } = require('../StubbleMessages');
const StubbleResult = require('../StubbleResult');
const StubbleState = require('../StubbleState');

class GetPathAttribute extends StubbleState {
  getName = () => "GetPathAttribute";

  init(msg, context) {
    return new StubbleResult({
      state: new GetPathState(msg.value),
    });
  }

  notify(msg, context) {
    switch (msg.type) {
      case notifies.NOTIFY_PATH_RESULT:
        return new StubbleResult({
          pop: true,
          message: new NotifyMessage({
            charCode: msg.charCode,
            type: notifies.NOTIFY_ATTR_RESULT,
            value: context.get(msg.value),
          })
        });
    }

    return null;
  }
}

module.exports = GetPathAttribute;
