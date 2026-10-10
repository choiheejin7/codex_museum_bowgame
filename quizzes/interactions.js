document.querySelectorAll('.drag-task').forEach(task=>{
 const tokens=[...task.querySelectorAll('.drag-token')];
 const slots=[...task.querySelectorAll('.drop-slot')];
 const bank=task.querySelector('.drag-bank');
 const text=new Map(tokens.map(t=>[t.dataset.key,t.textContent]));
 let state=null;
 function refresh(){slots.forEach(slot=>{const key=slot.dataset.key;slot.textContent=key===undefined?slot.dataset.placeholder:text.get(key);slot.classList.toggle('filled',key!==undefined);slot.setAttribute('aria-label',key===undefined?slot.dataset.placeholder:slot.dataset.placeholder+': '+text.get(key)+', 누르면 취소')});tokens.forEach(token=>token.classList.toggle('used',slots.some(slot=>slot.dataset.key===token.dataset.key)))}
 function clear(slot){delete slot.dataset.key;refresh()}
 function place(key,target){slots.forEach(slot=>{if(slot.dataset.key===key)delete slot.dataset.key});target.dataset.key=key;refresh()}
 function targetAt(x,y){const node=document.elementFromPoint(x,y);if(!node||!task.contains(node))return null;return node.closest('.drop-slot')||node.closest('.drag-bank')}
 function finish(event,cancel){if(!state)return;const s=state;state=null;slots.forEach(n=>n.classList.remove('drop-hover'));bank.classList.remove('drop-hover');s.source.classList.remove('drag-origin');s.ghost?.remove();if(cancel)return;if(s.moved){const target=targetAt(event.clientX,event.clientY);if(target?.classList.contains('drop-slot'))place(s.key,target);else if(target===bank&&s.source.classList.contains('drop-slot'))clear(s.source)}else if(s.source.classList.contains('drop-slot'))clear(s.source)}
 [...tokens,...slots].forEach(source=>{
 source.addEventListener('pointerdown',event=>{if(event.button!==0||state)return;const key=source.dataset.key;if(key===undefined)return;event.preventDefault();source.setPointerCapture(event.pointerId);state={source,key,x:event.clientX,y:event.clientY,moved:false,ghost:null}});
 source.addEventListener('pointermove',event=>{if(!state||state.source!==source)return;const s=state;if(!s.moved&&Math.hypot(event.clientX-s.x,event.clientY-s.y)>5){s.moved=true;s.ghost=document.createElement('div');s.ghost.className='drag-ghost';s.ghost.textContent=text.get(s.key);document.body.append(s.ghost);source.classList.add('drag-origin')}if(!s.moved)return;event.preventDefault();s.ghost.style.left=event.clientX+'px';s.ghost.style.top=event.clientY+'px';const target=targetAt(event.clientX,event.clientY);slots.forEach(n=>n.classList.toggle('drop-hover',n===target));bank.classList.toggle('drop-hover',target===bank);if(event.clientY<65)window.scrollBy(0,-10);else if(event.clientY>innerHeight-65)window.scrollBy(0,10)});
 source.addEventListener('pointerup',event=>finish(event,false));source.addEventListener('pointercancel',event=>finish(event,true));source.addEventListener('lostpointercapture',event=>finish(event,true));
 source.addEventListener('keydown',event=>{if(event.key!=='Enter'&&event.key!==' ')return;event.preventDefault();if(source.classList.contains('drop-slot'))clear(source);else{const empty=slots.find(s=>s.dataset.key===undefined);if(empty)place(source.dataset.key,empty)}});
 });
 refresh();
});
