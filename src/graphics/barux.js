// Sprite del Barone Barux.
import { flip, sprite } from '../utils.js';

// più toni: luce dall'alto a sinistra, ombre in basso a destra
const PAL_B={k:'#1a1020',p:'#2a1838',P:'#6a4a8a',q:'#b098d8',Q:'#b04458',H:'#86283a',h:'#5c1626',d:'#3a0c18',
 y:'#fff0a0',g:'#e8b84a',G:'#a8781e',e:'#2fb06a',r:'#d8344a',
 n:'#fbdcc0',s:'#eab894',S:'#c48a70',b:'#2a1a14',B:'#5a3a24',w:'#eef9ff',W:'#8aaed0',
 j:'#5a1424',J:'#7c2236',K:'#a8404e',v:'#d8a838',l:'#f2ecdc',t:'#3a0e1a',T:'#5e1e32',o:'#0c0a0c',O:'#4a4450'};
const B_TOP=[
"...pPq..........",
"...pPPqp........",
"....kPQHhhk.....",
"....kygggGk.....",
"....kgegrGk.....",
"....kQhghdk.....",
"....kQHhhdk.....",
"....kygggGk.....",
"..kkQHhhhhdkk...",
"....kbnsssSk....",
"...kkwWkkwWk....",
"....knsssSSk....",
"....kbBsBbbk....",
"....kbBbBbbk....",
".....kbBbbk.....",
"...kjKlllJjk....",
"..kjKgvlvgJjk...",
"..kjKyvGvgJjk...",
"..knjgvGvgjSk...",
"...kjgvvvgjk....",
"...kjjTttjjk...."];
const LEGS={
 idle:["....kTt.Ttk.....","....kTt.Ttk.....","...kOo..Ook....."],
 run1:["....kTt.Ttk.....","...kTt...Ttk....","..kOo.....Ook..."],
 run2:["....kTttTk......",".....kTtk.......",".....kOook......"],
 jump:["...kTtk.Ttk.....","..kOo...kOok....","................"]};
// ---- fotogrammi delle animazioni, ricavati dallo sprite base spostando le righe ----
const pad=r=>r.padEnd(16,'.').slice(0,16);
const sh=(r,d)=>{r=pad(r);return d>0?('.'.repeat(d)+r).slice(0,16):(r.slice(-d)+'.'.repeat(-d));};
const shAll=(rows,d)=>rows.map(r=>sh(r,d));
const set=(r,x,ch)=>{r=pad(r);return r.slice(0,x)+ch+r.slice(x+1);};
const E='................';
const HEAD=B_TOP.slice(0,15),COAT=B_TOP.slice(15);           // testa (cappello, viso, barba) e giacca
const EYES_CLOSED="...kkbbkkbbk....",EYES_WIDE="...kkwwkkwwk....";
const TAIL="..kjjjTttjjk....",FLARE="..kjjjTttjjjk...";             // falda della giacca che svolazza
const withRow=(rows,i,r)=>rows.map((x,j)=>j===i?r:x);
const F={
  idle:  [...HEAD,...COAT,...LEGS.idle],
  // respiro: testa e cappello giù di un pixel, la piuma ondeggia
  breath:[E,...withRow(withRow(HEAD,0,sh(HEAD[0],1)),1,sh(HEAD[1],1)),...COAT.slice(0,4),COAT[5],...LEGS.idle],
  blink: [...withRow(HEAD,10,EYES_CLOSED),...COAT,...LEGS.idle],
  // corsa a 4 tempi: appoggio, passaggio, appoggio, passaggio
  run1:  [...HEAD,...COAT.slice(0,5),TAIL,...LEGS.run1],
  run2:  [...HEAD,...COAT.slice(0,5),TAIL,...LEGS.run2],
  run3:  [...HEAD,...COAT.slice(0,5),TAIL,"....kTt.Ttk.....","..kTt....kTk....",".kOo......kOok.."],
  run4:  [...HEAD,...COAT.slice(0,5),TAIL,".....kTttTk.....","......kTtk......","......kOok......"],
  // salto: in salita gambe raccolte e piuma schiacciata dal vento, in discesa gambe giù e giacca aperta
  rise:  [E,"..pPPPqp........",...HEAD.slice(2),...COAT,...LEGS.jump],
  fall:  ["...pPq...q......","...pPPqpq.......",...HEAD.slice(2),...COAT.slice(0,5),FLARE,"....kTt.Ttk.....","...kTt...Ttk....","...kOo...Ook...."],
  // atterraggio: si schiaccia, cappello compresso e ginocchia piegate
  land:  [E,E,...HEAD.slice(0,6),...HEAD.slice(7),...COAT.slice(0,5),FLARE,"...kTt..Ttk.....","..kOo....Ook...."],
  // bastonata a terra: si sbilancia in avanti
  lean:  [...shAll(HEAD,1),...COAT,...LEGS.run1],
  // colpito: si piega all'indietro, cappello che salta, occhi spalancati e bocca aperta
  hurt:  [...shAll([...HEAD.slice(1,9),E,HEAD[9],EYES_WIDE,HEAD[11],set(HEAD[12],7,'k'),HEAD[13],HEAD[14]],-1),...COAT,"....kTt.Ttk.....","...kTt..kTtk....","..kOo...kOok...."],
  // sconfitto: senza cappello (vola via a parte), occhi chiusi
  dead:  [E,E,E,E,E,E,E,".....kkkkkk.....","....knsssSSk....",HEAD[9],EYES_CLOSED,HEAD[11],set(HEAD[12],7,'k'),HEAD[13],HEAD[14],...COAT.slice(0,5),FLARE,...LEGS.jump],
};
  // saluto del menu: si toglie il cilindro (il cappello si disegna a parte, sollevato)
F.greet=[E,E,E,E,E,E,E,".....kkkkkk.....","....knsssSSk....",...HEAD.slice(9),...COAT,...LEGS.idle];
F.jump=F.rise;
export const BAR={};
for(const k in F){const c=sprite(F[k].map(pad),PAL_B);BAR[k]=[c,flip(c)];}
// il cappello da solo, per quando vola via
const hatC=sprite(HEAD.slice(0,9).map(pad),PAL_B);export const HAT=[hatC,flip(hatC)];
