const header=document.querySelector('.site-header');
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav-links');
const glow=document.querySelector('.cursor-glow');
const card=document.querySelector('.tilt-card');

window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>24),{passive:true});
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.classList.toggle('active',open);toggle.setAttribute('aria-expanded',String(open));});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');toggle.classList.remove('active');toggle.setAttribute('aria-expanded','false');}));

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const countObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;const target=Number(el.dataset.count);const suffix=el.dataset.suffix||'';const start=performance.now();const duration=1100;function tick(now){const p=Math.min((now-start)/duration,1);el.textContent=Math.round(target*(1-Math.pow(1-p,3)))+suffix;if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick);countObserver.unobserve(el);}),{threshold:.65});
document.querySelectorAll('[data-count]').forEach(el=>countObserver.observe(el));

if(matchMedia('(pointer:fine)').matches){window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';if(!card)return;const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateY(${x*7}deg) rotateX(${-y*7}deg)`;});card?.addEventListener('pointerleave',()=>card.style.transform='');}
document.getElementById('year').textContent=new Date().getFullYear();

const localizationTyping=document.getElementById('localization-typing');
const localizationCards=[...document.querySelectorAll('[data-localization-card]')];
const localizationLines=[
  'the answer is not always at the top.',
  'work, risk and access happen locally.',
  'power lies with people.',
  'local is fairer.',
  'local actors know their communities better.',
  'it is common sense.'
];

if(localizationTyping&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  let line=0,char=localizationLines[0].length,deleting=true;
  const activate=index=>localizationCards.forEach((card,i)=>card.classList.toggle('is-active',i===index));
  const type=()=>{
    const phrase=localizationLines[line];
    localizationTyping.textContent=phrase.slice(0,char);
    if(!deleting&&char<phrase.length){char+=1;setTimeout(type,34);return;}
    if(!deleting&&char===phrase.length){deleting=true;setTimeout(type,1800);return;}
    if(deleting&&char>0){char-=1;setTimeout(type,18);return;}
    line=(line+1)%localizationLines.length;activate(line);deleting=false;setTimeout(type,260);
  };
  activate(0);
  setTimeout(type,1700);
}
