
const Stubble = require('../src/Stubble');
const assert = require('assert');

describe('Block helpers templates test', () => {
    var stubble = new Stubble();

    stubble.registerHelper('ABC', (attrs, fn) => {
        var data = { 'A': 'First param', 'B': 'Second param' };

        return fn(data);
    });

});
