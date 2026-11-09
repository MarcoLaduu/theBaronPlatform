// Sprite dei boss disegnati a mano alla risoluzione del gioco (stile "più toni").
// Ogni funzione restituisce un canvas delle stesse dimensioni dello sprite di prima.
import { darken, lighten, pix } from './pix.js';

const OUT='#0e0810';

// ---------- Pushing l'Esattore: goblin esattore con le monete in mano ----------
function pushing(a={}){
  const p=pix(32,32),{S,R,E}=p,ay=a.arms||0; // a.arms: braccia più su (<0) o più giù (>0); a.legs: 1/2 alza un piede; a.blink; a.mouth
  const ry=i=>Math.round(ay*(1-i/8));
  const g='#6ab040',G1='#a8e070',G2='#3e7a2a',G3='#2a5a1e',gold='#f0c040',gold1='#fff2a0',gold2='#b0801e',
    red='#c8303a',red1='#ff6a6a',red2='#7a1424',br='#7a4a24',br1='#a8744a',br2='#4a2a14';
  // orecchie a punta
  for(let i=0;i<5;i++){R(4+i,11+Math.floor(i/2),2,2-(i>3?1:0),i<2?G1:g);R(26-i,11+Math.floor(i/2),2,2-(i>3?1:0),i<2?g:G2);}
  // braccia alzate con le mani aperte e gli artigli: al momento del lancio solleva il sacchetto
  for(let i=0;i<8;i++){R(6+Math.floor(i/2),10+i+ry(i),2,2,i<3?G1:g);R(24-Math.floor(i/2),10+i+ry(i),2,2,i<3?g:G2);}
  E(5.5,8+ay,2.2,2.2,g,{light:G1,dark:G2});E(26.5,8+ay,2.2,2.2,g,{light:G1,dark:G2});
  for(const [hx,d] of [[5,-1],[26,1]]){S(hx-1,5+ay,G1);S(hx-1,4+ay,'#f4f0e0');S(hx+1,5+ay,g);S(hx+1,4+ay,'#f4f0e0');S(hx+2*d,6+ay,g);S(hx+3*d,5+ay,'#f4f0e0');}
  // testa
  E(16,13,8,6.5,g,{light:G1,dark:G2});
  // fez rosso con nappa d'oro
  R(11,3,10,5,red);R(11,3,3,5,red1);R(18,3,3,5,red2);R(11,3,10,1,red1);R(10,7,12,1,red2);
  R(20,2,1,2,gold2);R(21,3,1,4,gold);S(21,7,gold1);S(22,6,gold2);
  // occhi gialli furbi
  for(const ex of [12,19]){if(a.blink){R(ex,12,2,1,g);R(ex,13,2,1,G3);}else{R(ex,12,2,2,'#ffe040');S(ex+1,13,'#140a0c');S(ex,12,'#ffffff');}R(ex-1,11,4,1,G3);}
  S(10,11,G3);S(22,11,G3);
  // monocolo d'oro con la catenella
  R(18,11,4,4,'#d8c070');if(a.blink){R(19,12,2,1,g);R(19,13,2,1,G3);}else{R(19,12,2,2,'#ffe040');S(20,13,'#140a0c');S(19,12,'#ffffff');}S(22,15,gold);S(22,16,gold);S(22,17,gold2);
  // naso e sorriso con dente d'oro
  S(16,14,G2);S(16,15,G3);
  if(a.mouth){R(11,16,10,4,'#3a1410');for(const tx of [12,14,18,20]){S(tx,16,'#fff8e0');S(tx+1,19,'#fff8e0');}S(16,16,gold);R(14,18,4,1,'#c03030');S(15,17,'#8a2020');}
  else{R(11,16,10,2,'#3a1410');for(const tx of [12,14,18,20])S(tx,16,'#fff8e0');S(16,16,gold);S(15,17,'#8a2020');S(16,17,'#8a2020');}
  // gilet con bottoni e moneta sulla pancia
  R(10,20,12,8,br);R(10,20,3,8,br1);R(19,20,3,8,br2);R(15,20,2,8,'#f4f0e0');S(16,21,'#d0c8b8');
  for(const by of [21,24])S(14,by,gold);
  E(18.5,24,2,2,gold,{light:gold1,dark:gold2});S(18,23,'#ffffff');
  R(10,27,12,1,br2);R(15,27,2,1,gold); // cintura
  // sacchetto di monete appeso alla cintura
  E(23.5,27,2.5,2.5,br,{light:br1,dark:br2});R(22,24,3,1,'#c8a070');S(23,25,gold);
  // gambe e scarpe
  const l1=a.legs===1?1:0,l2=a.legs===2?1:0;
  R(11,28,4,2-l1,g);R(18,28,4,2-l2,G2);R(11,28,1,2-l1,G1);
  R(10,30-l1,6,2,br2);R(17,30-l2,6,2,br2);R(10,30-l1,4,1,br);R(17,30-l2,4,1,br);
  return p.outline(OUT).canvas();
}

