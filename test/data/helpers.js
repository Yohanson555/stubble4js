const Stubble = require('../../src/Stubble');
const moment = require('moment');

const initHelpers = () => {
    const stubble = new Stubble();

    stubble.registerHelper('testHelper', (attrs, fn) => {
        return attrs.join('; ');
    });

    stubble.registerHelper('show', (attrs, fn) => {
        return attrs.toString();
    });

    stubble.registerHelper('blockHelper', (attrs, fn) => {
        return fn({ 'AA': 'it', 'BB': 'works' });
    });

    stubble.registerHelper('formatPrice', (attrs, fn) => {
        return `${attrs[0].toString()} \$`;
    });

    stubble.registerHelper('item_price', (attrs, fn) => {
        var item = attrs[0];

        if (item) {
            const price = parseFloat(item.price, 10) * parseInt(item.quantity, 10);
            return number_format(price, 2);
        }

        return '';
    });

    stubble.registerHelper('item_price', (attrs, fn) => {
        const price = parseFloat(this.price, 10) * parseInt(this.quantity, 10);
        return number_format(price, 2);
    });

    stubble.registerHelper('total_sum', (attrs, fn) => {
        let sum = 0;
        var items = attrs[0];

        if (items && items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                sum += parseFloat(items[i].price) * parseInt(items[i].quantity, 10);

                if (items[i].options) {
                    const opts = Object.values(items[i].options);

                    for (let k = 0; k < opts.length; k++) {
                        sum += parseFloat(opts[k].price) * parseInt(items[i].quantity, 10);
                    }
                }
            }
        }

        return new `<ds><b><row><cell>TOTAL</cell><cell align='right'>*${number_format(sum, 2)}</cell></row></b></ds><br>`;
    });

    stubble.registerHelper('order_date', (attrs, fn) => {
        var modified = attrs[0];

        if (modified) {
            return `<b><row><cell>Order datetime</cell><cell align='right'>${moment(modified).format('D.M.Y / hh:mm')}</cell></row></b><br>`;
        }
    });

    stubble.registerHelper('bill_date', (attrs, fn) => {
        var modified = attrs[0];

        if (modified > 0) {
            return `<b><row><cell>Bill datetime</cell><cell align='right'>${moment(modified).format('D.M.Y / hh:mm')}</cell></row></b><br>`;
        }
    });

    stubble.registerHelper('items_list', (attrs, fn) => {
        var items = attrs[0];

        return items.map((item) => {
            return fn(item);
        }).join('');
    });

    stubble.registerHelper('options_list', (attrs, fn) => {
        var options = attrs[0];

        if (options) {
            return Object.values(options).map((item) => {
                return fn(item);
            }).join('');
        }

        return '';
    });

    stubble.registerHelper('vat_list', (attrs, fn) => {
        let vats = {};
        let out = '';

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
                            value: item.price * item.quantity * vat
                        };
                    }
                }
            }

            return Object.values(vats).map((item) => {
                item.value = number_format(item.value, 2)
                return fn(item);
            }).join('');
        }

        return '';
    });

    stubble.registerHelper('items_by_department', (attrs, fn) => {
        var deps = {};
        var items = attrs[0];

        if (items && items.length > 0) {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const dep = item.department;

                if (deps[dep]) {
                    deps[dep].items.push(item);
                } else {
                    deps[dep] = {};
                    deps[dep].name = departments[dep].name;
                    deps[dep].items = [];
                    deps[dep].items.push(item);
                }
            }
        }

        return Object.values(deps).map((dep) => {
            return "<b>" + dep.name + ":</b><br/>" + dep.items.map((item) => {
                return fn(item);
            }).join('') + "<br>";
        }).join('');
    });

    return stubble;
};

const number_format = (number, decimals = 0, dec_point = '.', thousands_sep = ' ') => {	// Format a number with grouped thousands
    var i, j, kw, kd, km;

    if (isNaN(decimals = Math.abs(decimals))) {
        decimals = 2;
    }
    if (dec_point == undefined) {
        dec_point = ",";
    }
    if (thousands_sep == undefined) {
        thousands_sep = ".";
    }

    i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

    if ((j = i.length) > 3) {
        j = j % 3;
    } else {
        j = 0;
    }

    km = (j ? i.substr(0, j) + thousands_sep : "");
    kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);

    kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");

    return km + kw + kd;
};

module.exports = initHelpers;