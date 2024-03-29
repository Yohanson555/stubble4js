import _ from "lodash";
import { HelperFunction, StubbleContext } from "./StubbleContext";
import { StubbleMachine } from "./StubbleMachine";

export type SubbleOptions = {
  ignoreUnregisteredHelperErrors?: boolean;
  ignoreTagCaseSensetive?: boolean;
};

export class Stubble {
  private _helpers: { [key: string]: HelperFunction };
  private _options: SubbleOptions;

  constructor(
    helpers: { [key: string]: HelperFunction },
    options?: SubbleOptions
  ) {
    this._helpers = helpers || {};
    this._options = {
      ignoreUnregisteredHelperErrors: false,
      ignoreTagCaseSensetive: false,
    };

    if (options) {
      this._options = { ...this._options, ...options };
    }
  }

  /// returns a compiler function that starts StubbleMachine with given template on call
  compile(template: string) {
    if (!template) {
      throw new Error("Can't create compiller with empty template");
    }

    let machine = new StubbleMachine(template);

    return (data: { [key: string]: any }) => {
      let context = new StubbleContext(
        data,
        this._helpers,
        this._options,
        (tpl) => this.compile(tpl)
      );

      let result = machine.run(context);

      return result;
    };
  }

  /// registers a helper function that can be used in templates. All helpers are available across the all template
  registerHelper(name: string, helper: HelperFunction) {
    // helper - Function(List<dynamic>, Function)
    if (!name) {
      throw new Error("Helper's name should be provided");
    } else {
      var regExp = RegExp(/^[a-zA-Z_]+\w*$/);

      if (!regExp.test(name)) {
        throw new Error("Wrong helper name specified");
      }
    }

    if (helper == null) {
      throw new Error("Helper's function should be provided");
    }

    if (!this._helpers[name]) {
      this._helpers[name] = helper;
      return true;
    }

    return false;
  }

  /// removes a helper function with a given name
  removeHelper(name: string) {
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

  setOption<T extends keyof SubbleOptions>(name: T, value: any) {
    this._options[name] = value;
  }
}

export default Stubble;
