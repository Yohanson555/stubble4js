import Stubble from './src/stubble/Stubble';

let data = {
    'A': 'A content',
    'person': [
        { 'fname': 'John1', 'sname': 'Saigachenko1' },
        { 'fname': 'John2', 'sname': 'Saigachenko2' },
        { 'fname': 'John3', 'sname': 'Saigachenko3' },
    ]
};

let tpl = '{{#each person}}{{fname}} {{sname}}\n{{/each}}';
//let tpl = '{{#with person}}{{fname}} {{sname}}{{/with}}';
//let tpl = 'test tpl {{A}}';

let stubble = new Stubble();
let fn = stubble.compile(tpl)
let res = fn(data);

console.log(res);