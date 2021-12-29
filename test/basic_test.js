const _ = require('lodash');

const {
  CloseBracketState,
  GetAttributeState,
  GetBlockEndState,
  GetBlockHelperState,
  GetBlockNameState,
  GetBlockSequenceTypeState,
  GetConditionState,
  GetDataState,
  GetEachBlockState,
  GetHelperState,
  GetIfBlockState,
  GetIfConditionState,
  GetNumberAttribute,
  GetPathAttribute,
  GetPathState,
  GetSequenceState,
  GetStringAttribute,
  GetWithBlockState,
  OpenBracketState,
  RootState,
} = require('../src/States/index.js');

const assert = require('assert');
const Stubble = require('../src/Stubble');
const StubbleMachine = require('../src/StubbleMachine');
const StubbleContext = require('../src/StubbleContext');

const initHelpers = require('./data/helpers');
const DATA = require('./data/data');
const TPLS = require('./data/templates');

describe('States tests', () => {
  it('Test States names', () => {
    assert.equal(new CloseBracketState().getName(), 'CloseBracketState');
    assert.equal(new GetAttributeState().getName(), 'GetAttributeState');
    assert.equal(new GetBlockEndState().getName(), 'GetBlockEndState');
    assert.equal(new GetBlockHelperState().getName(), 'GetBlockHelperState');
    assert.equal(new GetBlockNameState().getName(), 'GetBlockNameState');
    assert.equal(new GetBlockSequenceTypeState().getName(), 'GetBlockSequenceTypeState');
    assert.equal(new GetConditionState().getName(), 'GetConditionState');
    assert.equal(new GetDataState().getName(), 'GetDataState');
    assert.equal(new GetEachBlockState().getName(), 'GetEachBlockState');
    assert.equal(new GetHelperState().getName(), 'GetHelperState');
    assert.equal(new GetIfBlockState().getName(), 'GetIfBlockState');
    assert.equal(new GetIfConditionState().getName(), 'GetIfConditionState');
    assert.equal(new GetNumberAttribute().getName(), 'GetNumberAttribute');
    assert.equal(new GetPathAttribute().getName(), 'GetPathAttribute');
    assert.equal(new GetPathState().getName(), 'GetPathState');
    assert.equal(new GetSequenceState().getName(), 'GetSequenceState');
    assert.equal(new GetStringAttribute().getName(), 'GetStringAttribute');
    assert.equal(new GetWithBlockState().getName(), 'GetWithBlockState');
    assert.equal(new OpenBracketState().getName(), 'OpenBracketState');
    assert.equal(new RootState().getName(), 'RootState');
  });
});

describe('Stubble methods tests', () => {
  var compiler;
  var stubble = new Stubble();
  //`Exception: Can\'t create compiller with empty template!`

  it('Creating a compiller with empty template', () => {
    assert.throws(() => stubble.compile(null), {
      message: `Can\'t create compiller with empty template`
    });
  });

  it('Creating a stubble machine with empty template', () => {
    let sm = new StubbleMachine(null);

    assert.equal(sm.run(null), '');
  });

  it('Creating a compiller with non empty template', () => {
    compiler = stubble.compile('Test template');

    assert.ok(compiler instanceof Function);
  });

  it('Test compilation with previous compiler function', () => {
    assert.ok(compiler({}), 'Test template');
  });

  it('Registering a new helper function with null name and null function', () => {
    assert.throws(() => stubble.registerHelper(null, null), {
      message: 'Helper\'s name should be provided'
    });
  });

  it('Registering a new helper function with empty name and null function', () => {
    assert.throws(() => stubble.registerHelper('', null), {
      message: 'Helper\'s name should be provided'
    });
  });

  it('Registering a new helper function with wrong name specified #1', () => {
    assert.throws(() => stubble.registerHelper('555SaveMe', null), { message: 'Wrong helper name specified' });
  });

  it('Registering a new helper function with wrong name specified #2', () => {
    assert.throws(() => stubble.registerHelper('Let\'s get party started', null), { message: 'Wrong helper name specified' });
  });

  it('Registering a new helper function with wrong name specified #3', () => {
    assert.throws(() => stubble.registerHelper(')(*&%#', null), { message: 'Wrong helper name specified' });
  });

  it('Registering a new helper function null function', () => {
    assert.throws(() => stubble.registerHelper('testHelper', null), { message: 'Helper\'s function should be provided' });
  });

  it('No helpers', () => {
    stubble.dropHelpers();
    assert.equal(stubble.helperCount(), 0);
  });

  it('Registering a new correct helper function', () => {
    var res = stubble.registerHelper('testHelper', (attr, fn) => { });

    assert.ok(res);
    assert.equal(stubble.helperCount(), 1);
  });

  it('Registering a helper function with exist name', () => {
    var res = stubble.registerHelper('testHelper', (attr, fn) => { });

    assert.ok(!res);
    assert.equal(stubble.helperCount(), 1);
  });

  it('Registering another helper function', () => {
    var res = stubble.registerHelper('testHelper2', (attr, fn) => { });

    assert.ok(res);
    assert.equal(stubble.helperCount(), 2);
  });

  it('Registering third helper', () => {
    var res = stubble.registerHelper('testHelper3', (attr, fn) => { });

    assert.ok(res);
    assert.equal(stubble.helperCount(), 3);
  });

  it('Removing helper function with name testHelper2', () => {
    var res = stubble.removeHelper('testHelper2');

    assert.ok(res);
    assert.equal(stubble.helperCount(), 2);
  });

  it('Trying to remove already removed helper', () => {
    var res = stubble.removeHelper('testHelper2');

    assert.equal(res, false);
  });

  it('Drop all helpers test', () => {
    stubble.dropHelpers();
    assert.equal(stubble.helperCount(), 0);
  });
});

