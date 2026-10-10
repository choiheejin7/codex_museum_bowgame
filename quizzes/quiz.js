document.querySelector('form').addEventListener('submit',event=>{
 event.preventDefault();
 const form=event.currentTarget;const id=form.dataset.quiz;const quiz=QuizAnswers[id];
 let values;
 if(quiz.type==='drag')values=[...form.querySelectorAll('.drop-slot')].map(s=>s.dataset.key??'');
 else if(quiz.type==='ox')values=[...form.querySelectorAll('.statement')].map(s=>s.querySelector('input:checked')?.value??'');
 else values=[form.querySelector('input:checked')?.value??''];
 const message=form.querySelector('.preview-message');message.className='preview-message standalone-feedback';
 if(values.length!==quiz.answer.length||values.some(v=>v==='')){message.textContent='모든 답안을 선택해주세요.';return;}
 const correct=values.every((v,i)=>v===quiz.answer[i]);message.classList.toggle('wrong',!correct);
 if(!correct){message.textContent='아쉽지만 틀렸어요! 답안을 바꾸고 다시 도전해보세요.';return;}
 const saved=GameStorage.acquire(id);
 if(!saved.ok){message.textContent='진행도를 저장할 수 없어요. 사이트 저장 설정을 확인하고 다시 시도해주세요.';return;}
 const item=MuseumData.items.find(item=>item.id===id);
 message.textContent=saved.isNew?'✓ 정답입니다! '+item.name+' 획득!':'✓ 정답입니다! 이미 획득한 아이템입니다.';
 if(saved.complete){const back=document.querySelector('.back');back.href='../complete.html';back.textContent='완성된 활과 화살 보기';}
});