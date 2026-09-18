const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const code=fs.readFileSync(__dirname+'/js/scanner.js','utf8');
function setup(getUserMedia,secure=true){
 const elements=new Map(); const make=()=>({hidden:false,disabled:false,open:false,handlers:{},addEventListener(t,f){this.handlers[t]=f},setAttribute(){},showModal(){this.open=true},close(){this.open=false;this.handlers.close?.()},play:async()=>{}});
 const document={hidden:false,handlers:{},querySelector(id){if(!elements.has(id))elements.set(id,make());return elements.get(id)},addEventListener(t,f){this.handlers[t]=f}};
 const window={isSecureContext:secure,addEventListener(){}};
 vm.runInNewContext(code,{document,window,navigator:{mediaDevices:{getUserMedia}}});
 const el=id=>document.querySelector('#'+id),click=id=>el(id).handlers.click();
 click('open-scanner');return {el,click,document};
}
(async()=>{
 let stopped=0,options;const stream={getTracks:()=>[{stop(){stopped++}}]};
 let s=setup(async arg=>{options=arg;return stream});await s.click('connect-camera');assert.equal(s.el('camera-preview').srcObject,stream);assert.equal(options.audio,false);s.click('open-qr-test');assert.equal(stopped,1);assert.equal(s.el('qr-test-panel').hidden,false);
 let resolve;s=setup(()=>new Promise(r=>resolve=r));const pending=s.click('connect-camera');s.click('close-scanner');resolve(stream);await pending;assert.equal(stopped,2);assert.equal(s.el('camera-preview').srcObject,null);
 s=setup(async()=>{throw {name:'NotAllowedError'}});await s.click('connect-camera');assert.match(s.el('camera-status').textContent,/권한/);assert.equal(s.el('connect-camera').disabled,false);
 s=setup(null,false);await s.click('connect-camera');assert.match(s.el('camera-status').textContent,/HTTPS/);
 s=setup(async()=>stream);await s.click('connect-camera');s.document.hidden=true;s.document.handlers.visibilitychange();assert.equal(stopped,3);
 console.log('PASS: camera attach, audio disabled, test-switch cleanup, late permission cleanup, denied/unsupported messages, background cleanup');
})();