describe('Stubble context tests', () => {
  it('Empty context', () => {
    var context = new StubbleContext(null, null);

    assert.equal(context.data(), null);
    assert.equal(context.helpers(), null);
    assert.equal(context.callable('testHelper'), false);
    assert.equal(context.get('name'), null);
  });

  it('Context get() test', () => {
    let data = {
      'name': 'John',
      'age': 32,
      'languages': ['JavaScript', 'Dart', 'Go', 'Html', 'Css', 'Php'],
      'birth': {
        'city': 'St. Petersburg',
        'year': 1987,
        'month': 1,
        'day': 19,
        'weight': 4.78,
        'mother': { 'name': 'Elena' }
      }
    };
    let context = new StubbleContext(data, null);

    assert.equal(context.get('name'), 'John');
    assert.equal(context.get('age'), 32);
    assert.equal(_.isArray(context.get('languages')), true);
    assert.equal(_.isObject(context.get('birth')), true);
    assert.equal(context.get('birth.city'), 'St. Petersburg');
    assert.equal(context.get('birth.year'), 1987);
    assert.equal(context.get('birth.weight'), 4.78);
    assert.equal(_.isObject(context.get('birth.mother')), true);
    assert.equal(context.get('birth.mother.name'), 'Elena');
    assert.equal(context.get('birth.mother.lname'), null);
    assert.equal(context.get('Name'), null);
  });

  it('Calling existing helper', () => {
    var helpers = {};

    helpers['simple'] = (attrs, fn) => {
      return 'Helper result';
    };

    var context = new StubbleContext(null, helpers);

    assert.equal(context.call('simple', null, null), 'Helper result');
  });

  it('Calling existing helper with attributes #1', () => {
    var helpers = {};

    helpers['simple'] = (attrs, fn) => {
      return `Number of attributes is ${attrs.length}`;
    };

    var context = new StubbleContext(null, helpers);

    assert.equal(context.call('simple', [1, 'String attr', {}, false], null), 'Number of attributes is 4');
  });

  it('Calling existing helper with attributes #2', () => {
    var helpers = {};

    helpers['simple'] = (attrs, fn) => {
      return `Second attribute is ${attrs[1]}`;
    };

    var context = new StubbleContext(null, helpers);

    assert.equal(context.call('simple', [1, 'String attr', {}, false], null), 'Second attribute is String attr');
  });

  it('check for callable non-existing helper', () => {
    var helpers = {};
    var context = new StubbleContext(null, helpers);
    assert.equal(context.callable('simple'), false);
  });

  it('Calling helper withh no name given', () => {
    var helpers = {};
    var context = new StubbleContext(null, helpers);

    assert.throws(() => context.call('', null, null), {
      message: `Helper name not specified`
    });
  });

  it('Calling non-existing helper', () => {
    var helpers = {};
    var context = new StubbleContext(null, helpers);

    assert.throws(() => context.call('simple', null, null), {
      message: `Helper "simple" is not registered`
    });
  });

  it('Calling non-existing helper', () => {

    var context = new StubbleContext();
    var fn = context.compile('template');

    assert.equal(fn, null);
  });

  it('Try getting non-existing option', () => {

    var context = new StubbleContext();
    var o = context.opt('meaning-if-life');

    assert.equal(o, null);
  });
});

