const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const files = name => fs.readFileSync(__dirname + '/js/' + name, 'utf8');
const entries = new Map();
const storage = {getItem:k=>entries.get(k) ?? null,setItem:(k,v)=>entries.set(k,v),removeItem:k=>entries.delete(k)};
function fresh() { const c = vm.createContext({localStorage:storage}); c.window=c; vm.runInContext(files('data.js'),c);vm.runInContext(files('storage.js'),c);return c; }
let c=fresh();
assert.equal(c.GameStorage.read().length,0);
for(const id of ['lower','arrowhead','grip','string','upper','feather','shaft']) assert.equal(c.GameStorage.acquire(id).ok,true);
assert.equal(c.GameStorage.isComplete(),true);
assert.equal(c.GameStorage.acquire('grip').isNew,false);
assert.equal(c.GameStorage.read().length,7);
assert.equal(fresh().GameStorage.read().length,7);
assert.equal(c.GameStorage.acquire('bad').ok,false);
entries.set('museumBowGame','broken json'); assert.equal(c.GameStorage.read().length,0);
entries.set('museumBowGame','["grip","grip","bad",null]'); assert.equal(c.GameStorage.read().length,1);
entries.set('museumBowGame','{}'); assert.equal(c.GameStorage.read().length,0);
const originalSet=storage.setItem;storage.setItem=()=>{throw Error('blocked')};assert.equal(c.GameStorage.acquire('upper').ok,false);storage.setItem=originalSet;
for(const item of c.MuseumData.items) c.GameStorage.acquire(item.id);
let reset, destination, approved=false;
c.document={querySelector:()=>({addEventListener:(_,fn)=>{reset=fn}})};c.confirm=()=>approved;c.location={replace:url=>destination=url,assign:url=>destination=url};
vm.runInContext(files('complete.js'),c);reset();assert.equal(c.GameStorage.read().length,7);assert.equal(destination,undefined);approved=true;reset();assert.equal(storage.getItem('museumBowGame'),null);assert.equal(destination,'index.html');
for(const page of ['index.html','collection.html','quiz.html','complete.html']) {
 const html=fs.readFileSync(__dirname+'/'+page,'utf8');
 for(const [,ref] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {const file=ref.split('?')[0];assert.ok(fs.existsSync(__dirname+'/'+file), page+' -> '+ref);}
}
for(const item of c.MuseumData.items) assert.ok(fs.existsSync(__dirname+'/'+item.image));
console.log('PASS: free order, unique rewards, persistence, corrupt data, failed save, reset cancel/confirm, page links and images.');