// ---------- Gankàla la Strega dei Rovi ----------
function witch(a={}){
  const p=pix(32,32),{S,R,E}=p,sw=a.sway||0,ox=y=>Math.round(sw*Math.max(0,y-21)/10); // a.sway: la veste ondeggia; a.cast: mano alzata che lancia; a.blink
  const pu='#4a2a6a',pu1='#7a5aaa',pu2='#2e1844',gr='#7ab05a',gr1='#b0e090',gr2='#4a7a34',th='#2a6a1a',th1='#4a9a2a',
    hair='#1a1020',ber='#e03040',br='#6a3a1a',br1='#9a6a3a';
  // bastone di rovo
  R(27,8,1,24,br);R(26,8,1,24,br1);for(const y of [12,17,22,27])S(28,y,th1);S(25,14,th1);
  E(27,6,2.5,2.5,th,{light:th1,dark:'#1a4a10'});S(26,5,ber);S(28,7,ber);
  // cappello a punta con la tesa larga
  for(let y=0;y<10;y++){const hw=1+Math.floor(y*0.75),cx=15+Math.max(0,3-y)*0.7;for(let x=Math.round(cx-hw);x<=Math.round(cx+hw);x++){const t=(x-(cx-hw))/(2*hw+.01);S(x,y,t<.3?pu1:t<.75?pu:pu2);}}
  R(4,10,24,2,pu);R(4,10,8,1,pu1);R(20,11,8,1,pu2);R(6,12,20,1,pu2);
  R(9,8,14,2,th);for(const x of [10,13,17,21])S(x,7,th1);S(12,9,ber);S(19,8,ber); // fascia di rovi con bacche
  // capelli lunghi
  R(8,12,3,11,hair);R(21,12,3,11,hair);S(8,23,hair);S(23,23,hair);S(9,12,'#3a2a40');S(22,13,'#3a2a40');
  // viso
  R(11,12,10,7,gr);R(11,12,2,7,gr1);R(19,12,2,7,gr2);R(11,12,10,1,gr2);
  for(const ex of [13,18]){if(a.blink)R(ex,14,2,1,gr2);else{R(ex,14,2,1,a.cast?'#ffffff':'#ffe060');S(ex+1,14,'#3a2a00');}S(ex,13,hair);S(ex+1,13,hair);}
  R(16,15,2,2,gr);S(17,17,gr);S(18,17,gr2);S(16,15,gr1); // naso adunco
  S(13,16,'#4a6a2a'); // porro
  if(a.cast){R(13,18,5,2,'#2a1a20');S(14,18,'#f0e8d0');S(16,19,'#c03040');}else{R(13,18,5,1,'#2a1a20');S(14,18,'#f0e8d0');}
  // veste
  for(let y=19;y<32;y++){const hw=5+Math.floor((y-19)*0.55),x0=16-hw+ox(y),x1=15+hw+ox(y);for(let x=x0;x<=x1;x++){const t=(x-x0)/(x1-x0+.01);S(x,y,t<.25?pu1:t<.72?pu:pu2);}}
  // rovi che avvolgono la veste
  for(let i=0;i<12;i++){S(13+Math.round(Math.sin(i*.7)*3)+ox(20+i),20+i,th);S(14+Math.round(Math.sin(i*.7)*3)+ox(20+i),20+i,th1);}
  for(let i=0;i<8;i++){const y=25+Math.floor(i/2);S(20-i+ox(y),y,th);}
  for(const [x,y] of [[11,23],[17,22],[19,28],[12,29],[22,30]])S(x+ox(y),y,th1);
  S(16+ox(26),26,ber);S(10+ox(30),30,ber);S(21+ox(24),24,ber);
  // mani verdi, una regge il bastone
  if(a.cast){R(7,17,2,5,pu);R(7,17,1,5,pu1);E(7.5,15.5,1.7,1.7,gr,{light:gr1,dark:gr2});S(5,13,'#e0ff90');S(9,12,'#ffffff');S(7,12,'#b0ff70');S(4,15,'#b0ff70');}
  else{E(7.5,25,1.6,1.6,gr,{light:gr1,dark:gr2});R(8,22,2,3,pu);}
  E(25.5,21,1.8,1.8,gr,{light:gr1,dark:gr2});R(22,20,3,2,pu2);
  return p.outline('#100812').canvas();
}

