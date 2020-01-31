const _ = require('lodash');

class StubbleContext {
  constructor(data, helpers, options, fn) {
    this._data = data;
    this._helpers = helpers;
    this._fn = fn;

    this._options = options;
  }

  callable(helper) {
    if (this._helpers == null) return false;

    return !!this._helpers[helper];
  }

  call(helper, attributes, fn) {
    if (!helper) {
      throw new Error('Helper name not specified');
    }

    if (!this._helpers[helper]) {
      throw new Error(`Helper "${helper}" is not registered`);
    }

    return this._helpers[helper](attributes, fn);
  }

  compile(template) {
    if (this._fn && typeof this._fn === 'function') {
      return this._fn(template);
    }

    return null;
  }

  get(path) {
    if (!this._data) return null;

    return _.get(this._data, path);
  }

  opt(name) {
    if (name && this._options && typeof this._options === 'object' && name in this._options) {
      return this._options[name];
    }

    return null;
  }

  data() {
    return this._data;
  }

  helpers() {
    return this._helpers;
  }
}

module.exports = StubbleContext;