describe('Path templates test', () => {
  var stubble = new Stubble();

  it('Simple single line template', () => {
    var tpl = 'Sigle line template without any sequences';
    var data = null;

    var compile = stubble.compile(tpl);
    var res = compile(data);

    assert.equal(res, tpl);
  });

  it('Simple multyline template', () => {
    var tpl = `
    First line
    Second line
    `;
    var data = null;

    var compile = stubble.compile(tpl);
    var res = compile(data);

    assert.equal(res, tpl);
  });

  it('Correct path insert template', () => {
    var compile = stubble.compile('Everything is {{state}}');

    assert.equal(compile({ 'state': 'good' }), 'Everything is good');
    assert.equal(compile({ 'state': 'bad' }), 'Everything is bad');
    assert.equal(compile({ 'state1': 'bad' }), 'Everything is ');
    assert.equal(compile(null), 'Everything is ');
    assert.equal(compile({ 'state': '' }), 'Everything is ');
    assert.equal(compile({ 'state': null }), 'Everything is ');
    assert.equal(compile({ 'state': 123 }), 'Everything is 123');
    assert.equal(compile({ 'state': 123.343 }), 'Everything is 123.343');
    assert.equal(compile({ 'state': 123.343 }), 'Everything is 123.343');
  });

  it('Incorrect path insert template #1', () => {
    const fn = stubble.compile('Everything is {{ state }}');

    assert.throws(() => fn(null), {
      message: `Error (5) on 1:16 Wrong character " " found`
    });
  });

  it('Incorrect path insert template #2', () => {
    assert.throws(() => stubble.compile('Everything is {{123state }}')(null), {
      message: `Error (5) on 1:16 Wrong character "1" found`
    });
  });

  it('Incorrect path insert template #3', () => {
    assert.throws(() => stubble.compile('Everything is {{_state }}')(null), {
      message: `Error (5) on 1:16 Wrong character "_" found`
    });
  });

  it('Incorrect path insert template #4', () => {
    assert.throws(() => stubble.compile('Everything is {{^(*)} }}')(null), { message: `Error (5) on 1:16 Wrong character "^" found` });
  });

  it('Incorrect path insert template #5', () => {
    assert.throws(
      () => stubble.compile('Everything is {{ }}')(null), { message: `Error (5) on 1:16 Wrong character " " found` });
  });

  it('Incorrect path insert template #6', () => {
    assert.throws(
      () => stubble.compile('Everything is {{}}')(null), { message: `Error (5) on 1:16 Wrong character "}" found` });
  });

  it('Incorrect path insert template #7', () => {
    assert.throws(
      () => stubble.compile('Everything is {{A B}}')(null), { message: `Error (6) on 1:18 Wrong character "B" found` });
  });

  it('Incorrect path insert template #8', () => {
    assert.throws(
      () => stubble.compile('Everything is {A}}')(null), { message: `Error (1) on 1:15 Wrong character is given. Expected "{"` });
  });

  it('Incorrect path insert template #9', () => {
    assert.throws(
      () => stubble.compile('Everything is {{A} asd')(null), { message: `Error (2) on 1:18 Wrong character is given. Expected "}"` });
  });

  it('Nested path test', () => {
    var data = {
      'person': { 'name': 'John', 'lname': 'Saigachenko', 'age': 33 }
    };

    assert.equal(stubble.compile('{{person.name}}')(data), 'John');
    assert.equal(stubble.compile('{{person.lname}}')(data), 'Saigachenko');
    assert.equal(stubble.compile('{{person.age}}')(data), '33');
    assert.equal(stubble.compile('{{person.dog}}')(data), '');
  });

  it('Wrong path test #1: starts with dot', () => {
    assert.throws(
      () => stubble.compile('{{#with .someValue}}{{/#with}}')(null), { message: `Error (7) on 1:8 Path should not start with point character` });
  });

  it('Wrong path test #2: ends with dot', () => {
    assert.throws(
      () => stubble.compile('{{#with someValue.}}{{/#with}}')(null), { message: `Error (7) on 1:18 Path should not end with dot character` });
  });

  it('Wrong path test #3: starts with number', () => {
    assert.throws(
      () => stubble.compile('{{#with 123someValue}}{{/with}}')(null), { message: `Error (7) on 1:8 Path should not start with number character` });
  });

  it('Correct templates', () => {
    assert.equal(stubble.compile('{{A}}')({ 'A': 'Ok' }), 'Ok');
    assert.equal(stubble.compile('{{A1}}')({ 'A1': 'Ok' }), 'Ok');
    assert.equal(stubble.compile('{{A_B}}')({ 'A_B': 'Ok' }), 'Ok');
    assert.equal(stubble.compile('{{A_}}')({ 'A_': 'Ok' }), 'Ok');
    assert.equal(stubble.compile('{{A }}')({ 'A': 'Ok' }), 'Ok');
  });

  it('Escaping test', () => {
    assert.equal(stubble.compile('\\{ {{A}} \\}')({ 'A': 'Ok' }), '{ Ok }');
  });
});