// ---------- Pushatomìdir il Rospo Mannaro ----------
function toad(a={}){
  const p=pix(32,32),{S,R,E}=p,bl=a.belly||0; // a.belly: gola e pancia che si gonfiano; a.blink; a.mouth
  const gr='#6a7a30',gr1='#9aaa50',gr2='#44521e',gr3='#2e3814',cr='#d8d8a0',cr1='#f4f4c8',cr2='#a8a878',
    fur='#5a4020',fur1='#8a6a3a',red='#a02020',red1='#d84040',yel='#ffd030';
  // zampe posteriori
  E(4,27,4,4,gr,{light:gr1,dark:gr2});E(28,27,4,4,gr2,{light:gr,dark:gr3});
  // corpo
  E(16,20,14,10,gr,{light:gr1,dark:gr2});
  E(16,26-bl*.5,10+bl,5+bl,cr,{light:cr1,dark:cr2}); // pancia
  // macchie sulla schiena e ciuffi di pelo da mannaro
  for(const [x,y,r] of [[9,14,1.5],[21,13,1.2],[25,18,1.4],[6,19,1]])E(x,y,r,r,gr2,{light:gr2,dark:gr3});
  for(let i=0;i<9;i++){R(11+i*1.3,8+(i%2),1,3,i%2?fur:fur1);}
  R(3,2,1,3,fur);R(28,2,1,3,fur); // ciuffi sopra gli occhi
  // occhi sporgenti
  for(const ex of [7,25]){E(ex,7,4.2,4.2,gr,{light:gr1,dark:gr2});if(a.blink){R(ex-3,7,7,1,gr3);R(ex-2,8,5,1,gr2);}else{E(ex,7,3,3,yel,{light:'#fff090',dark:'#c09010'});R(ex-2,7,5,1,'#120a04');S(ex-1,6,'#ffffff');S(ex-2,5,'#ffffff');}}
  // bocca larga aperta con le zanne
  if(a.mouth){R(3,15,26,1,gr3);R(4,16,24,6,'#3a0808');R(5,16,22,1,red1);R(4,22,24,1,gr3);R(10,19,12,3,red);R(12,19,8,1,red1);
    for(const fx of [8,23]){S(fx,16,'#ffffff');S(fx,17,'#ffffff');S(fx,18,'#e8e0d0');}}
  else{R(3,16,26,1,gr3);R(4,17,24,2,red);R(5,17,22,1,red1);R(4,19,24,1,gr3);
  for(const fx of [8,23]){S(fx,17,'#ffffff');S(fx,18,'#e8e0d0');}
  S(15,18,'#6a1010');S(16,18,'#6a1010');}
  // zampe anteriori con le dita
  for(const [fx,c] of [[8,gr],[22,gr2]]){R(fx,27,3,3,c);for(let t=0;t<3;t++)R(fx-1+t*2,30,1,2,t===0?gr1:c);}
  return p.outline('#0c0e08').canvas();
}

