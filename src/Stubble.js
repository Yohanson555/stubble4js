const _ = require('lodash');
const StubbleContext = require('./StubbleContext');
const StubbleMachine = require('./StubbleMachine');

class Stubble {
  constructor(helpers = null, options = null) {
    this._helpers = helpers || {};
    this._options = {
      'ignoreUnregisteredHelperErrors': false,
      'ignoreTagCaseSensetive': false
    };

    if (options != null && typeof options === 'object') {
      this._options = { ...this.options, ...options };
    } 
  }

  /// returns a compiler function that starts StubbleMachine with given template on call
  compile(template) {
    if (!template) {
      throw new Error('Can\'t create compiller with empty template');
    }

    let machine = new StubbleMachine(template);

    return (data) => {
      let context = new StubbleContext(data, this._helpers, this._options, (tpl) => this.compile(tpl));
      let result = machine.run(context);

      return result;
    };
  }

  /// registers a helper function that can be used in templates. All helpers are available across the all template
  registerHelper(name,  helper) { // helper - Function(List<dynamic>, Function)
    if (!name) {
      throw new Error('Helper\'s name should be provided');
    } else {
      var regExp = RegExp(/^[a-zA-Z_]+\w*$/);

      if (!regExp.test(name)) {
        throw new Error('Wrong helper name specified');
      }
    }

    if (helper == null) {
      throw new Error('Helper\'s function should be provided');
    }

    if (!this._helpers[name]) {
      this._helpers[name] = helper;
      return true;
    }

    return false;
  }

  /// removes a helper function with a given name
  removeHelper(name) {
    if (this._helpers[name]) {
      delete this._helpers[name];
      return true;
    }

    return false;
  }

  /// removes all helpers from Stubble
  dropHelpers() {
    this._helpers = {};

    return true;
  }

  helperCount() {
    return this._helpers ? _.size(this._helpers) : 0;
  }

  setOption(name, value) {
    console.log('options before');
    console.log(this._options);

    this._options[name] = value;

    console.log('options after');
    console.log(this._options);
  }
}

module.exports = Stubble;
