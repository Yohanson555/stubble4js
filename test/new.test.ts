import _ from "lodash";

import assert from "assert";
import Stubble from "../dist/Stubble";

import { CompillerFunction } from "../dist/StubbleContext";

describe("Block helpers templates test", () => {
  const stubble = new Stubble({});

  stubble.registerHelper(
    "errorHelper",
    (attrs: any[], fn: CompillerFunction) => {
      throw new Error("Helper error!");
    }
  );

  stubble.registerHelper(
    "simpleBlockHelper",
    (attrs: any[], fn: CompillerFunction) => {
      const data = { A: "First param", B: "Second param" };

      return fn(data);
    }
  );

  stubble.registerHelper(
    "manyStrings",
    (attrs: any[], fn: CompillerFunction) => {
      let count = attrs[0];
      count = count || 1;

      let res = "";

      for (let i = 0; i < count; i++) {
        res += fn({ index: i + 1 }) + ";";
      }

      return res;
    }
  );

  stubble.registerHelper(
    "multyStrings",
    (attrs: any[], fn: CompillerFunction) => {
      const count = attrs[0];
      const multy = attrs[1];

      let res = "";

      for (let i = 0; i < count; i++) {
        res += fn({ index: i + 1, multy: multy }) + ";";
      }

      return res;
    }
  );

  stubble.registerHelper("multiply", (attrs: any[], fn: CompillerFunction) => {
    const A = attrs[0];
    const B = attrs[1];

    return (A * B).toString();
  });

  stubble.registerHelper("ABC", (attrs: any[], fn: CompillerFunction) => {
    const A = attrs[0];
    const B = attrs[1];

    return fn({});
  });

  stubble.registerHelper("abc", (attrs: any[], fn: CompillerFunction) => {
    return fn({ name: "John" });
  });

  it("Wrong path test #1: starts with dot", () => {
    assert.throws(() => stubble.compile("{{#with .someValue}}{{/#with}}")({}), {
      message: `Error (7) on 1:8 Path should not start with point character`,
    });
  });

  // it("Calling simple block helper #1", () => {
  //   assert.equal(
  //     stubble.
  //     compile(
  //       "{{#simpleBlockHelper}}{{A}}; {{B}}{{/simpleBlockHelper}}"
  //     )({}),
  //     "First param; Second param"
  //   );
  // });

  // it("Calling simple block helper #2", () => {
  //   assert.equal(
  //     stubble.compile(
  //       "{{#simpleBlockHelper}}{{A}}; {{B}}{{/simpleBlockHelper}}"
  //     )({}),
  //     "First param; Second param"
  //   );
  // });

  // it("Calling simple block helper with attrs", () => {
  //   assert.equal(
  //     stubble.compile(
  //       "{{#manyStrings 3}}{{index}}. String number {{index}}{{/manyStrings}}"
  //     )({}),
  //     "1. String number 1;2. String number 2;3. String number 3;"
  //   );
  // });

  // it("Calling simple block helper with attrs and inner helper calls", () => {
  //   assert.equal(
  //     stubble.compile(
  //       "{{#multyStrings 3 2}}{{index}}. String number {{$multiply index multy}}{{/multyStrings}}"
  //     )({}),
  //     "1. String number 2;2. String number 4;3. String number 6;"
  //   );
  // });

  // it("Calling non registered block helper", () => {
  //   assert.throws(
  //     () => stubble.compile("{{#getPrice 3 2}}{{price}}}{{/getPrice}}")({}),
  //     {
  //       message: `Error (18) on 1:39 Helper "getPrice" is unregistered`,
  //     }
  //   );
  // });

  // it("Calling block helper that throws an error", () => {
  //   assert.throws(
  //     () =>
  //       stubble.compile("{{#errorHelper 3 2}}{{price}}}{{/errorHelper}}")({}),
  //     {
  //       message: `Error (9) on 1:45 Helper "errorHelper" error: Error: Helper error!`,
  //     }
  //   );
  // });

  // it("Unterminatred block helper #1", () => {
  //   assert.throws(
  //     () =>
  //       stubble.compile(
  //         "{{#multyStrings 3 2}}{{index}}. String number {{$multiply index multy}}{{/multyStrings"
  //       )({}),
  //     {
  //       message: `Error (17) on 1:85 Unterminated block helper "multyStrings" at 1:15`,
  //     }
  //   );
  // });

  // it("Unterminatred block helper #2", () => {
  //   assert.throws(
  //     () =>
  //       stubble.compile("{{#multyStrings 3 2}}{{index}}. String number")({}),
  //     {
  //       message: `Error (17) on 1:44 Unterminated block helper "multyStrings" at 1:15`,
  //     }
  //   );
  // });

  // it("Unterminatred block helper #3", () => {
  //   assert.throws(() => stubble.compile("{{#multyStrings 3 ")({}), {
  //     message: `Error (17) on 1:17 Unterminated block helper "multyStrings" at 1:15`,
  //   });
  // });

  // it('Calling simple block helper with "ignoreTagCaseSensetive" option == true', () => {
  //   stubble.setOption("ignoreTagCaseSensetive", true);

  //   assert.equal(
  //     stubble.compile(
  //       "{{#simpleBlockHelper}}{{A}}; {{B}}{{/SimpleBlockHelper}}"
  //     )({}),
  //     "First param; Second param"
  //   );

  //   stubble.setOption("ignoreTagCaseSensetive", false);
  // });

  // it("Calling nested block helpers", () => {
  //   assert.equal(
  //     stubble.compile("{{#ABC}}My name is {{#abc}}{{name}}{{/abc}}{{/ABC}}")(
  //       {}
  //     ),
  //     "My name is John"
  //   );
  // });

  // it("Calling block helpers with escaped characters", () => {
  //   assert.equal(
  //     stubble.compile("{{#ABC}}My name is \\!{{/ABC}}")({}),
  //     "My name is !"
  //   );
  // });
});
