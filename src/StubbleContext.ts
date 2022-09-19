import _ from "lodash";

export type HelperFunction = (
  attributes: any[],
  fn: CompillerFunction
) => string;

export type CompillerFunction = (data: { [key: string]: any }) => string;

export type BuilderFunction = null | ((template: string) => CompillerFunction);

export class StubbleContext {
  public symbol: number = 0;
  public line: number = 0;

  constructor(
    private _data: any,
    private _helpers: { [key: string]: HelperFunction },
    private _options: { [key: string]: any },
    private _fn: BuilderFunction
  ) {}

  callable(helper: string): boolean {
    if (this._helpers == null) {
      return false;
    }

    return !!this._helpers[helper];
  }

  call(helper: string, attributes: any[], fn: CompillerFunction) {
    if (!helper) {
      throw new Error("Helper name not specified");
    }

    if (!this._helpers[helper]) {
      throw new Error(`Helper "${helper}" is not registered`);
    }

    return this._helpers[helper](attributes, fn);
  }

  compile(template: string): CompillerFunction {
    if (this._fn && typeof this._fn === "function") {
      return this._fn(template);
    }

    return () => "";
  }

  get(path: string | string[]) {
    if (!this._data) return null;

    return _.get(this._data, path);
  }

  opt(name: string) {
    if (
      name &&
      this._options &&
      typeof this._options === "object" &&
      name in this._options
    ) {
      return this._options[name];
    }

    return null;
  }

  data(): any {
    return this._data;
  }

  helpers() {
    return this._helpers;
  }
}
