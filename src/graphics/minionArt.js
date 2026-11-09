// Scagnozzi disegnati a mano con più dettagli, alla stessa grandezza di prima.
// Ogni funzione riceve il fotogramma (0 o 1) e restituisce un canvas.
import { pix } from './pix.js';
import { sprite } from '../utils.js';

const W='#f4f0e0';

// goblin e lanciatore (cambia solo il colore del berretto e cosa porta)
function goblinBase(f,cap,thrower){
  const p=pix(12,12),{S,R}=p,[r,r1,r2]=cap;
  const g='#6ab040',g1='#a8e070',g2='#3e7a2a',b='#7a4a24',b1='#a8744a',b2='#4a2a14';
  R(4,0,4,1,r1);R(3,1,6,1,r);S(3,1,r1);S(8,1,r2);S(9,0,W); // berretto con pon pon
  R(3,2,6,4,g);R(3,2,2,3,g1);R(7,3,2,3,g2);S(1,2,g1);S(2,3,g);S(10,2,g2);S(9,3,g); // testa e orecchie
  S(4,3,'#ffe040');S(7,3,'#ffe040');S(5,3,'#140a0c');S(8,3,'#140a0c');
  S(6,4,g2);R(4,5,4,1,'#3a1410');S(5,5,W);S(7,5,W); // naso e ghigno
  R(3,6,6,3,b);S(3,6,b1);S(3,7,b1);R(8,6,1,3,b2);S(5,7,'#e8b84a');R(3,8,6,1,b2);S(6,8,'#e8b84a');
  S(2,6,g1);S(2,7,g);S(9,6,g2);S(9,7,g2);
  if(thrower&&f===2){S(9,6,g2);S(10,5,g2);S(10,4,g);R(9,1,3,3,'#8a8a9a');S(9,1,'#c8c8d0');S(10,1,'#c8c8d0');R(10,3,2,1,'#5a5a6a');} // fotogramma 2: sasso alzato sopra la testa
  else if(thrower){S(10,5,'#8a8a9a');S(10,4,'#c8c8d0');S(11,5,'#5a5a6a');} // sasso in mano
  if(f!==1){R(3,9,2,2,g);R(7,9,2,2,g2);R(2,11,3,1,b2);R(7,11,3,1,b2);}
  else{R(2,9,2,2,g);R(8,9,2,2,g2);R(1,11,3,1,b2);R(8,11,3,1,b2);}
  return p.outline('#140a0c').canvas();
}
export const goblin=f=>goblinBase(f,['#c8303a','#ff6a6a','#7a1424'],false);
export const thrower=f=>goblinBase(f,['#3a5ac8','#7a9aff','#1a2a7a'],true);

// rovo che cammina: cespuglio spinoso con bacche
export function bramble(f){
  const p=pix(12,10),{S,R}=p;
  const t='#2a5a1a',T='#4a8a2a',L='#7ac04a',D='#1e4210',s='#e8dcb0';
  R(1,2,9,6,T);R(2,1,7,1,T);R(1,2,4,2,L);S(2,1,L);R(7,5,3,3,t);R(2,7,7,1,D);
  for(const [x,y] of [[3,3],[6,2],[8,4],[2,5],[5,6]])S(x,y,t); // foglie scure
  for(const [x,y] of [[2,0],[5,0],[8,0],[0,3],[10,3],[0,6],[10,6]])S(x,y,s); // spine
  S(3,4,'#ffe060');S(7,4,'#ffe060');S(3,4,'#ffe060');S(4,4,'#140a04');S(8,4,'#140a04'); // occhi
  S(5,3,'#e03040');S(9,6,'#e03040');S(2,6,'#ff6070'); // bacche
  if(f===0){R(3,8,1,2,D);R(7,8,1,2,D);S(2,9,D);S(8,9,D);}else{R(2,8,1,2,D);R(8,8,1,2,D);S(1,9,D);S(9,9,D);}
  return p.outline('#0e1a08').canvas();
}

// streghetta sulla scopa
export function witch(f=0){
  const p=pix(12,11),{S,R}=p;
  const pu='#4a2a6a',pu1='#7a5aaa',pu2='#2e1844',gr='#7ab05a',gr1='#b0e090';
  S(4,0,pu);R(3,1,3,1,pu);S(3,1,pu1);R(2,2,4,1,pu);S(2,2,pu1);R(1,3,7,1,pu2);S(4,2,'#e8b84a'); // cappello con fibbia
  R(3,4,3,2,gr);S(3,4,gr1);S(4,4,'#ffe060');S(6,5,gr);S(5,5,'#4a7a34'); // viso e naso
  R(2,6,5,2,pu);S(2,6,pu1);R(6,6,1,2,pu2);S(1,7,gr); // veste
  R(0,8,9,1,'#a87444');R(0,8,3,1,'#c8946a');S(8,8,'#6a3a1a'); // manico della scopa
  R(9,7,3,3,'#e8c048');S(9,7,'#fff0a0');S(11,9,'#a87a20');R(10,8,1,1,'#c89a30'); // saggina
  if(f){S(11,7,'#a87a20');S(9,9,'#fff0a0');S(3,10,pu2);R(3,9,3,1,pu);}else R(3,9,3,1,pu2); // la saggina e la veste si muovono
  if(f)S(8,0,'#ffffff');else{S(7,1,'#fff0a0');S(8,0,'#fff0a0');} // scintilla
  return p.outline('#120812').canvas();
}

