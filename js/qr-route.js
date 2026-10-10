(() => {
const base=new URL('./',location.href);
const valid=new Set(['grip','upper','lower','string','shaft','arrowhead','feather']);
window.resolveMuseumQR=value=>{
 try{
 const url=new URL(value,base);
 const publicBase='https://choiheejin7.github.io';
 const own=url.origin===base.origin&&url.pathname.startsWith(base.pathname);
 const published=url.origin===publicBase&&url.pathname.startsWith('/codex_museum_bowgame/');
 if(!own&&!published)return null;
 const prefix=own?base.pathname:'/codex_museum_bowgame/';
 const path=url.pathname.slice(prefix.length);
 let id;
 if(path==='quiz.html')id=url.searchParams.get('id');
 else {const match=path.match(/^quizzes\/([a-z]+)\.html$/);id=match?.[1];}
 return valid.has(id)?new URL('quizzes/'+id+'.html',base).href:null;
 }catch{return null;}
};
})();