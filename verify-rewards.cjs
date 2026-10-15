const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const root=__dirname;
const read=p=>fs.readFileSync(root+'/'+p,'utf8');
const ids=['grip','upper','lower','string','shaft','arrowhead','feather'];
const entries=new Map();
let shown=[];
for(const id of ids){
 let submit;const message={textContent:'',className:'',classList:{toggle(){}}};
 const c={window:null,localStorage:{getItem:k=>entries.get(k)??null,setItem:(k,v)=>entries.set(k,v)},showItemReward:item=>shown.push(item)};c.window=c;
 vm.createContext(c);for(const path of ['js/data.js','js/storage.js','quizzes/data.js'])vm.runInContext(read(path),c);
 const answer=c.QuizAnswers[id];let values=[...answer.answer];
 const form={dataset:{quiz:id},addEventListener:(type,fn)=>submit=fn,querySelector:sel=>sel==='.preview-message'?message:{value:values[0]},querySelectorAll:sel=>sel==='.drop-slot'?values.map(v=>({dataset:{key:v}})):values.map(v=>({querySelector:()=>({value:v})}))};
 c.document={querySelector:()=>form};vm.runInContext(read('quizzes/quiz.js'),c);
 const event={preventDefault(){},currentTarget:form};
 const correct=values;values=values.map(()=>'?');submit(event);assert.equal(entries.has('museumBowGame')&&JSON.parse(entries.get('museumBowGame')).includes(id),false);assert.equal(shown.length,ids.indexOf(id));
 values=correct;submit(event);assert.equal(shown.at(-1).id,id);assert.ok(fs.existsSync(root+'/'+shown.at(-1).image));
 submit(event);assert.equal(JSON.parse(entries.get('museumBowGame')).filter(v=>v===id).length,1);
 const html=read('quizzes/'+id+'.html');assert.ok(html.includes('src="reward.js"'));assert.ok(html.includes('href="reward.css"'));
 // Each item opens the dialog twice, including a repeat correct submission.
 shown.pop();
}
assert.equal(shown.length,7);assert.equal(JSON.parse(entries.get('museumBowGame')).length,7);
console.log('PASS: all seven correct answers show matching item rewards; wrong answers do not award; duplicate rewards are not stored; image assets and shared scripts exist.');