// ---------- Ser Rekter: armatura vuota da cavaliere ----------
export const REKTER_HEAD_ROWS=15; // righe dello sprite occupate dall'elmo (nella seconda fase si stacca)
function rekter(a={}){
  const p=pix(32,32),{S,R}=p,pw=a.plume||0; // a.plume: il pennacchio ondeggia; a.legs: 1/2 alza un piede; a.eyes: 0 spenti, 2 accesi forte
  const M1='#eef3fb',M2='#b8c0d0',M3='#848a9c',M4='#565a6c',M5='#34364a',
    R1='#ff7a64',R2='#c8283a',R3='#7a1424',G1='#fff2a8',G2='#d8a840',G3='#8a6420',
    CH='#5a5e70',CL='#9aa0b2',SL='#12121a',EY='#ff5030',EYl='#ffd0a0',BR='#5a3418';
  // pennacchio rosso che ricade all'indietro
  [[15,4,4],[13,3,5],[11,2,5],[9,2,5],[7,3,4],[6,4,3],[5,5,3],[5,6,2],[4,7,2]].forEach(([x,y,w])=>{const dy=x<9?pw:0;R(x,y+dy,w,1,R2);S(x,y+dy,R1);S(x+w-1,y+dy,R3);});
  R(9,1,4,1,R1);R(13,2,3,1,R1);S(4,8+pw,R3);S(5,8+pw,R2);if(pw)S(3,9,R3);
  // grande elmo chiuso
  for(let y=5;y<=14;y++){const sh=[M2,M1,M2,M2,M2,M3,M3,M3,M3,M4,M4,M5];const x0=y===5?11:10;for(let i=x0;i<=21-(y===5?1:0);i++)S(i,y,sh[i-10]);}
  R(15,5,1,9,M1);
  R(10,8,12,2,SL);
  const ey=a.eyes??1;if(ey){const c1=ey>1?'#ffe080':EY,c2=ey>1?'#ffffff':EYl;S(17,8,c1);S(18,8,c2);S(20,8,c1);S(21,8,c1);S(17,9,ey>1?EY:'#a02018');S(20,9,ey>1?EY:'#a02018');}else{S(17,8,'#5a1810');S(20,8,'#5a1810');}
  for(const [x,y] of [[17,11],[19,11],[21,11],[18,12],[20,12]])S(x,y,M5);
  S(12,6,'#ffffff');S(11,7,M1);
  R(10,14,12,1,G2);S(10,14,G1);S(11,14,G1);S(21,14,G3);
  // gorgiera
  R(12,15,8,1,M4);R(13,15,3,1,M3);
  // spallacci
  for(const ox of [5,20]){R(ox+1,15,6,1,M2);R(ox,16,7,3,M3);R(ox,16,7,1,M1);R(ox+1,17,5,1,M2);R(ox,19,7,1,G2);S(ox,19,G1);S(ox+6,19,G3);R(ox+1,18,6,1,M4);}
  // corazza e sopravveste rossa con croce d'oro
  R(11,16,10,3,M3);R(11,16,10,1,M2);R(15,16,1,3,M1);
  R(11,18,10,8,R2);R(11,18,2,8,R1);R(19,18,2,8,R3);
  R(11,18,10,1,G2);R(11,25,10,1,G2);S(11,25,G1);S(20,25,G3);
  R(15,19,2,5,G2);R(13,20,6,1,G2);S(15,19,G1);S(13,20,G1);S(16,23,G3);S(18,20,G3);
  R(11,24,10,1,BR);R(15,24,2,1,G1);S(16,24,G2);
  // braccia e guanti
  R(6,20,4,5,M3);R(6,20,1,5,M2);R(9,20,1,5,M4);R(6,22,4,1,M4);
  R(22,20,4,5,M3);R(22,20,1,5,M2);R(25,20,1,5,M4);R(22,22,4,1,M4);
  R(6,25,4,3,M4);R(6,25,4,1,M2);S(9,27,M5);
  R(22,25,4,3,M4);R(22,25,4,1,M2);S(25,27,M5);
  // cotta di maglia, gambali e scarpe di ferro
  for(let y=26;y<=27;y++)for(let x=11;x<=20;x++)S(x,y,(x+y)%2?CH:CL);
  const l1=a.legs===1?1:0,l2=a.legs===2?1:0;
  for(const [ox,l] of [[11,l1],[17,l2]]){R(ox,27-l,4,3,M3);R(ox,27-l,1,3,M2);R(ox+3,27-l,1,3,M4);R(ox,27-l,4,1,M1);S(ox+1,28-l,M2);}
  R(10,30-l1,5,2,M4);R(10,30-l1,5,1,M2);S(14,31-l1,M5);
  R(17,30-l2,6,2,M4);R(17,30-l2,6,1,M2);S(22,31-l2,M5);S(22,30-l2,M3);
  return p.outline('#0a0a10').canvas();
}

