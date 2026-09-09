const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
let checks = 0;
function run(file, input, selected = false) {
  let text = input;
  const info = [], errors = [];
  const state = { postInfo: value => info.push(value), postError: value => errors.push(value),
    insert: value => { text = selected ? value : text + value; } };
  Object.defineProperty(state, 'text', {get: () => text, set: value => {text = value;}});
  // Fail any access that could terminate Boop's multiselect loop or overwrite context.
  Object.defineProperty(state, 'fullText', {get(){throw Error('Unexpected fullText read');},set(){throw Error('Unexpected fullText write');}});
  Object.defineProperty(state, 'selection', {get(){throw Error('Use state.text');}});
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  JSON.parse(source.match(/\/\*\*\s*([\s\S]*?)\*\*\//)[1]);
  const context = vm.createContext({});
  vm.runInContext(source, context);
  context.main(state);
  return {text, info, errors, document: selected ? 'BEFORE|' + text + '|AFTER' : text};
}
function good(file, input, expected) {
  for (const selected of [false, true]) {
    const result = run(file, input, selected);
    assert.deepEqual(result.errors, [], file + ': ' + input);
    assert.equal(result.text, expected, file + ': ' + input);
    if (selected) assert.equal(result.document, 'BEFORE|' + expected + '|AFTER');
    checks++;
  }
}
function bad(file, input) {
  for (const selected of [false, true]) {
    const result = run(file, input, selected);
    assert.equal(result.text, input, file);
    assert.ok(result.errors.length, file + ': expected rejection of ' + JSON.stringify(input));
    checks++;
  }
}
const jf = 'SuperFormatJSON.js';
for (const value of [{url:'https://example.com',text:'undefined NaN Infinity /*comment*/'}, {a:'quotes " and \\',b:[true,null,1]}, {'__proto__':null}, [1,2], false, null]) {
  good(jf, JSON.stringify(value), JSON.stringify(value,null,2));
}
good(jf, "{ // comment\n url: 'https://example.com', value: 'undefined', list: [1,2,], /* hi */}", JSON.stringify({url:'https://example.com',value:'undefined',list:[1,2]},null,2));
good(jf, "{a: undefined, b: NaN, c: -Infinity, d: Infinity}", JSON.stringify({a:null,b:null,c:null,d:null},null,2));
good(jf, "{a: 'it\\'s \\" + '"' + "ok\\" + '"' + "', b: '\\u4e2d\\n'}", JSON.stringify({a:'it\'s "ok"',b:'中\n'},null,2));
good(jf, '[word]', '[\n  "word"\n]');
for (const input of ['', '[,]', '{,}', '[1,,]', '{a:1,,}', '{a: 1/*x*/2}', '{a: alert(1)}', "{a: '\\q'}", '{a:"x}', '/*open', '[true false]']) bad(jf,input);
for (const input of ['255,128,0','rgb(255, 128, 0)',' RGB( 255  128\t0 ) ']) good('rgb2hex.js',input,'#FF8000');
for (const input of ['', '999,0,0','-1,0,0','1.5,0,0','1x,0,0','1,,2','1,2,3,4','rgba(1,2,3,1)']) bad('rgb2hex.js',input);
good('ASCII2DIGI.js',' A😀\n',' \tA\t😀\t\\n\n32\t65\t128512\t10');
bad('ASCII2DIGI.js',''); bad('ASCII2DIGI.js','\ud800');
good('DIGI2ASCII.js','65, 128512\n32\t66','A😀 B');
for (const input of ['', '65,,66', '-1', '1114112','55296','65x','65,','1.5']) bad('DIGI2ASCII.js',input);
for (const input of ['A','😀',' ']) good('GetKeyCodeByKey.js',input,input);
for (const input of ['', 'AB','\ud800']) bad('GetKeyCodeByKey.js',input);
for (const input of ['65','128512','0','1114111']) good('GetKeyByKeyCode.js',input,input);
assert.match(run('GetKeyCodeByKey.js','😀').info[0],/128512/);
assert.match(run('GetKeyByKeyCode.js','128512').info[0],/😀/);
for (const input of ['', '-1', '55296','1114112','1e2']) bad('GetKeyByKeyCode.js',input);
good('NewlineEscape2Real.js','a\\r\\nb\\nc\\rd','a\nb\nc\nd');
good('NewlineReal2Escape.js','a\r\nb\nc\rd','a\\nb\\nc\\nd');
good('MultiLines.js','a\\n  \\n\t b','a\nb');
const pem='JWTPrivateKeyFormat.js';
good(pem,'-----BEGIN PRIVATE KEY-----\\r\\nQUJD\\n-----END PRIVATE KEY-----','-----BEGIN PRIVATE KEY-----\nQUJD\n-----END PRIVATE KEY-----');
good(pem,'QUJD'.repeat(20),'QUJD'.repeat(16)+'\n'+'QUJD'.repeat(4));
good(pem,' Zg== ','Zg==');
for (const input of ['', '!!', 'ABC', '-----BEGIN PRIVATE KEY-----QUJD-----END PUBLIC KEY-----', '-----BEGIN PRIVATE KEY-----QUJD', 'prefix-----BEGIN PRIVATE KEY-----QUJD-----END PRIVATE KEY-----', '-----BEGIN A-----QUJD-----END A----------BEGIN A-----QUJD-----END A-----']) bad(pem,input);
const template=run('BoopScriptTemplate.js','',false).text;
const context=vm.createContext({}); vm.runInContext(template,context);
let unchanged='secret';context.main({get text(){return unchanged;},set text(v){unchanged=v;},postInfo(){},postError(){}});assert.equal(unchanged,'secret');
assert.equal(run('BoopScriptTemplate.js','keep',false).text,'keep'+template);
assert.equal(run('BoopScriptTemplate.js','replace',true).text,template);
for (const file of fs.readdirSync(path.join(root,'examples'))) {
 const result=run('examples/'+file,'a  b\n\tc',true);
 assert.equal(result.errors.length,0);
 if(file==='Poopificator.js.txt') assert.deepEqual(result.text.match(/\s+/g),['  ','\n\t']);
}
console.log(`Passed ${checks} whole-document/selection cases, lookup assertions, generated-template execution and archived examples.`);
