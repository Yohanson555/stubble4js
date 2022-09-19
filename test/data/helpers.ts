import { CompillerFunction } from "../../dist/StubbleContext";

import Stubble from "../../dist/Stubble";
import moment from "moment";

export const initHelpers = () => {
  const stubble = new Stubble({});

  stubble.registerHelper(
    "testHelper",
    (attrs: any[], fn: CompillerFunction) => {
      return attrs.join("; ");
    }
  );

  stubble.registerHelper("show", (attrs: any[], fn: CompillerFunction) => {
    return attrs.toString();
  });

  stubble.registerHelper(
    "blockHelper",
    (attrs: any[], fn: CompillerFunction) => {
      return fn({ AA: "it", BB: "works" });
    }
  );

  stubble.registerHelper(
    "formatPrice",
    (attrs: any[], fn: CompillerFunction) => {
      return `${attrs[0].toString()} \$`;
    }
  );

  stubble.registerHelper(
    "item_price",
    (attrs: any[], fn: CompillerFunction) => {
      var item = attrs[0] as { [key: string]: string };

      if (item) {
        const price = parseFloat(item.price) * parseInt(item.quantity, 10);
        return number_format(price, 2);
      }

      return "";
    }
  );

  stubble.registerHelper(
    "item_price",
    (attrs: any[], fn: CompillerFunction) => {
      const { price, quantity } = this || { price: "0", quantity: "0" };

      const priceValue = parseFloat(price) * parseInt(quantity, 10);
      return number_format(priceValue, 2);
    }
  );

  stubble.registerHelper("total_sum", (attrs: any[], fn: CompillerFunction) => {
    let sum = 0;
    var items = attrs[0];

    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        sum += parseFloat(items[i].price) * parseInt(items[i].quantity, 10);

        if (items[i].options) {
          const opts = Object.values(items[i].options) as {
            [key: string]: any;
          };

          for (let k = 0; k < opts.length; k++) {
            sum += parseFloat(opts[k].price) * parseInt(items[i].quantity, 10);
          }
        }
      }
    }

    return `<ds><b><row><cell>TOTAL</cell><cell align='right'>*${number_format(
      sum,
      2
    )}</cell></row></b></ds><br>`;
  });

  stubble.registerHelper(
    "order_date",
    (attrs: any[], fn: CompillerFunction) => {
      var modified = attrs[0];

      if (modified) {
        return `<b><row><cell>Order datetime</cell><cell align='right'>${moment(
          modified
        ).format("D.M.Y / hh:mm")}</cell></row></b><br>`;
      }

      return "";
    }
  );

  stubble.registerHelper("bill_date", (attrs: any[], fn: CompillerFunction) => {
    var modified = attrs[0];

    if (modified > 0) {
      return `<b><row><cell>Bill datetime</cell><cell align='right'>${moment(
        modified
      ).format("D.M.Y / hh:mm")}</cell></row></b><br>`;
    }

    return "";
  });

  stubble.registerHelper(
    "items_list",
    (attrs: any[], fn: CompillerFunction) => {
      var items = attrs[0];

      return items
        .map((item: { [key: string]: any }) => {
          return fn(item);
        })
        .join("");
    }
  );

  stubble.registerHelper(
    "options_list",
    (attrs: any[], fn: CompillerFunction) => {
      var options = attrs[0];

      if (options) {
        return Object.values(options)
          .map((item) => {
            return fn(item as { [key: string]: string });
          })
          .join("");
      }

      return "";
    }
  );

  stubble.registerHelper("vat_list", (attrs: any[], fn: CompillerFunction) => {
    let vats: { [key: number]: { name: string; value: number } } = {};

    var items = attrs[0];

    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.vat_value > 0) {
          let vat = item.vat_value / 100;
          if (vats[item.vat_value]) {
            vats[item.vat_value].value += item.price * item.quantity * vat;
          } else {
            vats[item.vat_value] = {
              name: item.vat_name,
              value: item.price * item.quantity * vat,
            };
          }
        }
      }

      return Object.values(vats)
        .map((item: { [key: string]: any }) => {
          item.value = number_format(item.value, 2);
          return fn(item);
        })
        .join("");
    }

    return "";
  });

  stubble.registerHelper(
    "items_by_department",
    (attrs: any[], fn: CompillerFunction) => {
      var deps: {
        [key: string]: {
          name: string;
          items: object[];
        };
      } = {};

      var items = attrs[0];

      if (items && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const dep = item.department;

          if (deps[dep]) {
            deps[dep].items.push(item);
          } else {
            deps[dep] = { name: "department " + i, items: [] };
            //deps[dep].name = departments[dep].name;
            deps[dep].items = [];
            deps[dep].items.push(item);
          }
        }
      }

      return Object.values(deps)
        .map((dep: { [key: string]: any }) => {
          return (
            "<b>" +
            dep.name +
            ":</b><br/>" +
            dep.items
              .map((item: { [key: string]: any }) => {
                return fn(item);
              })
              .join("") +
            "<br>"
          );
        })
        .join("");
    }
  );

  return stubble;
};

export const number_format = (
  number: number,
  decimals = 0,
  dec_point = ".",
  thousands_sep = " "
) => {
  // Format a number with grouped thousands
  let i: string, j: number, kw: string, kd: string, km: string;

  if (isNaN((decimals = Math.abs(decimals)))) {
    decimals = 2;
  }
  if (dec_point == undefined) {
    dec_point = ",";
  }
  if (thousands_sep == undefined) {
    thousands_sep = ".";
  }

  i = (number | 0).toString();

  if ((j = i.length) > 3) {
    j = j % 3;
  } else {
    j = 0;
  }

  km = j ? i.substr(0, j) + thousands_sep : "";
  kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);

  kd = decimals
    ? dec_point + Math.abs(number).toFixed(decimals).replace(/-/, "0").slice(2)
    : "";

  return km + kw + kd;
};

export default initHelpers;
