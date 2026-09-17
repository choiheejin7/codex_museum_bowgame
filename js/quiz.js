const itemId = new URLSearchParams(location.search).get('id');
const item = MuseumData.items.find(entry => entry.id === itemId);
const form = document.querySelector('#answer-form');
const feedback = document.querySelector('#feedback');
const input = document.querySelector('#answer');
if (!item) {
  document.querySelector('#quiz-content').hidden = true;
  document.querySelector('#invalid-quiz').hidden = false;
} else {
  document.querySelector('#quiz-item').textContent = item.name;
  document.querySelector('#quiz-code').textContent = `QR ${item.qr} · 탐험 문제`;
  document.querySelector('#question').textContent = item.question;
  const image = document.querySelector('#reward-image');
  image.src = item.image;
  image.alt = item.name;
  function showOwned() {
    form.hidden = true;
    feedback.hidden = false;
    feedback.className = 'feedback success';
    document.querySelector('#feedback-icon').textContent = '✓';
    document.querySelector('#feedback-title').textContent = '이미 획득한 아이템입니다.';
    document.querySelector('#feedback-description').textContent = '수집북에서 확인하고 다른 QR을 찾아보세요.';
    document.querySelector('#reward').hidden = false;
    document.querySelector('#reward-name').textContent = `${item.name} 획득 완료`;
    document.querySelector('#retry').hidden = true;
  }
  if (GameStorage.read().includes(item.id)) showOwned();
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!input.value.trim()) { input.reportValidity(); return; }
    if (input.value.trim() !== String(item.answer).trim()) {
      form.hidden = true;
      feedback.hidden = false;
      feedback.className = 'feedback error';
      document.querySelector('#feedback-icon').textContent = '×';
      document.querySelector('#feedback-title').textContent = '아쉽지만 틀렸어요!';
      document.querySelector('#feedback-description').textContent = '다시 한번 생각해보고 도전해보세요.';
      document.querySelector('#reward').hidden = true;
      document.querySelector('#retry').hidden = false;
      document.querySelector('#retry').focus();
      return;
    }
    const result = GameStorage.acquire(item.id);
    if (!result.ok) {
      document.querySelector('#save-error').textContent = '진행도를 저장할 수 없어요. 브라우저의 사이트 저장 허용 설정을 확인하고 다시 시도해주세요.';
      return;
    }
    form.hidden = true;
    feedback.hidden = false;
    feedback.className = 'feedback success';
    document.querySelector('#feedback-icon').textContent = '✓';
    document.querySelector('#feedback-title').textContent = '정답입니다!';
    document.querySelector('#feedback-description').textContent = result.isNew ? '새로운 아이템을 획득했어요!' : '이미 획득한 아이템입니다.';
    document.querySelector('#reward').hidden = false;
    document.querySelector('#reward-name').textContent = `${item.name} 획득!`;
    document.querySelector('#retry').hidden = true;
    // 마지막 보상도 확인할 수 있게 한 뒤, 돌아가기 버튼에서 완료 화면으로 이동합니다.
    if (result.complete) document.querySelector('#return-link').href = 'complete.html';
    document.querySelector('#return-link').focus();
  });
  document.querySelector('#retry').addEventListener('click', () => {
    feedback.hidden = true;
    form.hidden = false;
    input.value = '';
    input.focus();
  });
}
