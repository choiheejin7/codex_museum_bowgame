// 이전 QR 주소도 해당 교육 퀴즈로 연결합니다.
const id = new URLSearchParams(location.search).get('id');
if (MuseumData.items.some(item => item.id === id)) location.replace('quizzes/' + encodeURIComponent(id) + '.html');
else document.querySelector('#invalid-quiz').hidden = false;
