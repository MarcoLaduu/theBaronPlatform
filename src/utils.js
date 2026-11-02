// Funzioni di utilità: numeri casuali, collisioni, creazione degli sprite.
export function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
export const clamp=(v,a,b)=>v<a?a:v>b?b:v;
export const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export function mk(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');fn(x);return c;}
export function sprite(rows,pal,sc=1){
  const w=Math.max(...rows.map(r=>r.length)),h=rows.length;
  return mk(w*sc,h*sc,x=>{rows.forEach((r,j)=>{for(let i=0;i<w;i++){const ch=r[i]||'.';const col=pal[ch];if(!col)continue;x.fillStyle=col;x.fillRect(i*sc,j*sc,sc,sc);}});});
}
export function flip(c){return mk(c.width,c.height,x=>{x.translate(c.width,0);x.scale(-1,1);x.drawImage(c,0,0);});}
export function white(c){return mk(c.width,c.height,x=>{x.drawImage(c,0,0);x.globalCompositeOperation='source-in';x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);});}