// lancia da torneo (rivolta a destra): codolo, rondella a cono, asta a spirale, punta d'acciaio
export const LANCE_GRIP={x:2,y:6}; // punto della lancia che sta nel guanto
function lance(){
  const p=pix(28,14),{S}=p,cy=6;
  for(let a=0;a<3;a++){S(a,cy,'#6a4422');S(a,cy+1,'#4a2e14');}
  [[3,4],[4,4],[5,3],[6,3],[7,2],[8,2],[9,1]].forEach(([a,h])=>{for(let b=cy-h;b<=cy+1+h;b++)S(a,b,b<cy-h+2?'#e8eef8':b>cy+h-1?'#565a6c':'#9aa0b2');});
  S(3,cy-4,'#ffffff');S(4,cy-4,'#ffffff');
  for(let a=10;a<20;a++)for(let b=cy-1;b<=cy+1;b++){const st=((a+b)>>1)%3===0;S(a,b,b===cy-1?(st?'#ff8a7a':'#ffffff'):b===cy+1?(st?'#8a1424':'#b8b0b8'):(st?'#c8283a':'#f0ece8'));}
  [[20,3],[21,3],[22,2],[23,1],[24,1],[25,0]].forEach(([a,h])=>{for(let b=cy-h;b<=cy+h-(h===3?1:0);b++)S(a,b,b<cy?'#ffffff':b===cy?'#d0d6e2':'#7a8090');});
  return p.outline('#0a0a10').canvas();
}

// ---------- Griefilla: pipistrella gigante della torre ----------
function griefilla(a={}){
  const p=pix(32,24),{S,R,E}=p,k=a.flap||0; // a.flap: inclinazione delle ali (<0 su, >0 giù); a.mouth; a.blink
  const d='#3a2440',d1='#5a3a66',d2='#24142c',bone='#7a5a8a',body='#4a2e56',body1='#6e4a7e',body2='#2e1a38',pink='#c86a9a';
  // ali spiegate con il bordo a festoni (la destra è speculare)
  const fy=(x,y)=>Math.round(y+k*(12-x)),wing=(m)=>{const X=x=>m?31-x:x,pts=[[12,6],[7,2],[1,0],[0,5],[1,11],[0,17],[3,15],[5,20],[8,17],[10,20],[12,15]].map(([a,b])=>[X(a)+(m?1:0),y0(a,b)]);
    p.P(pts,(x,y)=>{const t=m?(31-x):x;return y<5+t*.2?d1:(t>8&&y>10)?d2:d;});
    for(const [a,b] of [[1,1],[1,11],[5,19],[10,19]])p.L(X(11),7,X(a),y0(a,b),bone);
    p.L(X(12),6,X(7),y0(7,2),body1);p.L(X(7),y0(7,2),X(1),y0(1,0),body1);};
  const y0=(x,y)=>Math.max(0,Math.min(23,fy(x,y)));
  wing(false);wing(true);
  // orecchie
  for(let i=0;i<5;i++){R(11+Math.floor(i/2),i,3-Math.floor(i/2),1,body);R(19-Math.floor(i/3),i,3,1,body2);}
  S(12,2,pink);S(12,3,pink);S(20,2,pink);S(20,3,pink);
  // corpo peloso
  E(16,12,6,8.5,body,{light:body1,dark:body2});
  E(16,15,3.5,4.5,'#5e3e6a',{light:'#7e5a8a',dark:'#46304e'}); // pancia più chiara
  // occhi rossi e zanne
  for(const ex of [13,18]){if(a.blink)R(ex,9,2,1,body2);else{R(ex,8,2,2,'#ff3050');S(ex,8,'#ffc0c8');}}
  if(a.mouth){R(13,11,6,4,'#1a0a14');S(14,11,'#f0f0f0');S(17,11,'#f0f0f0');S(14,14,'#f0f0f0');S(17,14,'#f0f0f0');R(15,13,2,1,'#c03050');}
  else{R(14,12,4,1,'#1a0a14');S(14,13,'#f0f0f0');S(17,13,'#f0f0f0');}
  // zampette con artigli
  R(13,21,2,2,body2);R(17,21,2,2,body2);S(13,23,'#e0d0e0');S(18,23,'#e0d0e0');
  return p.outline('#0c060e').canvas();
}

