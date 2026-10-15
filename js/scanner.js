// Camera lifecycle is separate from collection/reward logic.
(() => {
  const modal = document.querySelector('#scanner-dialog');
  const open = document.querySelector('#open-scanner');
  if (!modal || !open) return;
  const panel = document.querySelector('#camera-panel');
  const video = document.querySelector('#camera-preview');
  const status = document.querySelector('#camera-status');
  const stop = document.querySelector('#stop-camera');
  let stream = null;
  let request = 0;
  let scanTimer = null;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  function scanFrame(current) {
    if (current !== request || !stream || !modal.open || document.hidden) return;
    try {
      if (video.readyState >= 2 && video.videoWidth && context && typeof jsQR === 'function') {
        const ratio = Math.min(1, 720 / video.videoWidth);
        canvas.width = Math.round(video.videoWidth * ratio);
        canvas.height = Math.round(video.videoHeight * ratio);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frame = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(frame.data, frame.width, frame.height, { inversionAttempts: 'attemptBoth' });
        if (code) {
          const target = resolveMuseumQR(code.data);
          if (target) {
            status.textContent = 'QR을 인식했어요. 문제로 이동합니다.';
            stopCamera();
            location.assign(target);
            return;
          }
          status.textContent = '이 게임의 문제 QR이 아니에요. 박물관 퀴즈 QR을 비춰주세요.';
        }
      }
    } catch {
      status.textContent = 'QR을 읽기 어려워요. 밝은 곳에서 QR 전체가 보이도록 비춰주세요.';
    }
    scanTimer = setTimeout(() => scanFrame(current), 180);
  }

  function stopCamera() {
    request++;
    clearTimeout(scanTimer);
    scanTimer = null;
    if (stream) stream.getTracks().forEach(track => track.stop());
    stream = null;
    video.srcObject = null;
    video.hidden = true;
  }
  function reset() {
    stopCamera();
    panel.hidden = true;
  }
  open.addEventListener('click', () => { reset(); modal.showModal(); return connectCamera(); });
  modal.addEventListener('close', reset);
  modal.addEventListener('cancel', reset);
  modal.addEventListener('click', event => {
    const rect = modal.getBoundingClientRect();
    if (event.target === modal && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) {
      reset(); modal.close();
    }
  });

  stop.addEventListener('click', () => { reset(); modal.close(); });
  async function connectCamera() {
    stopCamera();
    const current = request;
    panel.hidden = false;
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      status.textContent = '이 환경에서는 카메라를 연결할 수 없어요. HTTPS 배포 주소를 Safari 또는 Chrome으로 열어주세요. PC에서는 localhost로 테스트할 수 있어요.';
      return;
    }
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
      status.textContent = '카메라가 연결되었어요. QR 전체를 비추면 문제로 자동 이동합니다.';
      if (typeof jsQR !== 'function') { status.textContent = 'QR 인식 기능을 불러오지 못했어요. 새로고침 후 다시 연결해주세요.'; }
      else scanFrame(current);
    } catch (error) {
      if (current !== request) return;
      stopCamera();
      const messages = {
        NotAllowedError: '카메라 권한이 허용되지 않았어요. 브라우저의 사이트 설정에서 카메라를 허용한 뒤 다시 연결해주세요.',
        NotFoundError: '사용 가능한 카메라를 찾을 수 없어요. 카메라가 있는 기기에서 열어주세요.',
        NotReadableError: '카메라를 사용할 수 없어요. 다른 앱이 카메라를 사용 중인지 확인한 뒤 다시 연결해주세요.'
      };
      status.textContent = messages[error.name] || '카메라 연결에 실패했어요. 수집북으로 돌아가 QR 스캔을 다시 눌러주세요.';
    }
  }
  window.addEventListener('pagehide', reset);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { stopCamera(); status.textContent = '카메라가 중지되었어요. 수집북으로 돌아가 QR 스캔을 다시 눌러주세요.'; }
  });
})();