describe('Simple handlers templates test', () => {
  var stubble = new Stubble();

  stubble.registerHelper('simpleHelper', (attrs, fn) => {
    return 'Simple helper result';
  });

  stubble.registerHelper('_simpleHelper', (attrs, fn) => {
    return 'Simple helper with first start slash result';
  });

  stubble.registerHelper('simpleHelper_', (attrs, fn) => {
    return 'Simple helper with last start slash result';
  });

  stubble.registerHelper('attrCountHelper', (attrs, fn) => {
    return `Attrs count: ${attrs.length}`;
  });

  stubble.registerHelper('attrByNum', (attrs, fn) => {
    var index = attrs[0];

    if (index === null || index === undefined) {
      throw new Error('Index is undefined');
    }

    if (!_.isInteger(index)) {
      throw new Error('Index is not an int');
    }

    return `Attrs is: ${attrs[index]}`;
  });

  stubble.registerHelper('attrByNum2', (attrs, fn) => {
    var index = attrs[0];

    if (index === null || index === undefined) {
      throw new Error('Index is undefined');
    }

    if (!_.isInteger(index)) {
      throw new Error('Index is not an int');
    }

    return `2: Attrs is: ${attrs[index]}`;
  });

  it('Non-block helper call without registering it', () => {
    assert.throws(() => stubble.compile('{{\$helperName}}')(null), {
      message: `Error (18) on 1:14 Helper "helperName" is unregistered`
    });
  });

  it('Non-block helper call without registering it and "ignoreUnregisteredHelperErrors" option on', () => {
    let st = new Stubble(null, {
      "ignoreUnregisteredHelperErrors": true
    })

    assert.equal(st.compile('A {{\$helperName}} B')(null), "A  B");
  });

  it('assert.equal non-block helper call without attributes #1', () => {
    assert.equal(stubble.compile('{{\$simpleHelper}}')({}), 'Simple helper result');
  });

  it('Correct non-block helper call without attributes #2', () => {
    assert.equal(stubble.compile('{{\$_simpleHelper}}')({}),
      'Simple helper with first start slash result');
  });

  it('Correct non-block helper call without attributes #3', () => {
    assert.equal(stubble.compile('{{\$simpleHelper_}}')({}),
      'Simple helper with last start slash result');
  });

  it('Correct non-block helper call with attributes #1', () => {
    assert.equal(stubble.compile('{{\$attrCountHelper "first" 23 10.01 }}')({}),
      'Attrs count: 3');
  });

  it('Correct non-block helper call with attributes #2', () => {
    assert.equal(
      stubble.compile('{{\$attrCountHelper path "first" 23 10.01 }}')({}),
      'Attrs count: 4');
  });

  it('Correct non-block helper call with attributes #3', () => {
    assert.equal(stubble.compile('{{\$attrByNum 0 "first" 23 10.01 }}')({}),
      'Attrs is: 0');
    assert.equal(stubble.compile('{{\$attrByNum 1 "first" 23 10.01 }}')({}),
      'Attrs is: first');
    assert.equal(stubble.compile('{{\$attrByNum 2 "first" 23 10.01 }}')({}),
      'Attrs is: 23');
    assert.equal(stubble.compile('{{\$attrByNum 3 "first" 23 10.01 }}')({}),
      'Attrs is: 10.01');
  });

  it('Calling "attrByNum" helper with out attributes', () => {
    assert.throws(
      () => stubble.compile('{{\$attrByNum}}')(null),
      { message: `Error (9) on 1:13 Error in helper function attrByNum: Error: Index is undefined` });
  });

  it('Calling "attrByNum" helper with wrong index specified', () => {
    assert.throws(() => stubble.compile('{{\$attrByNum 21.2}}')(null), { message: `Error (9) on 1:18 Error in helper function attrByNum: Error: Index is not an int` });
  });

  it('Wrong helper call #1', () => {
    assert.throws(() => stubble.compile('{{\$ attrByNum}}')(null), { message: `Error (8) on 1:3 Block name is empty` });
  });

  it('Wrong helper call #2', () => {
    assert.throws(() => stubble.compile('{{\$123attrByNum}}')(null), {
      message: `Error (8) on 1:3 Block name should not start with number character`
    });
  });

  it('Wrong helper call #2.5', () => {
    assert.throws(() => stubble.compile('{{\$attrByNum123}}')(null), {
      message: `Error (18) on 1:16 Helper "attrByNum123" is unregistered`
    });
  });

  it('Wrong helper call #3', () => {
    assert.throws(() => stubble.compile('{{\$#attrByNum}}')(null), {
      message: `Error (3) on 1:3 Character "#" is not a valid in block name`
    });
  });

  it('Helper call with wrong number param #1', () => {
    assert.throws(() => stubble.compile('{{\$attrByNum 0.23.1 }}')(null), {
      message: `Error (11) on 1:17 Duplicate number delimiter`
    });
  });

  it('Helper call with wrong number param #2', () => {
    assert.throws(() => stubble.compile('{{\$attrByNum 0.23A }}')(null), {
      message: `Error (11) on 1:17 Number attribute malformed`
    });
  });

  it('Helper call with wrong string param with brackets', () => {
    assert.throws(() => stubble.compile('{{\$attrByNum "test{" }}')(null), {
      message: `Error (19) on 1:18 Wrong attribute value character "{"`
    });
  });

  it('Helper call with wrong string param with brackets', () => {
    let res = stubble.compile('{{\$attrByNum 1 "test\\{" }}')(null)

    assert.equal(res, 'Attrs is: test{');
  });
});