// rospetto
export function toadlet(f=0){
  const p=pix(12,9),{S,R}=p;
  const g='#6a7a30',g1='#9aaa50',g2='#44521e',l='#c8c890',l1='#e8e8b8';
  R(0,1,3,2,g);R(7,1,3,2,g);if(f===1){R(0,2,3,1,'#44521e');R(7,2,3,1,'#44521e');}else{S(1,1,'#ffd030');S(8,1,'#ffd030');S(1,2,'#140a04');S(8,2,'#140a04');S(0,1,'#fff8c0');S(7,1,'#fff8c0');} // occhi (fotogramma 1: chiusi)
  R(0,3,11,4,g);R(0,3,4,1,g1);S(1,4,g1);R(9,3,2,4,g2);S(4,3,g2);S(6,3,g2); // corpo con macchie
  R(1,4,9,1,'#2e3814');S(5,4,'#a02020'); // bocca
  R(2,5,7,2,l);R(2,5,3,1,l1);R(8,5,1,2,'#a8a878'); // pancia
  R(0,7,3,1,g);R(8,7,3,1,g2);S(0,8,g1);S(2,8,g);S(8,8,g2);S(10,8,g2); // zampe
  return p.outline('#0e100a').canvas();
}

// zanzara (due fotogrammi: ali alzate e abbassate)
export function mosquito(f){
  const p=pix(10,7),{S,R}=p;
  const wing='#c8e0f0',wing1='#ffffff',d='#6a4a2a',d1='#9a7a4a',d2='#3a2414';
  if(f===0){R(1,0,2,1,wing);R(4,0,2,1,wing);S(1,0,wing1);S(4,0,wing1);R(0,1,3,1,wing);R(4,1,3,1,wing);}
  else{R(0,5,2,1,wing);R(6,5,2,1,wing);S(0,5,wing1);}
  R(1,2,6,3,d);R(1,2,6,1,d1);S(3,3,d2);S(5,3,d2);R(1,4,6,1,d2); // corpo a strisce
  S(2,3,'#ff3030');S(2,2,'#ffa0a0'); // occhio
  R(7,3,3,1,d2);S(9,3,'#2a1a10'); // pungiglione
  if(f===0){S(2,5,d2);S(4,6,d2);S(6,5,d2);}else{S(3,6,d2);S(5,6,d2);}
  return p.outline('#14100a').canvas();
}

// armatura posseduta (piccolo soldato di Ser Rekter)
export function soldier(f){
  const p=pix(12,13),{S,R}=p;
  const m='#848a9c',m1='#c8d0e0',m2='#565a6c',rd='#c8283a';
  S(6,0,'#ff7a64');S(7,0,rd);S(7,1,rd);
  R(4,1,4,4,m);R(4,1,1,4,m1);R(7,1,1,4,m2);R(4,2,4,1,'#12121a');S(6,2,'#ff5030');S(7,2,'#ff5030');
  R(3,5,6,1,'#d8a840');
  R(3,6,6,4,rd);R(3,6,1,4,'#ff7a64');R(8,6,1,4,'#7a1424');R(5,6,2,3,'#d8a840');S(5,6,'#fff2a8');
  R(1,6,2,3,m);S(1,6,m1);R(9,6,2,3,m2);R(3,9,6,1,'#5a3418');
  if(f===0){R(4,10,2,2,m);R(7,10,2,2,m2);S(4,10,m1);R(3,12,3,1,m2);R(7,12,3,1,m2);}
  else{R(3,10,2,2,m);R(8,10,2,2,m2);S(3,10,m1);R(2,12,3,1,m2);R(8,12,3,1,m2);}
  return p.outline('#0a0a10').canvas();
}

// elmo volante (lo stesso della seconda fase di Ser Rekter, in piccolo)
export function helmet(f=0){
  const p=pix(12,9),{S,R}=p;
  const m='#848a9c',m1='#c8d0e0',m2='#565a6c';
  if(f){R(3,0,3,1,'#ff7a64');R(4,1,4,1,'#c8283a');S(8,1,'#7a1424');S(2,1,'#7a1424');}else{R(4,0,3,1,'#ff7a64');R(5,1,3,1,'#c8283a');S(8,1,'#7a1424');} // pennacchio che sventola
  R(2,2,8,6,m);R(2,2,2,6,m1);R(8,2,2,6,m2);R(5,2,1,6,m1);S(3,2,'#ffffff');
  R(2,4,8,1,'#12121a');S(6,4,f?'#ffd080':'#ff5030');S(8,4,f?'#ffd080':'#ff5030'); // feritoia con occhi accesi
  S(7,6,m2);S(8,6,m2);R(2,7,8,1,'#d8a840');S(2,7,'#fff2a8');
  return p.outline('#0a0a10').canvas();
}

