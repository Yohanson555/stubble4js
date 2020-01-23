class StubbleMessage {}

class InitMessage extends StubbleMessage {
  constructor(value) {
    super();
    this.value = value;
  };

  getName = () => 'init';
}

class ProcessMessage extends StubbleMessage {
  constructor(charCode) {
    super();
    this.charCode = charCode;
  }

  getName = () => 'process';
}

class NotifyMessage extends StubbleMessage {
  constructor({charCode, type, value}) {
    super();
    this.charCode = charCode;
    this.type = type;
    this.value = value;
  }
  
  getName = () => 'notify';
}

module.exports = {
  InitMessage,
  ProcessMessage,
  NotifyMessage
}