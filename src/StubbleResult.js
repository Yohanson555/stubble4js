class StubbleResult {
  constructor({state, message, pop, err, result}) {
    this.state = state;
    this.message = message;
    this.pop = pop;
    this.err = err;
    this.result = result;
  }
}

module.exports = StubbleResult;