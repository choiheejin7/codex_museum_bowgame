// 기존 QR 주소와 저장 기록을 유지하기 위해 upper는 긴 활채, lower는 활고자 ID로 사용합니다.
// 실제 전시 콘텐츠로 바꿀 때 아이템 이름, hint, image를 수정하세요. 교육 퀴즈는 quizzes/에서 관리합니다.
window.MuseumData = {
  items: [
    { id: 'grip', name: '줌통', category: 'bow', qr: 'A', hint: '1층 활 구조 전시 근처에서 QR을 찾아보세요.', image: 'assets/images/grip.svg' },
    { id: 'upper', name: '긴 활채', category: 'bow', qr: 'B', hint: '2층 활 제작 전시 구역 근처에서 QR을 찾아보세요.', image: 'assets/images/upper.svg' },
    { id: 'lower', name: '활고자', category: 'bow', qr: 'C', hint: '1층 활의 양 끝과 시위를 연결하는 부분을 소개하는 전시에서 QR을 찾아보세요.', image: 'assets/images/lower.svg' },
    { id: 'string', name: '시위', category: 'bow', qr: 'D', hint: '2층 활쏘기 체험 안내판 근처에서 QR을 찾아보세요.', image: 'assets/images/string.svg' },
    { id: 'shaft', name: '살대', category: 'arrow', qr: 'E', hint: '1층 대나무 화살 전시장에서 QR을 찾아보세요.', image: 'assets/images/shaft.svg' },
    { id: 'arrowhead', name: '화살촉', category: 'arrow', qr: 'F', hint: '2층 금속 공예 전시 진열장 근처에서 QR을 찾아보세요.', image: 'assets/images/arrowhead.svg' },
    { id: 'feather', name: '깃과 오늬', category: 'arrow', qr: 'G', hint: '1층 궁사의 도구 전시 마지막 구역에서 QR을 찾아보세요.', image: 'assets/images/feather.svg' }
  ]
};
