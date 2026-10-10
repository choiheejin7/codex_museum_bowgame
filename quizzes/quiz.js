document.querySelector('form').addEventListener('submit',event=>{
event.preventDefault();const form=event.currentTarget;const quiz=QuizAnswers[form.dataset.quiz];
const values=quiz.type==='drag'?[...form.querySelectorAll('.drop-slot')].map(s=>s.dataset.key||''):[...form.querySelectorAll(quiz.type==='ox'?'.statement':'.option:first-child')].map(group=>quiz.type==='ox'?group.querySelector('input:checked')?.value||'':form.querySelector('input:checked')?.value||'');
const message=form.querySelector('.preview-message');message.className='preview-message standalone-feedback';
if(values.length!==quiz.answer.length||values.some(v=>!v)){message.textContent='모든 답안을 선택해주세요.';return;}
const correct=values.every((v,i)=>v===quiz.answer[i]);message.classList.toggle('wrong',!correct);message.textContent=correct?'✓ 정답입니다! 잘 풀었어요.':'아쉽지만 틀렸어요! 답안을 바꾸고 다시 도전해보세요.';
});