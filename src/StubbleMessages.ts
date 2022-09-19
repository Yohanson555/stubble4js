export interface StubbleMessage {
  getName(): string;
}

export class InitMessage implements StubbleMessage {
  constructor(readonly value?: any) {}

  getName() {
    return "init";
  }
}

export class ProcessMessage implements StubbleMessage {
  constructor(readonly charCode: number) {}

  getName() {
    return "process";
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
}
