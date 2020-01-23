const _ = require('lodash');
const StubbleContext = require('./StubbleContext');
const StubbleMachine = require('./StubbleMachine');

class Stubble {
  constructor(helpers = null) {
    this.helpers = helpers || {};
  }

  /// returns a compiler function that starts StubbleMachine with given template on call
  compile(template) {
    if (!template) {
      throw new Error('Can\'t create compiller with empty template');
    }

    let machine = new StubbleMachine(template);

    return (data) => {
      let context = new StubbleContext(data, this.helpers, (tpl) => this.compile(tpl));
      let result = machine.run(context);

      return result;
    };
  }

  /// registers a helper function that can be used in templates. All helpers are available across the all template
  registerHelper(name,  helper) { // helper - Function(List<dynamic>, Function)
    if (!this.helpers) this.helpers = {};
    
    if (!name) {
      throw new Error('Helper\'s name should be provided');
    } else {
      var regExp = RegExp(/^[a-zA-Z_]+\w+$/);

      if (!regExp.test(name)) {
        throw new Error('Wrong helper name specified');
      }
    }

    if (helper == null) {
      throw new Error('Helper\'s function should be provided');
    }

    if (!this.helpers[name]) {
      this.helpers[name] = helper;
      return true;
    }

    return false;
  }

  /// removes a helper function with a given name
  removeHelper(name) {
    if (this.helpers[name]) {
      delete this.helpers[name];
      return true;
    }

    return false;
  }

  /// removes all helpers from Stubble
  dropHelpers() {
    this.helpers = {};

    return true;
  }

  helperCount() {
    return this.helpers ? _.size(this.helpers) : 0;
  }
}

module.exports = Stubble;
