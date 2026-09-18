// Camera lifecycle is separate from collection/reward logic.
(() => {
  const modal = document.querySelector('#scanner-dialog');
  const open = document.querySelector('#open-scanner');
  if (!modal || !open) return;
  const connect = document.querySelector('#connect-camera');
  const test = document.querySelector('#open-qr-test');
  const panel = document.querySelector('#camera-panel');
  const tests = document.querySelector('#qr-test-panel');
  const video = document.querySelector('#camera-preview');
  const status = document.querySelector('#camera-status');
  const stop = document.querySelector('#stop-camera');
  let stream = null;
  let request = 0;

  function stopCamera() {
    request++;
    if (stream) stream.getTracks().forEach(track => track.stop());
    stream = null;
    video.srcObject = null;
    video.hidden = true;
    connect.disabled = false;
    stop.hidden = true;
  }
  function reset() {
    stopCamera();
    panel.hidden = true;
    tests.hidden = true;
    test.setAttribute('aria-expanded', 'false');
  }
  open.addEventListener('click', () => { reset(); modal.showModal(); });
  document.querySelector('#close-scanner').addEventListener('click', () => { reset(); modal.close(); });
  modal.addEventListener('close', reset);
  modal.addEventListener('cancel', reset);
  modal.addEventListener('click', event => {
    const rect = modal.getBoundingClientRect();
    if (event.target === modal && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) {
      reset(); modal.close();
    }
  });
  test.addEventListener('click', () => {
    stopCamera();
    panel.hidden = true;
    tests.hidden = !tests.hidden;
    test.setAttribute('aria-expanded', String(!tests.hidden));
  });
  stop.addEventListener('click', () => { stopCamera(); status.textContent = '카메라를 껐어요. 카메라 연결을 누르면 다시 켤 수 있어요.'; });
  connect.addEventListener('click', async () => {
    stopCamera();
    const current = request;
    panel.hidden = false;
    tests.hidden = true;
    test.setAttribute('aria-expanded', 'false');
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      status.textContent = '이 환경에서는 카메라를 연결할 수 없어요. HTTPS 배포 주소를 Safari 또는 Chrome으로 열어주세요. PC에서는 localhost로 테스트할 수 있어요.';
      return;
    }
    connect.disabled = true;
    stop.hidden = false;
    status.textContent = '카메라 권한을 허용해주세요. 연결을 기다리고 있어요.';
    try {
      const incoming = await navigator.mediaDevices.getUserMedia({audio: false, video: {facingMode: {ideal: 'environment'}}});
      // A late permission response must not restart a closed/hidden camera.
      if (current !== request || !modal.open || document.hidden) {
        incoming.getTracks().forEach(track => track.stop());
        return;
      }
      stream = incoming;
      video.srcObject = incoming;
      video.hidden = false;
      await video.play();
      if (current !== request) return;
      status.textContent = '카메라가 연결되었어요.';
    } catch (error) {
      if (current !== request) return;
      stopCamera();
      const messages = {
        NotAllowedError: '카메라 권한이 허용되지 않았어요. 브라우저의 사이트 설정에서 카메라를 허용한 뒤 다시 연결해주세요.',
        NotFoundError: '사용 가능한 카메라를 찾을 수 없어요. 카메라가 있는 기기에서 열거나 QR 테스트를 이용해주세요.',
        NotReadableError: '카메라를 사용할 수 없어요. 다른 앱이 카메라를 사용 중인지 확인한 뒤 다시 연결해주세요.'
      };
      status.textContent = messages[error.name] || '카메라 연결에 실패했어요. 다시 연결하거나 QR 테스트를 이용해주세요.';
    } finally {
      if (current === request) connect.disabled = false;
    }
  });
  window.addEventListener('pagehide', reset);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { stopCamera(); status.textContent = '카메라가 중지되었어요. 카메라 연결을 눌러 다시 시작해주세요.'; }
  });
})();

