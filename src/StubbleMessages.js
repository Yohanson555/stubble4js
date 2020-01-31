class StubbleMessage {}

class InitMessage extends StubbleMessage {
  constructor(value) {
    super();
    this.value = value;
  };

  getName() {
    return 'init';
  }
}

class ProcessMessage extends StubbleMessage {
  constructor(charCode) {
    super();
    this.charCode = charCode;
  }

  getName() {
    return 'process';
  }
}

class NotifyMessage extends StubbleMessage {
  constructor({charCode, type, value}) {
    super();
    this.charCode = charCode;
    this.type = type;
    this.value = value;
  }
  getName() {
    return 'notify';
  }
}

module.exports = {
  InitMessage,
  ProcessMessage,
  NotifyMessage
}