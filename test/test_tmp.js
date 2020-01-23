const _ = require('lodash');
const assert = require('assert');
const Stubble = require('../src/stubble/Stubble');
const StubbleContext = require('../src/stubble/StubbleContext');

/*
it('Correct non-block helper call with attributes #3', () => {
    const stubble = new Stubble();

    stubble.registerHelper('attrByNum', (attrs, fn) => {
        var index = attrs[0];
        console.log('index: ', index);

        if (index === null || index === undefined) {
          throw new Error('Index is undefined');
        }
    
        if (!(typeof index === 'number')) {
          throw new Error('Index is not an int');
        }
    
        return `Attrs is: ${attrs[index]}`;
      });

    assert.equal(stubble.compile('{{\$attrByNum 0 "first" 23 10.01 }}')({}),
        'Attrs is: 0');
    assert.equal(stubble.compile('{{\$attrByNum 1 "first" 23 10.01 }}')({}),
        'Attrs is: first');
    assert.equal(stubble.compile('{{\$attrByNum 2 "first" 23 10.01 }}')({}),
        'Attrs is: 23');
    assert.equal(stubble.compile('{{\$attrByNum 3 "first" 23 10.01 }}')({}),
        'Attrs is: 10.01');
});


describe('Block handlers templates test', () => {
  var stubble = new Stubble();

  stubble.registerHelper('simpleBlockHelper', (attrs, fn) => {
    var data = {'A': 'First param', 'B': 'Second param'};

    return fn(data);
  });

  stubble.registerHelper('manyStrings', (attrs, fn) => {
    var count = attrs.first;
    count = count || 1;

    var res = '';

    for (var i = 0; i < count; i++) {
      res += fn({"index": i + 1}) + ';';
    }

    return res;
  });

  stubble.registerHelper('multyStrings', (attrs, fn) => {
    var count = attrs[0];
    var multy = attrs[1];

    var res = '';

    for (var i = 0; i < count; i++) {
      res += fn({"index": i + 1, "multy": multy}) + ';';
    }

    return res;
  });

  stubble.registerHelper('multiply', (attrs, fn) => {
    var A = attrs[0];
    var B = attrs[1];

    return (A * B).toString();
  });

  it('Calling simple block helper #1', () => {
    const f = stubble.compile('{{#simpleBlockHelper}}{{A}}; {{B}}{{/simpleBlockHelper}}');
    console.log(f);
    assert.equal(f({}), 'First param; Second param');
  });

});

*/