describe('Block helpers templates test', () => {
  var stubble = new Stubble();

  stubble.registerHelper('errorHelper', (attrs, fn) => {
    throw new Error('Helper error!');
  });

  stubble.registerHelper('simpleBlockHelper', (attrs, fn) => {
    var data = { 'A': 'First param', 'B': 'Second param' };

    return fn(data);
  });

  stubble.registerHelper('manyStrings', (attrs, fn) => {
    var count = attrs[0];
    count = count || 1;

    var res = '';

    for (var i = 0; i < count; i++) {
      res += fn({ "index": i + 1 }) + ';';
    }

    return res;
  });

  stubble.registerHelper('multyStrings', (attrs, fn) => {
    var count = attrs[0];
    var multy = attrs[1];

    var res = '';

    for (var i = 0; i < count; i++) {
      res += fn({ "index": i + 1, "multy": multy }) + ';';
    }

    return res;
  });

  stubble.registerHelper('multiply', (attrs, fn) => {
    var A = attrs[0];
    var B = attrs[1];

    return (A * B).toString();
  });

  stubble.registerHelper('ABC', (attrs, fn) => {
    var A = attrs[0];
    var B = attrs[1];

    return fn();
  });

  stubble.registerHelper('abc', (attrs, fn) => {
    return fn({ 'name': 'John' });
  });

  it('Calling simple block helper #1', () => {
    assert.equal(
      stubble.compile(
        '{{#simpleBlockHelper}}{{A}}; {{B}}{{/simpleBlockHelper}}')({}),
      'First param; Second param');
  });

  it('Calling simple block helper #2', () => {
    assert.equal(
      stubble.compile(
        '{{#simpleBlockHelper}}{{A}}; {{B}}{{/simpleBlockHelper}}')({}),
      'First param; Second param');
  });

  it('Calling simple block helper with attrs', () => {
    assert.equal(
      stubble.compile(
        '{{#manyStrings 3}}{{index}}. String number {{index}}{{/manyStrings}}')({}),
      '1. String number 1;2. String number 2;3. String number 3;');
  });

  it('Calling simple block helper with attrs and inner helper calls', () => {
    assert.equal(
      stubble.compile(
        '{{#multyStrings 3 2}}{{index}}. String number {{\$multiply index multy}}{{/multyStrings}}')({}),
      '1. String number 2;2. String number 4;3. String number 6;');
  });

  it('Calling non registered block helper', () => {
    assert.throws(
      () => stubble.compile('{{#getPrice 3 2}}{{price}}}{{/getPrice}}')({}),
      {
        message: `Error (18) on 1:39 Helper "getPrice" is unregistered`
      }
    );
  });

  it('Calling block helper that throws an error', () => {
    assert.throws(
      () => stubble.compile('{{#errorHelper 3 2}}{{price}}}{{/errorHelper}}')({}),
      {
        message: `Error (9) on 1:45 Helper "errorHelper" error: Error: Helper error!`
      }
    );
  });

  it('Unterminatred block helper #1', () => {
    assert.throws(
      () => stubble.compile('{{#multyStrings 3 2}}{{index}}. String number {{\$multiply index multy}}{{/multyStrings')({}),
      {
        message: `Error (17) on 1:85 Unterminated block helper "multyStrings" at 1:15`
      }
    );
  });

  it('Unterminatred block helper #2', () => {
    assert.throws(
      () => stubble.compile('{{#multyStrings 3 2}}{{index}}. String number')({}),
      {
        message: `Error (17) on 1:44 Unterminated block helper "multyStrings" at 1:15`
      }
    );

  });

  it('Unterminatred block helper #3', () => {
    assert.throws(
      () => stubble.compile('{{#multyStrings 3 ')({}),
      {
        message: `Error (17) on 1:17 Unterminated block helper "multyStrings" at 1:15`
      }
    );
  });

  it('Calling simple block helper with "ignoreTagCaseSensetive" option == true', () => {
    stubble.setOption('ignoreTagCaseSensetive', true);

    assert.equal(
      stubble.compile(
        '{{#simpleBlockHelper}}{{A}}; {{B}}{{/SimpleBlockHelper}}')({}),
      'First param; Second param');

    stubble.setOption('ignoreTagCaseSensetive', false);
  });

  it('Calling nested block helpers', () => {
    assert.equal(
      stubble.compile(
        '{{#ABC}}My name is {{#abc}}{{name}}{{/abc}}{{/ABC}}')({}),
      'My name is John');
  });

  it('Calling block helpers with escaped characters', () => {
    assert.equal(
      stubble.compile(
        '{{#ABC}}My name is \\!{{/ABC}}')({}),
      'My name is !');
  });
});

