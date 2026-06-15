"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StubbleContext = void 0;
const lodash_1 = __importDefault(require("lodash"));
class StubbleContext {
    constructor(_data, _helpers, _options, _fn) {
        this._data = _data;
        this._helpers = _helpers;
        this._options = _options;
        this._fn = _fn;
        this.symbol = 0;
        this.line = 0;
    }
    callable(helper) {
        if (this._helpers == null) {
            return false;
        }
        return !!this._helpers[helper];
    }
    call(helper, attributes, fn) {
        if (!helper) {
            throw new Error("Helper name not specified");
        }
        if (!this._helpers[helper]) {
            throw new Error(`Helper "${helper}" is not registered`);
        }
        return this._helpers[helper](attributes, fn);
    }
    compile(template) {
        if (this._fn && typeof this._fn === "function") {
            return this._fn(template);
        }
        return () => "";
    }
    get(path) {
        if (!this._data)
            return null;
        return lodash_1.default.get(this._data, path);
    }
    opt(name) {
        if (name &&
            this._options &&
            typeof this._options === "object" &&
            name in this._options) {
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
exports.StubbleContext = StubbleContext;
//# sourceMappingURL=StubbleContext.js.map