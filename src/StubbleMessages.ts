export interface StubbleMessage {
  getName(): string;

  getCode(): string;
}

export class InitMessage implements StubbleMessage {
  constructor(readonly value?: any, ) {}

  getName() {
    return "init";
  }

  getCode() {
    return "-";
  }
}

export class ProcessMessage implements StubbleMessage {
  constructor(readonly charCode: number) {}

  getName() {
    return "process";
  }

  getCode() {
    return String.fromCharCode(this.charCode);
  }
}

export class NotifyMessage implements StubbleMessage {
  constructor(
    readonly type: number,
    readonly charCode?: number,
    readonly value?: any
  ) {}

  getName() {
    return "notify";
  }

  getCode() {
    return '-';
  }
}