describe('Block IF templates test', () => {
  var stubble = new Stubble();

  /// correct if blocks

  it('If block test #1', () => {
    var tpl = '{{#if A == 10}}true{{/if}}';
    var res = stubble.compile(tpl)({ 'A': 10 });

    assert.equal(res, 'true');
  });

  it('If block test #2', () => {
    var tpl = '{{#if A != 9}}true{{/if}}';
    var res = stubble.compile(tpl)({ 'A': 10 });

    assert.equal(res, 'true');
  });

  it('If block test #3', () => {
    var tpl = '{{#if A == 9}}true{{/if}}';
    var res = stubble.compile(tpl)({ 'A': 10 });

    assert.equal(res, '');
  });

  it('If block test #4', () => {
    var tpl = '{{#if A >= 10}}true{{/if}}';
    var res = stubble.compile(tpl)({ 'A': 10 });

    assert.equal(res, 'true');
  });

  it('If block test #5', () => {
    var tpl = '{{#if A <= 10}}true{{/if}}';
    var res = stubble.compile(tpl)({ 'A': 10 });

    assert.equal(res, 'true');
  });

  it('If block test #6', () => {
    var tpl = '{{#if A > 10}}true{{/if}}';
    var res = stubble.compile(tpl)({ 'A': 10 });

    assert.equal(res, '');
  });

  it('If block test #7', () => {
    var tpl = '{{#if A > 9}}true{{/if}}';
    var res = stubble.compile(tpl)({ 'A': 10 });

    assert.equal(res, 'true');
  });

  it('If block test #8', () => {
    var tpl = '{{#if A < 11}}true{{/if}}';
    var res = stubble.compile(tpl)({ 'A': 10 });

    assert.equal(res, 'true');
  });

  it('If block test #9', () => {
    var tpl = '{{#if A < 10}}true{{/if}}';
    var res = stubble.compile(tpl)({ 'A': 10 });

    assert.equal(res, '');
  });

  it('If block test #10 - no condition', () => {
    var tpl = '{{#if}}true{{/if}}';
    var res = stubble.compile(tpl)({ 'A': 10 });

    assert.equal(res, '');
  });

  it('If block test #11 - no condition', () => {
    var tpl = '{{#if 1 == 1}}true{{/if}}';
    var res = stubble.compile(tpl)({ 'A': 10 });

    assert.equal(res, 'true');
  });

  it('If block test #12 - no condition', () => {
    var tpl = '{{#if "yes" == "yes"}}true{{/if}}';
    var res = stubble.compile(tpl)({ 'A': 10 });

    assert.equal(res, 'true');
  });

  it('Calling nested IF', () => {
    var tpl = '{{#if A == 1}}A{{#if B == 2}}-B{{#if C == 4}}-C{{/if}}{{/if}}{{/if}}';
    var data = {
      'A': 1,
      'B': 2,
      'C': 3,
    };

    assert.equal(stubble.compile(tpl)(data), 'A-B');
  });

  /// incorrect if blocks
  ///
  it('Wrong IF block #1', () => {
    var tpl = '{{#if !}}result{{/if}}';

    assert.throws(() => stubble.compile(tpl)(null), {
      message: `Error (10) on 1:6 Wrong attribute character "!"`
    });
  });

  it('Wrong IF block #2', () => {
    var tpl = '{{#if A}}result{{/if}}';

    assert.throws(() => stubble.compile(tpl)(null), {
      message: `Error (15) on 1:7 If block condition malformed`
    });
  });

  it('Wrong IF block #3', () => {
    var tpl = '{{#if A=}}result{{/if}}';

    assert.throws(() => stubble.compile(tpl)(null), {
      message: `Error (4) on 1:7 Character "=" is not a valid in path`
    });
  });

  it('Wrong IF block #4', () => {
    var tpl = '{{#if A ==}}result{{/if}}';

    assert.throws(() => stubble.compile(tpl)(null), {
      message: `Error (15) on 1:10 If block condition malformed`
    });
  });

  it('Wrong IF block #5', () => {
    var tpl = '{{#if A === B}}result{{/if}}';

    assert.throws(() => stubble.compile(tpl)(null), {
      message: `Error (16) on 1:11 If block condition malformed: "==="`
    });
  });

  it('Wrong IF block #6', () => {
    var tpl = '{{#if A ?? B}}result{{/if}}';

    assert.throws(() => stubble.compile(tpl)(null), {
      message: `Error (10) on 1:8 Wrong condition character "?" (63)`
    });
  });

  it('Wrong IF block #7', () => {
    var tpl = '{{#if "A\' == "B"}}result{{/if}}';

    assert.throws(() => stubble.compile(tpl)(null), {
      message: `Error (10) on 1:14 Wrong condition character "B" (66)`
    });
  });

  it('Wrong IF block #8', () => {
    var tpl = '{{#if "A" == "A"}} {{&apple}} {{/if}}';

    assert.throws(() => stubble.compile(tpl)(null), {
      message: `Error (15) on 1:36 If block error: Error: Error (5) on 1:3 Wrong character "&" found`
    });
  });

});

