const _ = require('lodash');

class StubbleContext {
  constructor(data, helpers, fn) {
    this._data = data;
    this._helpers = helpers;
    this._fn = fn;
  }

  callable(helper) {
    if (this._helpers == null) return false;

    return !!this._helpers[helper];
  }

  call(helper, attributes, fn) {
    if (!helper) {
      throw new Error('Helper name not specified');
    }

    if(!this._helpers[helper]) {
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

  data() {
    return this._data;
  }

  helpers() {
    return this._helpers;
  }
}

module.exports = StubbleContext;