// pipistrello (due fotogrammi: ali alzate e abbassate)
export function bat(f){
  const p=pix(14,8),{S,R,L}=p;
  const d='#3a2440',d1='#5e3e6a',bn='#7a5a8a';
  if(f===0){p.P([[5,2],[2,0],[0,1],[0,5],[2,4],[3,6],[5,4]],(x,y)=>y<2?d1:d);p.P([[9,2],[12,0],[14,1],[14,5],[12,4],[11,6],[9,4]],(x,y)=>y<2?d1:d);L(5,2,1,1,bn);L(9,2,12,1,bn);S(2,3,bn);S(11,3,bn);}
  else{p.P([[5,3],[2,4],[0,6],[2,6],[3,7],[5,6]],d);p.P([[9,3],[12,4],[14,6],[12,6],[11,7],[9,6]],d);L(5,3,1,6,bn);L(9,3,13,6,bn);}
  R(5,2,4,5,'#4a2e56');R(5,2,1,4,'#6e4a7e');S(5,1,'#4a2e56');S(8,1,'#4a2e56');S(5,1,'#c86a9a');
  S(6,3,'#ff3050');S(7,3,'#ff3050');S(6,5,'#f0f0f0');S(7,5,'#f0f0f0');
  return p.outline('#0c060e').canvas();
}

// gargoyle di pietra: accovacciato, con le ali chiuse che spuntano dietro le spalle
const GA_PAL={k:'#0e0e14',L:'#d8d8e6',s:'#a8a8b8',m:'#7a7a8c',d:'#50505e',D:'#36363f',e:'#ff3050',E:'#ffa0b0',w:'#ffffff',h:'#e0d6c0'};
const GA0=["kk........kk","kdk.k..k.kDk","kmdkhkkhkdDk","kmkLssmmmkDk","kmkseEseDkDk","kdksmmmmDkDk",".kkmwDDwmkk.",".kLsmmmmmDk.","kLkLmsmmDkDk","k.kmmk.kmDk.",".kkLmk.kmDk."];
const GA1=GA0.slice(0,9).concat(["k.kmmk.kmDkk","..kLmk.kmDk."]);
export const gargoyle=f=>sprite(f?GA1:GA0,GA_PAL);

// teschio infuocato (due fotogrammi: le fiamme si muovono)
export function skull(f){
  const p=pix(10,11),{S,R}=p;
  const w='#e8e0d0',w1='#ffffff',w2='#a89a88';
  if(f===0){S(2,0,'#ff6020');S(5,0,'#ffd060');S(7,0,'#ff6020');R(1,1,8,1,'#ff6020');S(3,1,'#ffd060');S(6,1,'#ffd060');}
  else{S(1,0,'#ff6020');S(4,0,'#ffd060');S(8,0,'#ff6020');R(1,1,8,1,'#ff6020');S(2,1,'#ffd060');S(7,1,'#ffd060');}
  R(2,2,6,5,w);R(1,3,8,3,w);R(2,2,2,1,w1);S(1,3,w1);R(8,3,1,3,w2);R(3,6,4,1,w2);
  R(2,4,2,2,'#1a0408');R(6,4,2,2,'#1a0408');S(3,4,'#ff5030');S(6,4,'#ff5030');
  S(5,5,'#1a0408');S(4,2,w2);S(4,3,w2);
  R(3,7,4,2,w);S(3,8,'#1a0408');S(5,8,'#1a0408');R(3,9,4,1,w2);
  return p.outline('#1a0408').canvas();
}

// diavoletto evocato
export function imp(f){
  const p=pix(12,12),{S,R}=p;
  const r='#c42c38',r1='#ff6a5a',r2='#7a1420';
  S(2,0,'#e8e0d0');S(9,0,'#e8e0d0');S(2,1,'#a89880');S(9,1,'#a89880'); // cornetti
  R(2,2,8,6,r);R(2,2,3,2,r1);S(2,4,r1);R(8,3,2,5,r2);R(3,7,6,1,r2);
  R(3,3,2,2,'#ffd84a');R(7,3,2,2,'#ffd84a');S(4,4,'#14060a');S(8,4,'#14060a');S(3,3,'#ffffff');S(7,3,'#ffffff');R(3,2,2,1,r2);R(7,2,2,1,r2);
  R(3,6,6,1,'#3a0a10');S(4,6,W);S(5,5,r2);S(7,6,W); // ghigno con zanne
  R(3,8,6,2,r);S(3,8,r1);R(8,8,1,2,r2);S(10,7,r2);S(11,6,r2);S(11,5,r1);S(10,5,r1); // corpo e coda a picca
  S(1,8,r1);S(10,8,r2); // braccini
  if(f===0){R(3,10,2,2,r);R(7,10,2,2,r2);}else{R(2,10,2,2,r);R(8,10,2,2,r2);}
  return p.outline('#14060a').canvas();
}

export const MINION_ART={goblin,thrower,bramble,witch,toadlet,mosquito,soldier,helmet,bat,gargoyle,skull,imp};