describe('Block WITH templates test', () => {
  var stubble = new Stubble();

  it('Correct simple block', () => {
    var data = {
      'person': { 'fname': 'John', 'sname': 'Saigachenko' }
    };

    var tpl = '{{#with person}}{{fname}} {{sname}}{{/with}}';
    var res = stubble.compile(tpl)(data);

    assert.equal(res, 'John Saigachenko');
  });

  it('With block with empty path', () => {
    assert.throws(
      () => stubble.compile('{{#with}}{{fname}} {{sname}}{{/with}}')(null),
      { message: `Error (13) on 1:36 With block required path to context data` }
    );
  });

  it('With block data of wrong type', () => {
    assert.throws(
      () => stubble.compile('{{#with person}}{{fname}} {{sname}}{{/with}}')({ 'person': 'John' }),
      { message: `Error (14) on 1:43 "With" block data should have "Object" type` }
    );
  });

  it('With block wrong path ', () => {
    assert.throws(
      () => stubble.compile('{{#with Person}}{{fname}} {{sname}}{{/with}}')({ 'person': {} }),
      { message: `Error (7) on 1:43 Can\'t get data from context by path "Person"` }
    );
  });

  it('Unterminated WITH block test #1', () => {
    assert.throws(
      () => stubble.compile('{{#with Person}}{{fname}} {{sname}}{{/with}')({}),
      { message: `Error (17) on 1:42 Unterminated "WITH" block at 1:7` }
    );
  });

  it('Unterminated WITH block test #2', () => {
    assert.throws(
      () => stubble.compile('{{#with Person}}{{fname}} {{sname}}{{/wi')({}),
      { message: `Error (17) on 1:39 Unterminated "WITH" block at 1:7` }
    );
  });

  it('Unterminated WITH block test #3', () => {
    assert.throws(
      () => stubble.compile('{{#with Person}}{{fname}} {{sname}')({}),
      { message: `Error (17) on 1:33 Unterminated "WITH" block at 1:7` }
    );
  });

  it('Unterminated WITH block test #4', () => {
    assert.throws(
      () => stubble.compile('{{#with Person')({}),
      { message: `Error (17) on 1:13 Unterminated "WITH" block at 1:7` }
    );
  });

  it('Unterminated WITH block test #5', () => {
    assert.throws(
      () => stubble.compile('{{#with Perso')({}),
      { message: `Error (17) on 1:12 Unterminated "WITH" block at 1:7` }
    );
  });

  it('WITH block with malformed body', () => {
    assert.throws(
      () => stubble.compile('{{#with Person}} Some info {{&?A} {{/with}}')({ "Person": { "A": 21 } }),
      { message: 'Error (9) on 1:42 Error: Error (5) on 1:13 Wrong character "&" found' }
    );
  });
});

