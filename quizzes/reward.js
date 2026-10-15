// Shared reward dialog for all seven quizzes.
(() => {
 const template=document.createElement('template');
 template.innerHTML="<dialog class=\"reward-modal\" id=\"reward-modal\" aria-labelledby=\"reward-title\" aria-describedby=\"reward-item-name\"><p class=\"reward-kicker\">탐험의 조각을 찾았어요</p><h2 id=\"reward-title\">정답!</h2><div class=\"item-stage\"><span class=\"orbit\" aria-hidden=\"true\"></span><span class=\"spark\" aria-hidden=\"true\" style=\"--x:22%;--y:25%;--size:16px;--delay:0s\">✦</span><span class=\"spark\" aria-hidden=\"true\" style=\"--x:75%;--y:23%;--size:12px;--delay:0.4s\">✦</span><span class=\"spark\" aria-hidden=\"true\" style=\"--x:17%;--y:58%;--size:11px;--delay:0.8s\">✦</span><span class=\"spark\" aria-hidden=\"true\" style=\"--x:82%;--y:65%;--size:17px;--delay:0.2s\">✦</span><span class=\"spark\" aria-hidden=\"true\" style=\"--x:32%;--y:82%;--size:12px;--delay:1s\">✦</span><span class=\"spark\" aria-hidden=\"true\" style=\"--x:64%;--y:85%;--size:10px;--delay:0.6s\">✦</span><span class=\"spark\" aria-hidden=\"true\" style=\"--x:53%;--y:12%;--size:10px;--delay:1.2s\">✦</span><img class=\"reward-item\" alt=\"\"></div><p class=\"reward-seal\" id=\"reward-item-name\"></p><a class=\"reward-return\" href=\"../collection.html\">수집북으로 돌아가기</a></dialog>";
 const modal=template.content.firstElementChild;
 document.body.append(modal);
 window.showItemReward=item=>{
  const image=modal.querySelector('.reward-item');
  image.src='../'+item.image;
  image.alt='획득한 '+item.name;
  modal.querySelector('.reward-seal').textContent='✦ '+item.name+' 획득 ✦';
  if(!modal.open)modal.showModal();
 };
})();
