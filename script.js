const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const progress=document.querySelector('.scroll-progress i');
const heroImage=document.querySelector('.hero-image');
const copy=document.querySelector('.hero-copy');
const cursor=document.querySelector('.cursor');
let mx=innerWidth/2,my=innerHeight/2,px=mx,py=my;

addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;if(cursor){cursor.style.transform=`translate3d(${mx}px,${my}px,0)`}});

function animate(){
  px+=(mx-px)*.08; py+=(my-py)*.08;
  if(!reduced){
    const rx=(py-innerHeight/2)/innerHeight*2;
    const ry=(px-innerWidth/2)/innerWidth*2;
    heroImage.style.transform=`translate3d(${ry*10}px,${rx*8}px,0) scale(1.03)`;
    if(copy) copy.style.transform=`translate3d(${ry*-4}px,${rx*-3}px,0)`;
  }
  requestAnimationFrame(animate);
}
animate();

addEventListener('scroll',()=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  progress.style.width=`${Math.min(100,scrollY/max*100)}%`;
  if(!reduced){document.querySelectorAll('[data-speed]').forEach(el=>{const r=el.getBoundingClientRect();const y=(r.top-innerHeight/2)*-parseFloat(el.dataset.speed||0);el.style.transform=`translate3d(0,${y}px,0)`});}
},{passive:true});

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// Lightweight canvas particle field: depth, attraction and spring-like pointer response.
const canvas=document.getElementById('space'),ctx=canvas.getContext('2d');let W,H,dpr,stars=[];
function resize(){dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);stars=Array.from({length:Math.min(180,Math.floor(W*H/8000))},()=>({x:Math.random()*W,y:Math.random()*H,z:Math.random(),vx:0,vy:0,r:Math.random()*1.5+.25}))}
function field(){ctx.clearRect(0,0,W,H);for(const s of stars){const depth=.35+s.z*.9;const dx=mx-s.x,dy=my-s.y,d=Math.hypot(dx,dy)||1;if(d<180&&!reduced){s.vx+=dx/d*.025*(1-s.z);s.vy+=dy/d*.025*(1-s.z)}s.vx*=.985;s.vy*=.985;s.x+=s.vx;s.y+=s.vy;if(s.x<0||s.x>W)s.vx*=-1;if(s.y<0||s.y>H)s.vy*=-1;ctx.globalAlpha=.18+s.z*.55;ctx.beginPath();ctx.arc(s.x,s.y,s.r*depth,0,Math.PI*2);ctx.fillStyle='#d8fbff';ctx.fill()}requestAnimationFrame(field)}
resize();addEventListener('resize',resize);field();

// Floating chips respond to scroll and pointer, creating a subtle physics feel.
if(!reduced){document.querySelectorAll('[data-float]').forEach((el,i)=>{el.dataset.x=0;el.dataset.y=0;el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.12}px)`});el.addEventListener('pointerleave',()=>el.style.transform='')})}

// Count-up metrics when they enter the viewport.
const counters=document.querySelectorAll('[data-count]');
const countObs=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting||entry.target.dataset.done)return;entry.target.dataset.done='1';const target=+entry.target.dataset.count;const start=performance.now();const duration=1200;function tick(t){const p=Math.min(1,(t-start)/duration);entry.target.textContent=Math.floor((1-Math.pow(1-p,3))*target);if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)}),{threshold:.5});counters.forEach(c=>countObs.observe(c));

// Magnetic buttons.
if(!reduced)addEventListener('pointermove',e=>{document.querySelectorAll('.magnetic').forEach(el=>{const r=el.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),d=Math.hypot(dx,dy);if(d<90)el.style.transform=`translate(${dx*.12}px,${dy*.12}px)`;else el.style.transform=''})});