describe('Block EACH templates test', () => {
  var stubble = new Stubble();

  it('Simple EACH call', () => {
    var tpl = '{{#each A}}{{num}};{{/each}}';
    var data = {
      'A': [
        { 'num': 1 },
        { 'num': 2 },
        { 'num': 3 },
        { 'num': 4 },
      ]
    };

    assert.equal(stubble.compile(tpl)(data), '1;2;3;4;');
  });


  it('Calling nested EACH', () => {
    var tpl = '{{#each A}}{{n}}:{{#each B}}{{n}};{{/each}}{{/each}}';
    var data = {
      'A': [
        {
          'n': 'A1',
          'B': [
            { 'n': 'B1' },
            { 'n': 'B2' },
            { 'n': 'B3' }
          ]
        },
        {
          'n': 'A2',
          'B': [
            { 'n': 'B4' },
            { 'n': 'B5' },
            { 'n': 'B6' }
          ]
        }
      ]
    };

    assert.equal(stubble.compile(tpl)(data), 'A1:B1;B2;B3;A2:B4;B5;B6;');
  });

  it('Calling EACH block without path', () => {
    assert.throws(
      () => stubble.compile('{{#each}}{{num}};{{/each}}')({
        'A': [
          { 'num': 1 },
          { 'num': 2 },
          { 'num': 3 },
          { 'num': 4 },
        ]
      }),
      { message: `Error (13) on 1:25 "EACH" block requires path as parameter` }
    );
  });

  it('Calling EACH block with wrong param', () => {
    assert.throws(
      () => stubble.compile('{{#each A}}{{num}};{{/each}}')({ 'A': 'some string' }),
      { message: `Error (14) on 1:27 "EACH" block data should have "Array" or "Object" type` }
    );
  });

  it('Calling EACH block with absent param', () => {
    assert.throws(
      () => stubble.compile('{{#each B}}{{num}};{{/each}}')({ 'A': [] }),
      { message: `Error (7) on 1:27 Can\'t get data from context by path "B"` }
    );
  });

  it('Calling unterminated EACH block test #1', () => {
    assert.throws(
      () => stubble.compile('{{#each B}}{{num}};{{/each}')({}),
      { message: `Error (17) on 1:26 Unterminated "EACH" block at 1:7` }
    );
  });

  it('Calling unterminated EACH block test #2', () => {
    assert.throws(
      () => stubble.compile('{{#each B}}{{num}};{{/')({}),
      { message: `Error (17) on 1:21 Unterminated "EACH" block at 1:7` }
    );
  });

  it('Calling unterminated EACH block test #3', () => {
    assert.throws(
      () => stubble.compile('{{#each B}}{{num}}')({}),
      { message: `Error (17) on 1:17 Unterminated "EACH" block at 1:7` }
    );
  });

  it('Calling unterminated EACH block test #4', () => {
    assert.throws(
      () => stubble.compile('{{#each B')({}),
      { message: `Error (17) on 1:8 Unterminated "EACH" block at 1:7` }
    );
  });

  it('Calling malformed EACH block', () => {
    assert.throws(
      () => stubble.compile('{{#each B}} {{!name} {{/each}}')({ 'B': [{ 'name': 1 }, { 'name': 2 }, { 'name': 3 }] }),
      { message: `Error (9) on 1:29 Error: Error (5) on 1:3 Wrong character "!" found` }
    );
  });
});

describe('Production tests', () => {
  it('tpl1 - data1', () => {
    var stubble = initHelpers();

    assert.equal(stubble.compile(TPLS.tpl1)(DATA.data1),
      "<center><ds><b>* BILL #123 *</b></ds></center><br><b><row><cell>Bill datetime</cell><cell align='right'>19.1.1970 / 09:38</cell></row></b><br><br>123123123");
  });

  it('tpl2 - data2', () => {
    var stubble = initHelpers();

    assert.equal(stubble.compile(TPLS.tpl2)(DATA.data2),
      "Hi my name is John! I am 32 years old!");
  });

  it('tpl3 - data2', () => {
    var stubble = initHelpers();

    assert.equal(stubble.compile(TPLS.tpl3)(DATA.data2),
      "Helper result - abc; tes; 12.2; John");
  });

  it('tpl4', () => {
    var stubble = initHelpers();

    assert.equal(stubble.compile(TPLS.tpl4)({}),
      "Block Helper result -  it works! ");
  });
});

//************** */

describe('GetBlockNameState tests', () => {
  let stubble = new Stubble();

  it('GetBlockNameState EOS', () => {
    assert.throws(
      () => stubble.compile('{{#eac')({}),
      { message: `Error (20) on 1:5 block name error: unexpected end of source` }
    );
  });

  it('GetConditionState EOS', () => {
    assert.throws(
      () => stubble.compile('{{#if A =')({}),
      { message: `Error (20) on 1:8 IF condition error: unexpected end of source` }
    );
  });

  it('GetDataState EOS', () => {
    assert.throws(
      () => stubble.compile('{{adf')({}),
      { message: `Error (20) on 1:4 unexpected end of source` }
    );
  });

  it('GetIfBlockState EOS', () => {
    assert.throws(
      () => stubble.compile('{{#if ')({}),
      { message: `Error (17) on 1:5 Unterminated "IF" block at 1:5` }
    );
  });

  it('GetIfConditionState EOS', () => {
    assert.throws(
      () => stubble.compile('{{#if A ==')({}),
      { message: `Error (20) on 1:9 IF condition error: unexpected end of source` }
    );
  });

  it('GetIfConditionState EOS', () => {
    assert.throws(
      () => stubble.compile('{{#if A == ')({}),
      { message: `Error (20) on 1:10 unexpected end of source` }
    );
  });
});