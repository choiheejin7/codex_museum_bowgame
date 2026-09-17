if (!GameStorage.isComplete()) location.replace('collection.html');
document.querySelector('#reset-game').addEventListener('click', () => {
  if (!confirm('모은 아이템을 모두 초기화하고 새 탐험을 시작할까요?')) return;
  if (GameStorage.reset()) location.assign('index.html');
  else document.querySelector('#reset-error').textContent = '초기화할 수 없어요. 브라우저의 사이트 저장 설정을 확인해주세요.';
});