// ---------- Anlaucer: il demone ----------
function anlaucer(a={}){
  const p=pix(40,40),{S,R,E}=p,k=a.flap||0,tl=a.tail||0; // a.flap: ali; a.tail: coda che ondeggia; a.mouth; a.blink
  const r='#b0181c',r1='#e84a3a',r2='#6a0a14',wing='#2a0a14',wing1='#4a1424',bone='#6a2030',
    ivory='#e8e0d0',ivory1='#ffffff',ivory2='#a89880',yel='#ffd030',gold='#d8a030';
  // ali dietro, con il bordo a festoni
  const y0=(x,y)=>Math.max(0,Math.min(39,Math.round(y+k*(14-x)))),W=(m)=>{const X=x=>m?39-x:x,pts=[[14,12],[8,6],[1,4],[0,10],[1,18],[0,26],[3,23],[5,30],[8,26],[11,31],[14,26]].map(([a,b])=>[X(a)+(m?1:0),y0(a,b)]);
    p.P(pts,(x,y)=>{const t=m?(39-x):x;return y<8+t*.3?wing1:wing;});
    for(const [a,b] of [[1,5],[1,18],[5,29],[11,30]])p.L(X(13),13,X(a),y0(a,b),bone);
    p.L(X(14),12,X(8),y0(8,6),'#7a2a3a');p.L(X(8),y0(8,6),X(1),y0(1,4),'#7a2a3a');};
  W(false);W(true);
  // coda con punta a picca
  const ty=i=>33-Math.round(Math.sin(i*.45+tl*.5)*3)-Math.round(tl*i/8);for(let i=0;i<9;i++)S(28+i,ty(i),r2);E(36.5,ty(8)-6,1.6,1.6,r,{light:r1,dark:r2});S(37,ty(8)-8,r1);
  // corna ricurve
  for(let i=0;i<9;i++){const c=i<3?ivory2:i<6?ivory:ivory1;R(11-i,8-i*0.9,2,2,c);R(27+i,8-i*0.9,2,2,i<3?ivory2:ivory);}
  S(3,0,ivory1);S(36,0,ivory1);for(const y of [5,3])S(8-(5-y),y,ivory2);
  // testa
  E(20,13,9.5,8,r,{light:r1,dark:r2});
  // sopracciglia e occhi gialli
  for(let i=0;i<5;i++){S(13+i,9+Math.floor(i/2),r2);S(27-i,9+Math.floor(i/2),r2);}
  for(const ex of [15,23]){if(a.blink){R(ex,12,3,1,r2);}else{R(ex,11,3,2,yel);S(ex+(ex<20?2:0),12,'#200404');S(ex+(ex<20?0:2),11,'#fff8c0');}}
  // ghigno a mezzaluna: fila di dentini, due zanne agli angoli e la lingua che si intravede
  const mo=a.mouth?2:0;for(let x=13;x<=27;x++){const t=(x-20)/7,top=15+Math.round(1-t*t),bot=16+Math.round((3+mo)*(1-t*t));for(let y=top;y<=bot;y++)S(x,y,'#2a0408');if(x%2===0&&x>13&&x<27)S(x,top,ivory);}
  for(let x=18;x<=22;x++)S(x,18+mo+(x===18||x===22?0:1),'#e04a5a');S(20,18+mo,'#a02030');
  for(const fx of [15,25]){S(fx,16,ivory1);S(fx,17,ivory);S(fx,18,ivory2);}
  // collare d'oro e busto
  E(20,28,9,7.5,r,{light:r1,dark:r2});
  R(14,21,13,1,gold);S(14,21,'#fff0a0');S(20,22,gold);S(20,23,'#ffe060');
  R(19,25,1,7,r2);R(16,27,3,1,r2);R(21,27,3,1,r2);R(16,30,3,1,r2);R(21,30,3,1,r2); // muscoli
  // braccia con artigli
  R(9,23,3,9,r);R(9,23,1,9,r1);R(28,23,3,9,r2);R(28,23,1,9,r);
  for(const hx of [9,28])for(let t=0;t<3;t++)R(hx+t,32,1,2,ivory);
  // gambe e zoccoli
  R(14,34,5,3,r);R(14,34,2,3,r1);R(21,34,5,3,r2);R(21,34,1,3,r);
  R(13,37,6,3,'#2a1014');R(21,37,6,3,'#2a1014');R(13,37,6,1,'#5a3036');R(21,37,6,1,'#5a3036');
  return p.outline('#0a0204').canvas();
}

export const BOSS_ART=[pushing,witch,toad,rekter,griefilla,anlaucer];
export const LANCE=lance;
