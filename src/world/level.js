// Generatore dei livelli e nemici di ogni zona.
import { ROWS, T } from '../config.js';
import { KINDS } from '../graphics/enemies.js';
import { clamp, rng } from '../utils.js';

const LVL_EN=[
 {w:['goblin','goblin','thrower'],f:['thrower']},
 {w:['bramble','bramble','goblin'],f:['witch']},
 {w:['toadlet'],f:['mosquito']},
 {w:['soldier','soldier','toadlet'],f:['helmet']},
 {w:['gargoyle','soldier'],f:['bat']},
 {w:['imp','imp','gargoyle'],f:['skull','bat']}];
export function genLevel(i){
  const R=rng(5151+i*977);
  const L=150+i*22;
  const g=[];for(let r=0;r<ROWS;r++)g.push([]);
  const ents=[],deco=[];
  let c=0,h=3;
  const setCol=(cc,hh)=>{for(let r=0;r<ROWS;r++)g[r][cc]=r>=ROWS-hh?'#':' ';};
  const surf=()=>(ROWS-h)*T;
  const pick=a=>a[R()*a.length|0];
  function flat(n,decoOk=true){for(let k=0;k<n;k++){setCol(c,h);if(decoOk&&R()<.28)deco.push({x:c*T,y:surf(),k:R()*3|0});c++;}}
  function pit(n){for(let k=0;k<n;k++){setCol(c,0);c++;}}
  const walker=(cc,gy)=>{const k=pick(LVL_EN[i].w);ents.push({t:'en',kind:k,x:cc*T+3,y:gy-KINDS[k].h});};
  const flyer=(cc,ay,gy)=>{const k=pick(LVL_EN[i].f),K=KINDS[k];
    if(K.fly)ents.push({t:'en',kind:k,x:cc*T,y:ay});else if(gy!=null)ents.push({t:'en',kind:k,x:cc*T+3,y:gy-K.h});};
  const coinRow=(s,n,y)=>{for(let k=0;k<n;k++)ents.push({t:'coin',x:(s+k)*T+4,y:y+4});};
  flat(9,false);
  const start={x:2*T+3,y:surf()-20};
  const cps=[Math.floor(L*.34),Math.floor(L*.67)];let cpi=0;
  while(c<L){
    if(cpi<2&&c>cps[cpi]){flat(2,false);ents.push({t:'flag',x:c*T+3,y:surf()-32});if(R()<.7)ents.push({t:'heart',x:(c+3)*T+4,y:surf()-T+6});flat(5,false);cpi++;continue;}
    const p=R();
    if(p<.15){ // terreno con nemici
      const s=c,n=5+(R()*4|0);flat(n);
      walker(s+(n>>1),surf());if(R()<.3+i*.08)walker(s+n-2,surf());
      if(R()<.5)coinRow(s+1,n-2,surf()-2*T);
    } else if(p<.28){ // fossa
      const w=2+(R()<.45+i*.08?1:0);
      coinRow(c,w,surf()-3*T);pit(w);
      const r=R();if(r<.3&&h<6)h++;else if(r<.55&&h>2)h--;
      flat(2+(R()*2|0));
    } else if(p<.37){ // gradini
      const up=R()<.55;h=clamp(h+(up?1+(R()<.45?1:0):-(1+(R()*2|0))),2,7);flat(2+(R()*3|0));
      if(R()<.35){const s=c;flat(4);walker(s+2,surf());}
    } else if(p<.47){ // due piattaforme sopra una fossa larga
      const s=c,w=9;pit(w);const pr=ROWS-h-2,pr2=pr-(R()<.5?1:0);
      for(let k=0;k<2;k++){g[pr][s+2+k]='-';g[pr2][s+6+k]='-';}
      coinRow(s+2,2,(pr-1)*T);coinRow(s+6,2,(pr2-1)*T);
      if(R()<.45+i*.08)flyer(s+4,(pr-3)*T,null);
      flat(3);
    } else if(p<.56){ // piattaforma mobile
      const s=c,w=8;pit(w);const pr=ROWS-h-2;
      ents.push({t:'mp',x0:(s+1)*T,x1:(s+5)*T,y:pr*T,sp:.014+i*.002});
      coinRow(s+3,2,(pr-2)*T);flat(3);
    } else if(p<.64){ // pietre di guado
      const s=c,w=8;pit(w);const pr=ROWS-h-2;
      const ww=i<2?2:1;
      for(let k=0;k<ww;k++){g[pr+1][s+2+k]='-';g[pr][s+5+k]='-';}
      ents.push({t:'coin',x:(s+5)*T+4,y:(pr-1)*T+4});
      flat(3);
    } else if(p<.73){ // spuntoni
      const s=c,n=7;flat(n,false);
      const ns=1+(R()<.4+i*.1?1:0)+(i>2&&R()<.4?1:0);
      for(let k=0;k<ns;k++)g[ROWS-h-1][s+2+k]='^';
      ents.push({t:'coin',x:(s+2+(ns>>1))*T+4,y:surf()-3*T+4});
    } else if(p<.81){ // pilastro
      flat(2);const hh=Math.min(9,h+2),n=1+(R()*2|0);for(let k=0;k<n;k++){setCol(c,hh);c++;}
      if(R()<.6)ents.push({t:'coin',x:(c-1)*T+4,y:(ROWS-hh-1)*T+4});
      const s=c;flat(4);if(R()<.5)walker(s+2,surf());
    } else if(p<.92){ // nemici volanti
      const s=c;flat(7);flyer(s+3,surf()-3*T-4,surf());if(i>2&&R()<.5)flyer(s+5,surf()-4*T,surf());
      coinRow(s+1,5,surf()-T);
    } else { // cuore su una sporgenza
      const s=c;flat(5);g[ROWS-h-3][s+2]='-';g[ROWS-h-3][s+3]='-';ents.push({t:'heart',x:(s+2)*T+12,y:(ROWS-h-4)*T+6});
    }
  }
  flat(5,false);
  const A=c;h=3;
  for(let k=0;k<20;k++){setCol(c,3);c++;}
  for(let r=0;r<ROWS;r++)g[r][A+19]='#';
  const cols=c;
  for(let r=0;r<ROWS;r++)for(let k=0;k<cols;k++)if(g[r][k]===undefined)g[r][k]=' ';
  return {g,cols,ents,deco,start,A};
}
