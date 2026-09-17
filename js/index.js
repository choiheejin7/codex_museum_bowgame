const count = GameStorage.read().length;
if (count) document.querySelector('#saved-progress').textContent = `이전에 모은 아이템 ${count}개가 저장되어 있어요. 이어서 탐험해보세요.`;
