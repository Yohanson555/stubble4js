class StubbleState {
  canAcceptMessage(msg) { 
    let messageName = msg.getName();
    
    return typeof this[messageName] === 'function';
  }
}

module.exports = StubbleState;