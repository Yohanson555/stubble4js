import _ from "lodash";
import assert from "assert";
import Stubble from "../dist/Stubble";
import { CompillerFunction } from "../dist/StubbleContext";

const groupBy = (attrs: any[], fn: CompillerFunction) => {
  let items = _.isArray(attrs[0]) ? attrs[0] : [];
  let groupField = _.isString(attrs[1]) ? attrs[1] : "";
  let order = attrs[2] === "desc" ? "desc" : "asc";

  let groups:{[key: string]: string[]} = {};

  if (items.length <= 0 && !groupField) {
    return "";
  }

  items.forEach((item) => {
    let v = _.get(item, groupField).toString();

    if (!groups[v]) {
      groups[v] = [];
    }

    groups[v].push(item.toString());
  });

  let keys = _.keys(groups);

  if (keys.length > 0) {
    keys = keys.sort();
    if (order === "desc") {
      keys = keys.reverse();
    }
  }

  let res: string[] = [];

  _.forEach(keys, (key) => {
    res.push(fn({ groupKey: key, groupValues: groups[key] }));
  });

  return res.join("");
};

function count(attrs: any[], fn: CompillerFunction) {
  const items = attrs[0];

  if (_.isArray(items)) {
    return _.size(items).toString();
  }

  return "0";
}

function sum(attrs: any[], fn: CompillerFunction) {
  const items = attrs[0];
  const prop = attrs[1].toString();

  let sum = 0;

  if (_.isArray(items)) {
    items.forEach((item) => {
      sum += _.toNumber(item[prop]);
    });
  }

  return sum.toFixed(2);
}

describe("Custom helpers test", () => {
  const stubble = new Stubble({});
  stubble.registerHelper("groupBy", groupBy);
  stubble.registerHelper("count", count);
  stubble.registerHelper("sum", sum);

  const data = {
    values: [
      {
        num: 3,
        val: 10,
      },

      {
        num: 2,
        val: 4,
      },

      {
        num: 1,
        val: 5,
      },

      {
        num: 3,
        val: 7,
      },
    ],
  };

  it("#1", () => {
    const tpl = `{{#groupBy values "num" "asc"}}{{$count groupValues}};{{/groupBy}}`;

    var res = stubble.compile(tpl)(data);

    assert.equal(res, "1;1;2;");
  });

  it("#2", () => {
    const tpl = `{{#groupBy values "num" "desc"}}{{$count groupValues}};{{/groupBy}}`;

    var res = stubble.compile(tpl)(data);

    assert.equal(res, "2;1;1;");
  });

  it("#3", () => {
    const tpl = `{{#groupBy values "num" "asc"}}{{groupKey}}:{{$sum groupValues "val"}}; {{/groupBy}}`;

    var res = stubble.compile(tpl)(data);

    assert.equal(res, "1:5; 2:4; 3:17; ");
  });
});
