const dialog = document.querySelector('#item-dialog');
function renderCollection() {
  const collected = GameStorage.read();
  document.querySelector('#progress-text').textContent = `획득 아이템 ${collected.length} / ${MuseumData.items.length}`;
  document.querySelector('#collection-progress').value = collected.length;
  document.querySelector('#complete-link').hidden = !GameStorage.isComplete();
  for (const category of ['bow', 'arrow']) {
    const grid = document.querySelector(`#${category}-items`);
    grid.replaceChildren();
    MuseumData.items.filter(item => item.category === category).forEach(item => {
      const owned = collected.includes(item.id);
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `item-card ${owned ? 'owned' : 'locked'}`;
      card.setAttribute('aria-label', `${item.name}, ${owned ? '획득 완료' : '미획득, QR 위치 힌트 보기'}`);
      const image = document.createElement('img');
      image.id = `item-${item.id}`;
      image.src = item.image;
      image.alt = item.name;
      const name = document.createElement('strong');
      name.textContent = item.name;
      const status = document.createElement('span');
      status.className = 'item-status';
      status.textContent = owned ? '✓ 획득 완료' : '미획득';
      card.append(image, name, status);
      card.addEventListener('click', () => {
        document.querySelector('#dialog-title').textContent = item.name;
        document.querySelector('#dialog-description').textContent = owned ? '이미 획득한 아이템입니다.' : '아직 획득하지 않은 아이템입니다.';
        document.querySelector('#hint-area').hidden = owned;
        document.querySelector('#dialog-hint').textContent = item.hint;
        dialog.showModal();
      });
      grid.append(card);
    });
  }
}
MuseumData.items.forEach(item => {
  const link = document.createElement('a');
  link.href = `quiz.html?id=${encodeURIComponent(item.id)}`;
  link.textContent = `${item.name} QR`;
  document.querySelector('#dev-links')?.append(link);
});
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
// 완료 후 수집북을 다시 볼 때 자동 이동이 반복되지 않도록 명시적인 보기 URL을 사용합니다.
function syncCollection() {
  if (GameStorage.isComplete() && new URLSearchParams(location.search).get('view') !== 'all') {
    location.replace('complete.html');
    return;
  }
  renderCollection();
}
window.addEventListener('pageshow', syncCollection);
window.addEventListener('storage', syncCollection);
syncCollection();

