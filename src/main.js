import './style.css';
import ohmUrl from './assets/danno_barone.mp3';

(()=>{
'use strict';
const W=320,H=180,T=16,ROWS=14,S=4;
const scr=document.getElementById('screen'); scr.width=W*S; scr.height=H*S;
const out=scr.getContext('2d'); out.imageSmoothingEnabled=false;
const buf=document.createElement('canvas'); buf.width=W; buf.height=H;
const ctx=buf.getContext('2d'); ctx.imageSmoothingEnabled=false;

// ---------- utilità ----------
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
function mk(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');fn(x);return c;}
function sprite(rows,pal,sc=1){
  const w=Math.max(...rows.map(r=>r.length)),h=rows.length;
  return mk(w*sc,h*sc,x=>{rows.forEach((r,j)=>{for(let i=0;i<w;i++){const ch=r[i]||'.';const col=pal[ch];if(!col)continue;x.fillStyle=col;x.fillRect(i*sc,j*sc,sc,sc);}});});
}
function flip(c){return mk(c.width,c.height,x=>{x.translate(c.width,0);x.scale(-1,1);x.drawImage(c,0,0);});}
function white(c){return mk(c.width,c.height,x=>{x.drawImage(c,0,0);x.globalCompositeOperation='source-in';x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);});}
function px(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);}

// ---------- sprite: il Barone Barux ----------
const PAL_B={k:'#1a1020',h:'#5c1626',H:'#86283a',g:'#e8b84a',G:'#a8781e',e:'#2fb06a',r:'#d8344a',p:'#2a1838',P:'#6a4a8a',s:'#eab894',b:'#2a1a14',w:'#dff4ff',j:'#5a1424',J:'#7c2236',v:'#d8a838',l:'#f2ecdc',t:'#3a0e1a',o:'#0c0a0c'};
const B_TOP=[
"...pPp..........",
"...pPPPp........",
"....kPhhhhk.....",
"....khgggHk.....",
"....kgegrGk.....",
"....khhghHk.....",
"....khhhhHk.....",
"....kggggGk.....",
"..kkhhhhhhhkk...",
"....kbsssssk....",
"...kkwwkkwwk....",
"....kssssssk....",
"....kbbsbbbk....",
"....kbbbbbbk....",
".....kbbbbk.....",
"...kjJlllJjk....",
"..kjJgvlvgJjk...",
"..kjJgvGvgJjk...",
"..ksjgvGvgjsk...",
"...kjgvvvgjk....",
"...kjjtttjjk...."];
const LEGS={
 idle:["....ktt.ttk.....","....ktt.ttk.....","...koo..ook....."],
 run1:["....ktt.ttk.....","...ktt...ttk....","..koo.....ook..."],
 run2:["....kttttk......",".....kttk.......",".....koook......"],
 jump:["...kttk.ttk.....","..koo...kook....","................"]};
const BAR={};
for(const k in LEGS){const c=sprite(B_TOP.concat(LEGS[k]),PAL_B);BAR[k]=[c,flip(c)];}

// ---------- nemici e oggetti ----------
const IMP_PAL={k:'#14060a',R:'#c42c38',y:'#ffd84a',w:'#ffffff'};
const IMP_A=["..k......k..",".kRk....kRk.",".kRRkkkkRRk.","kRRRRRRRRRRk","kRyyRRRRyyRk","kRykRRRRykRk","kRRRRRRRRRRk",".kRwkwwkwRk.",".kRRRRRRRRk.","..kRRRRRRk.."];
const IMP=[sprite(IMP_A.concat(["..kRk..kRk..","..kkk..kkk.."]),IMP_PAL),sprite(IMP_A.concat([".kRk....kRk.",".kkk....kkk."]),IMP_PAL)];
const FLY_PAL={k:'#120818',p:'#7a4a9a',w:'#f0e8e0',r:'#d02040'};
const FLY=sprite(["kk..........kk","kpk..kkkk..kpk","kppkkwwwwkkppk","kpppkwwrrwkppk","kppkwwrkrwwkpk","kpk.kwwwwwk.kk","kk...kwwwk....","......kkk....."],FLY_PAL);
// ---------- scagnozzi minori, ispirati ai boss ----------
const GOB_A=["...kkkkkk...","..krrrrrrk..",".kkrrrrrrkk.","kgkggggggkgk",".kgykggykgk.","..kggwwggk..","...kggggk...","..kbbbbbbk..",".kgbbGbbbgk.","..kbbbbbbk.."];
const GOB_P={k:'#140a0c',g:'#6ab040',G:'#e8b84a',y:'#ffe040',r:'#c8303a',b:'#7a4a24',w:'#f4f0e0'};
const BR_A=["..s..s..s...",".ktkktkktk..","kTTtTTtTTtk.","stTyTTTyTts.","kTTkTTTkTTk.","sTTTTTTTTTs.","kTtTTtTTtTk.",".kTTTTTTTk.."];
const SO_A=["....kkkk....","...kmmmmk...","...kMmmmk...","...kkkkkk...","...kekkek...","...kmmmmk...","..kmmmmmmk..",".kmkmGmmkmk.",".kmkmmmmkmk.","..kkmmmmkk..","...kmkkmk..."];
const GA_A=["k..........k","kk.kkkkkk.kk","ksksSSSSsksk","kssseSSesssk",".ksSSSSSSsk.","..ksswwssk..",".kssssssssk.","kskssSSssksk","ks.kssssk.sk"];
const SK_B=["..kwwwwwk.",".kwwwwwwwk",".kwkkwkkwk",".kwkkwkkwk",".kwwwkwwwk","..kwwwwwk.","..kwkwkwk.","...kkkkk.."];
const RK_P={k:'#0a0a10',m:'#7a8090',M:'#b0b8c8',r:'#c02030',e:'#ff4030',G:'#d0a040'};
const KDEF={
 goblin:{maps:[GOB_A.concat(["..kgk..kgk..","..kkk..kkk.."]),GOB_A.concat([".kgk....kgk.",".kkk....kkk."])],pal:GOB_P,w:10,h:12,ai:'walk',spd:.6,hp:1,col:'#6ab040'},
 thrower:{maps:[GOB_A.concat(["..kgk..kgk..","..kkk..kkk.."])],pal:Object.assign({},GOB_P,{r:'#3a5ac8'}),w:10,h:12,ai:'throw',hp:1,col:'#6ab040'},
 bramble:{maps:[BR_A.concat(["..kTk.kTk...","..kkk.kkk..."]),BR_A.concat([".kTk...kTk..",".kkk...kkk.."])],pal:{k:'#0e1a08',t:'#2a5a1a',T:'#4a8a2a',s:'#e8dcb0',y:'#ffe060'},w:10,h:10,ai:'walk',spd:.45,hp:1,spiky:1,col:'#4a8a2a'},
 witch:{maps:[["....kk......","...kppk.....","..kpPppk....",".kkkkkkkk...","...kgygk....","...kgggk....","..kppppk....",".kgpPpppk...","bbbbbbbbbkyy","..kpppk..kyy","...kk......."]],pal:{k:'#120812',p:'#4a2a6a',P:'#6a4a9a',g:'#7ab05a',y:'#ffe060',b:'#7a4a24'},w:10,h:10,ai:'caster',fly:1,fx:.02,ax:36,ay:6,hp:1,col:'#6a4a9a'},
 toadlet:{maps:[[".kk....kk...","kyyk..kyyk..","kykkkkkkyk..","kgggGggggk..","kgkkkkkkgk..","kglllllllgk.",".kgllllllgk.","kgkggggggkgk","kk.kkkkkk.kk"]],pal:{k:'#0e100a',g:'#6a7a30',G:'#8a9a40',y:'#ffd030',l:'#c8c890'},w:10,h:9,ai:'hop',hp:1,col:'#6a7a30'},
 mosquito:{maps:[[".aa..aa...","aaaaaaaa..",".kaakaak..","kddddddk..","kdrddddkkk",".kdddddk..","..k.k.k..."],["..........","..........",".kkkkkkk..","kddddddk..","kdrddddkkk","akdddddka.","aak.k.kaa."]],pal:{k:'#14100a',a:'#c8e0f0',d:'#6a4a2a',r:'#ff3030'},w:8,h:6,ai:'sine',fly:1,fx:.045,ax:34,ay:12,hp:1,col:'#6a4a2a'},
 soldier:{maps:[SO_A.concat(["...kmk.kmk..","..kkkk.kkkk."]),SO_A.concat(["..kmk..kmk..",".kkkk..kkkk."])],pal:RK_P,w:10,h:13,ai:'charge',hp:2,col:'#b0b8c8'},
 helmet:{maps:[["....rrr.....","...krrrk....","..kmmmmmk...",".kmMmmmmmk..",".kkkkkkkkk..",".kmeekeemk..",".kkkkkkkkk..","..kmmmmmk...","...kkkkk...."]],pal:RK_P,w:9,h:9,ai:'sine',fly:1,fx:.025,ax:30,ay:7,hp:2,col:'#b0b8c8'},
 bat:{maps:[["k............k","kk..k....k..kk","kdk.kkkkkk.kdk","kddkkdeedkkddk","kdddkddddkdddk","kk.kkdwwdkk.kk","k....kkkk....k"],["..............","....k....k....","....kkkkkk....","..kkkdeedkkk..","kkddkddddkddkk","kdddkdwwdkdddk","kdk..kkkk..kdk"]],pal:{k:'#0c060e',d:'#3a2440',e:'#ff3050',w:'#f0f0f0'},w:12,h:6,ai:'dive',fly:1,hp:1,col:'#5a3a66'},
 gargoyle:{maps:[GA_A.concat(["...ksk.ksk..","...kkk.kkk.."]),GA_A.concat(["..ksk...ksk.","..kkk...kkk."])],pal:{k:'#0e0e14',s:'#5a5a6a',S:'#8a8a9a',e:'#ff3050',w:'#e0e0e0'},w:10,h:11,ai:'walk',spd:.35,hp:2,col:'#8a8a9a'},
 skull:{maps:[["..f..y..f.",".fyf.fyfy."].concat(SK_B),[".f..y..f..","fyf.yfyf.."].concat(SK_B)],pal:{k:'#1a0408',w:'#e8e0d0',f:'#ff6020',y:'#ffd060'},w:9,h:10,ai:'dive',fly:1,hp:1,col:'#ff6020'}
};
const KINDS={};
for(const k in KDEF){const d=KDEF[k],fr=d.maps.map(m=>sprite(m,d.pal));KINDS[k]=Object.assign({},d,{fr,frL:fr.map(flip)});}
KINDS.imp={fr:IMP,frL:IMP,w:10,h:12,ai:'walk',spd:.55,hp:1,col:'#c42c38'};
const LVL_EN=[
 {w:['goblin','goblin','thrower'],f:['thrower']},
 {w:['bramble','bramble','goblin'],f:['witch']},
 {w:['toadlet'],f:['mosquito']},
 {w:['soldier','soldier','toadlet'],f:['helmet']},
 {w:['gargoyle','soldier'],f:['bat']},
 {w:['imp','imp','gargoyle'],f:['skull','bat']}];
const COIN=sprite(["..kkkk..",".kgggGk.","kgllggGk","kglgggGk","kgggggGk","kgggGGGk",".kGGGGk.","..kkkk.."],{k:'#5a3a08',g:'#f0c040',G:'#b8861a',l:'#fff2b0'});
const HEART_ROWS=[".kk.kk.","krrkrrk","krlrrrk","krrrrrk",".krrrk.","..krk..","...k..."];
const HEART=sprite(HEART_ROWS,{k:'#3a0a10',r:'#e03040',l:'#ff9aa8'});
const HEART_E=sprite(HEART_ROWS,{k:'#1a1014',r:'#4a3a40',l:'#5a4a50'});

// ---------- boss ----------
const BOSS_DEF=[
 {name:'Pushing l’Esattore',sub:'Primo scagnozzo di Anlaucer',fem:false,hp:6,w:28,h:28,
  pal:{k:'#140a0c',g:'#6ab040',G:'#3e7a2a',y:'#ffe040',r:'#c8303a',b:'#7a4a24',w:'#f4f0e0'},
  map:["................",".....kkkkkk.....","....krrrrrrk....",".k..krrrrrrk..k.","kgk.kggggggk.kgk",".kgkgyggggygkgk.","..kggkggggkggk..","...kggwwwwggk...","....kggggggk....","...kbbbbbbbbk...","..kgbbGbbGbbgk..","..kgbbbbbbbbgk..","...kbbbbbbbbk...","....kgk..kgk....","....kgk..kgk....","...kkkk..kkkk..."]},
 {name:'Gankàla la Strega dei Rovi',sub:'Secondo scagnozzo di Anlaucer',fem:true,hp:7,w:26,h:28,
  pal:{k:'#120812',p:'#4a2a6a',P:'#6a4a9a',g:'#7ab05a',y:'#ffe060',t:'#2a6a1a'},
  map:[".......kk.......","......kppk......",".....kpppk......",".....kpPppk.....","....kppppppk....","..kkkkkkkkkkkk..","....kgggggk.....","....kgyggyk.....","....kggkggk.....","...kpkgggkpk....","..kpppkkkpppk...","..kpPpptppPpk...",".kgpppptpppppgk.","..kpppPtPpppk...",".kpptpppptpppk..",".kkkkkkkkkkkkk.."]},
 {name:'Pushatomìdir il Rospo Mannaro',sub:'Terzo scagnozzo di Anlaucer',fem:false,hp:8,w:30,h:28,
  pal:{k:'#0e100a',g:'#6a7a30',G:'#8a9a40',y:'#ffd030',r:'#a02020',l:'#c8c890',f:'#5a4020'},
  map:["................","..f..........f..","..kkk......kkk..",".kyyyk....kyyyk.",".kykyk....kykyk.","..kkkkkkkkkkkk..",".kgfGgggggGgfgk.","kggggfgggfgggggk","kgkkkkkkkkkkkkgk","kgkrrrrrrrrrrkgk","kggkkkkkkkkkkggk","kgllllllllllllgk",".kgllllllllllgk.","kgkkggggggggkkgk","kggk.kkkkkk.kggk","kkkk........kkkk"]},
 {name:'Ser Rekter',sub:'Quarto scagnozzo di Anlaucer',fem:false,hp:8,w:24,h:30,
  pal:{k:'#0a0a10',m:'#7a8090',M:'#b0b8c8',r:'#c02030',e:'#ff4030',G:'#d0a040'},
  map:["......kkk.......",".....krrrk......","....kkrrkkk.....","...kmmmmmmmk....","...kmMmmmmmk....","...kkkkkkkkk....","...kmeekeemk....","...kkkkkkkkk....","..kmmmmmmmmmk...",".kmMmmmGmmmmmk..",".kmkmmmmmmmkmk..",".kmkmmGmmmmkmk..","..kkmmmmmmmkk...","...kmmk.kmmk....","...kmmk.kmmk....","..kkkkk.kkkkk..."]},
 {name:'Griefilla',sub:'Quinto scagnozzo di Anlaucer',fem:true,hp:8,w:28,h:22,
  pal:{k:'#0c060e',d:'#3a2440',D:'#5a3a66',e:'#ff3050',w:'#f0f0f0'},
  map:[".....k....k.....",".....kk..kk.....","k....kkkkkk....k","kk..kddddddk..kk","kdk.kdeddedk.kdk","kddkkddddddkkddk","kdddkdwddwdkdddk","kddddkddddkddddk","kdDddkddddkddDdk","kdkddkddddkddkdk","kk.kdkkddkkdk.kk","k...kk.kk.kk...k"]},
 {name:'Anlaucer',sub:'Il demone evocato dall\'anlaciamento',fem:false,hp:16,w:34,h:34,
  pal:{k:'#0a0204',r:'#b0181c',R:'#e03a2a',y:'#ffd030',W:'#e8e0d0',w:'#ffffff',d:'#2a0a14'},
  map:["kk................kk","kWk..............kWk",".kWk............kWk.",".kWWk..kkkkkk..kWWk.","..kWWkkrrrrrrkkWWk..","...kkrrrrrrrrrrkk...","dd.krrrrrrrrrrrrk.dd","ddkrrryyrrrryyrrrkdd","dddkrrykrrrrkyrrkddd","ddddkrrrrrrrrrrkdddd","dddddkrkwkwkwrkddddd","ddddkkrkkkkkkrkkdddd","dddkrrrrrrrrrrrrkddd","ddkrrRrrrrrrrrRrrkdd","dk.krrrrrrrrrrrrk.kd","d..krrRrrrrrrRrrk..d","....krrrrrrrrrrk....","....krrk....krrk....","...kkrrk....krrkk...","...kkkkk....kkkkk..."]}
];
const BOSS_SPR=BOSS_DEF.map(d=>{const c=sprite(d.map,d.pal,2);const f=flip(c);return {r:c,l:f,wr:white(c),wl:white(f)};});

// ---------- temi ----------
const THEMES=[
 {name:'La Città Vecchia',sky:['#2a1a3a','#5a2a4a','#a2484a','#e07a4a','#f2b25a'],liq:'#24406a',liqT:'#5a8ac0',song:0},
 {name:'Il Bosco Oscuro',sky:['#070f18','#0e1c2a','#14283a','#1c3846','#244650'],liq:'#0e2836',liqT:'#3a7a8a',song:1},
 {name:'La Palude delle Nebbie',sky:['#10160e','#1a2414','#26321c','#3a4626','#56623a'],liq:'#2e5a0e',liqT:'#9ae02a',song:1},
 {name:'Le Miniere Abbandonate',sky:['#07050a','#0c0910','#110c16','#16101c','#1c1422'],liq:'#b83410',liqT:'#ffb030',song:0},
 {name:'La Torre del Campanaro',sky:['#0a0e1e','#10182c','#16203a','#1c2848','#223056'],liq:'#06060e',liqT:'#2a2a50',song:2},
 {name:'La Fortezza di Anlaucer',sky:['#160306','#33070e','#5c0e14','#8e1c10','#c8460e'],liq:'#b82408',liqT:'#ffc040',song:2}
];

function makeTiles(ti){
  const R=rng(77+ti);
  const C=[
   {b:'#7a6a5a',d:'#5a4c40',l:'#9a8a74',m:'#3e342c',t:'#a89880',t2:'#c8b89e',brick:1},
   {b:'#5a3a22',d:'#3e2816',l:'#76502e',m:'#2a1a0e',t:'#2f7a34',t2:'#5ab04a',brick:0},
   {b:'#3a3222',d:'#2a2418',l:'#4e4430',m:'#1a160e',t:'#45622a',t2:'#7a9a3a',brick:0},
   {b:'#4a4e62',d:'#32364a',l:'#666c84',m:'#22242e',t:'#7a809a',t2:'#a4aac2',brick:0},
   {b:'#3a4058',d:'#2a2e42',l:'#4e5672',m:'#1a1c28',t:'#7a5230',t2:'#a87444',brick:1},
   {b:'#2a1a24',d:'#1a0e16',l:'#3e2834',m:'#0e060a',t:'#3e2228',t2:'#e0502a',brick:1}][ti];
  const fillFn=x=>{
    x.fillStyle=C.b;x.fillRect(0,0,16,16);
    if(C.brick){
      for(let r=0;r<4;r++){const off=(r%2)*8;x.fillStyle=C.m;x.fillRect(0,r*4+3,16,1);x.fillRect((off+7)%16,r*4,1,3);x.fillRect((off+15)%16,r*4,1,3);
        x.fillStyle=C.l;x.fillRect(off%16,r*4,6,1);x.fillStyle=C.d;x.fillRect((off+8)%16,r*4+2,5,1);}
      if(ti===5){x.fillStyle='#c0301a';for(let i=0;i<3;i++){let a=R()*16|0,b=R()*16|0;for(let k=0;k<4;k++){x.fillRect(a,b,1,1);a+=R()<.5?1:0;b+=1;}}}
    } else {
      for(let i=0;i<26;i++){x.fillStyle=R()<.5?C.d:C.l;x.fillRect(R()*16|0,R()*16|0,1+(R()*2|0),1);}
      if(ti===3){x.fillStyle=C.m;for(let i=0;i<2;i++){let a=R()*16|0,b=R()*16|0;for(let k=0;k<5;k++){x.fillRect(a,b,1,1);a+=R()<.5?1:-1;b++;}}}
    }
  };
  const fill=mk(16,16,fillFn);
  const top=mk(16,16,x=>{
    fillFn(x);
    if(ti===0){x.fillStyle=C.m;x.fillRect(0,0,16,5);for(let i=0;i<4;i++){x.fillStyle=i%2?C.t:C.t2;x.fillRect(i*4,0,3,4);x.fillStyle=C.l;x.fillRect(i*4,0,2,1);}}
    else if(ti===4){x.fillStyle=C.t;x.fillRect(0,0,16,5);x.fillStyle=C.t2;x.fillRect(0,0,16,1);x.fillStyle='#3a2414';x.fillRect(0,5,16,1);x.fillRect(7,0,1,5);x.fillStyle='#c8c8c8';x.fillRect(2,2,1,1);x.fillRect(12,2,1,1);}
    else if(ti===5){x.fillStyle=C.t;x.fillRect(0,0,16,3);x.fillStyle=C.t2;for(let i=0;i<16;i++)if(R()<.6)x.fillRect(i,0,1,1);}
    else if(ti===3){x.fillStyle=C.t;x.fillRect(0,0,16,3);x.fillStyle=C.t2;x.fillRect(0,0,16,1);}
    else {x.fillStyle=C.t;x.fillRect(0,0,16,4);for(let i=0;i<16;i++){if(R()<.55)x.fillRect(i,4,1,1+(R()*3|0));}x.fillStyle=C.t2;x.fillRect(0,0,16,1);for(let i=0;i<16;i++)if(R()<.35)x.fillRect(i,1,1,1);
      if(ti===2){x.fillStyle='#5a7a2a';x.fillRect(3,4,1,4);x.fillRect(11,4,1,3);}}
  });
  const plat=mk(16,16,x=>{x.fillStyle='#2a1a0e';x.fillRect(0,0,16,6);x.fillStyle='#8a5a2e';x.fillRect(0,1,16,4);x.fillStyle='#b07a44';x.fillRect(0,1,16,1);x.fillStyle='#5a3a1c';x.fillRect(5,1,1,4);x.fillRect(11,1,1,4);x.fillStyle='#2a1a0e';x.fillRect(2,6,2,3);x.fillRect(12,6,2,3);});
  const spike=mk(16,16,x=>{for(let i=0;i<3;i++){const cx=i*5+3;for(let j=0;j<8;j++){const w=Math.floor(j/3);x.fillStyle='#2a2a34';x.fillRect(cx-w-1,8+j,w*2+3,1);x.fillStyle=j<2?'#ffffff':'#b8bcc8';x.fillRect(cx-w,8+j,w*2+1,1);}}x.fillStyle='#4a4a58';x.fillRect(0,15,16,1);});
  return {fill,top,plat,spike};
}

// ---------- sfondi ----------
const LW=640,LH=H+30;
function bands(x,cols,w,h){const n=cols.length,bh=Math.ceil(h/n);cols.forEach((c,i)=>{x.fillStyle=c;x.fillRect(0,i*bh,w,bh+1);});
  for(let i=1;i<n;i++){const y=i*bh;x.fillStyle=cols[i-1];for(let xx=0;xx<w;xx+=2){x.fillRect(xx,y,1,1);x.fillRect(xx+1,y+2,1,1);}}}
function triUp(x,cx,by,hw,h){for(let j=0;j<h;j++){const w=Math.round(hw*(j+1)/h);x.fillRect(cx-w,by-h+j,w*2+1,1);}}
function pine(x,cx,by,h){x.fillRect(cx-1,by-5,3,5);for(let t=0;t<3;t++){const th=h/3*1.5,top=by-5-h+t*h/3;for(let j=0;j<th;j++){const w=Math.round((j/th)*(h*0.22+t*2.5));x.fillRect(cx-w,Math.round(top+j),w*2+1,1);}}}
function stars(x,R,n,maxY){for(let i=0;i<n;i++){x.fillStyle=R()<.3?'#ffffff':'#c8c0e0';x.fillRect(R()*W|0,R()*maxY|0,1,1);}}
function layer(f,fn){return {f,c:mk(LW,LH,x=>{for(const off of [0,-LW,LW]){x.save();x.translate(off,0);fn(x);x.restore();}})};}
function makeBG(ti){
  const th=THEMES[ti],R=rng(500+ti);
  const sky=mk(W,H,x=>{bands(x,th.sky,W,H);
    if(ti===0){x.fillStyle='#ffd27a';for(let j=-12;j<=12;j++){const w=Math.round(Math.sqrt(144-j*j));x.fillRect(220-w,120+j,w*2,1);}x.fillStyle='#fff0b0';x.fillRect(214,112,8,3);}
    if(ti===1||ti===4){stars(x,R,70,110);x.fillStyle='#e8e4c8';for(let j=-9;j<=9;j++){const w=Math.round(Math.sqrt(81-j*j));x.fillRect(250-w,36+j,w*2,1);}x.fillStyle=th.sky[1];for(let j=-9;j<=9;j++){const w=Math.round(Math.sqrt(81-j*j));x.fillRect(255-w,33+j,w*2,1);}}
    if(ti===2){x.fillStyle='#b8d070';for(let j=-10;j<=10;j++){const w=Math.round(Math.sqrt(100-j*j));x.fillRect(80-w,40+j,w*2,1);}stars(x,R,25,90);}
    if(ti===5){x.fillStyle='#ff9040';for(let j=-14;j<=14;j++){const w=Math.round(Math.sqrt(196-j*j));x.fillRect(160-w,70+j,w*2,1);}x.fillStyle='#ffd070';for(let j=-8;j<=8;j++){const w=Math.round(Math.sqrt(64-j*j));x.fillRect(160-w,70+j,w*2,1);}}
  });
  const Ls=[];
  const r=(a,b)=>a+R()*(b-a);
  if(ti===0){
    const far=[];for(let xx=0;xx<LW;xx+=r(26,44))far.push([xx,r(14,24)|0,r(40,95)|0,R()<.4,R()]);
    Ls.push(layer(.2,x=>{x.fillStyle='#4a2240';x.fillRect(0,LH-34,LW,34);for(const [bx,w,h,cone] of far){x.fillStyle='#4a2240';x.fillRect(bx,LH-h,w,h);if(cone)triUp(x,bx+w/2|0,LH-h,w/2+2|0,18);else for(let k=0;k<w;k+=4)x.fillRect(bx+k,LH-h-3,2,3);x.fillStyle='#f2b25a';x.fillRect(bx+(w/2|0),LH-h+10,1,2);}}));
    const near=[];for(let xx=0;xx<LW;xx+=r(36,58))near.push([xx,r(26,40)|0,r(28,58)|0,R()]);
    Ls.push(layer(.45,x=>{for(const [bx,w,h,q] of near){x.fillStyle='#2a1430';x.fillRect(bx,LH-h,w,h);triUp(x,bx+w/2|0,LH-h,w/2+3|0,14);x.fillRect(bx+w-8,LH-h-16,4,10);x.fillStyle='#1c0c22';x.fillRect(bx,LH-h+8,w,1);x.fillRect(bx+w/2|0,LH-h+8,1,h-8);for(let k=0;k<2;k++){x.fillStyle=(q+k*.3)%1<.6?'#ffc870':'#3a1c3a';x.fillRect(bx+5+k*(w-13),LH-h+14,4,5);}}}));
  } else if(ti===1){
    Ls.push(layer(.12,x=>{x.fillStyle='#1a3a44';for(let xx=0;xx<LW;xx++){const y=Math.round(LH-70-12*Math.sin(xx/LW*Math.PI*6)-6*Math.sin(xx/LW*Math.PI*14));x.fillRect(xx,y,1,LH-y);}}));
    const mid=[];for(let xx=0;xx<LW;xx+=r(12,22))mid.push([xx,r(40,70)]);
    Ls.push(layer(.32,x=>{x.fillStyle='#12282e';x.fillRect(0,LH-30,LW,30);for(const [bx,h] of mid)pine(x,bx|0,LH-28,h);}));
    const near=[];for(let xx=0;xx<LW;xx+=r(26,44))near.push([xx,r(70,110)]);
    Ls.push(layer(.6,x=>{x.fillStyle='#08161a';x.fillRect(0,LH-14,LW,14);for(const [bx,h] of near)pine(x,bx|0,LH-12,h);}));
  } else if(ti===2){
    Ls.push(layer(.12,x=>{x.fillStyle='#2a3420';for(let xx=0;xx<LW;xx++){const y=Math.round(LH-50-8*Math.sin(xx/LW*Math.PI*4));x.fillRect(xx,y,1,LH-y);}}));
    const trees=[];for(let xx=0;xx<LW;xx+=r(50,90))trees.push([xx|0,r(55,85)|0,R()]);
    Ls.push(layer(.32,x=>{x.fillStyle='#1c2414';x.fillRect(0,LH-30,LW,30);for(const [bx,h,q] of trees){x.fillRect(bx,LH-30-h,4,h);for(let b=0;b<4;b++){const by=LH-30-h+8+b*12,d=b%2?1:-1;for(let k=0;k<10+q*8;k++)x.fillRect(bx+1+d*k,by-(k/3|0),1,1);}}}));
    const reeds=[];for(let xx=0;xx<LW;xx+=r(3,9))reeds.push([xx|0,r(8,26)|0]);
    Ls.push(layer(.6,x=>{x.fillStyle='#10160a';x.fillRect(0,LH-12,LW,12);for(const [bx,h] of reeds){x.fillRect(bx,LH-12-h,1,h);if(h>18){x.fillStyle='#2a1c0e';x.fillRect(bx-1,LH-12-h,3,5);x.fillStyle='#10160a';}}}));
  } else if(ti===3){
    const cr=[];for(let i=0;i<22;i++)cr.push([r(0,LW)|0,r(20,LH-20)|0,R()<.5]);
    Ls.push(layer(.18,x=>{x.fillStyle='#1a1622';x.fillRect(0,0,LW,LH);for(let i=0;i<400;i++){x.fillStyle=R()<.5?'#221c2c':'#13101a';x.fillRect(R()*LW|0,R()*LH|0,2,1);}for(const [cx,cy,c] of cr){x.fillStyle=c?'#8a5ad0':'#4ac8c8';triUp(x,cx,cy,2,7);x.fillRect(cx-1,cy,3,1);x.fillStyle='#ffffff';x.fillRect(cx,cy-5,1,2);}}));
    Ls.push(layer(.4,x=>{for(let bx=20;bx<LW;bx+=160){x.fillStyle='#3a2616';x.fillRect(bx,30,6,LH-30);x.fillRect(bx+70,30,6,LH-30);x.fillRect(bx-4,26,84,6);x.fillStyle='#24160c';x.fillRect(bx,32,6,1);x.fillStyle='#ffb040';x.fillRect(bx+36,33,4,5);x.fillStyle='#fff0a0';x.fillRect(bx+37,34,2,2);}}));
    const st=[];for(let xx=0;xx<LW;xx+=r(14,30))st.push([xx|0,r(8,30)|0,r(6,18)|0]);
    Ls.push(layer(.6,x=>{x.fillStyle='#0c0a10';x.fillRect(0,0,LW,8);for(const [bx,h,h2] of st){for(let j=0;j<h;j++){const w=Math.round(5*(1-j/h));x.fillRect(bx-w,8+j,w*2+1,1);}triUp(x,bx+7,LH,5,h2);}x.fillRect(0,LH-4,LW,4);}));
  } else if(ti===4){
    Ls.push(layer(.25,x=>{x.fillStyle='#1c2034';x.fillRect(0,0,LW,LH);x.fillStyle='#12152a';for(let y=0;y<LH;y+=7){x.fillRect(0,y,LW,1);for(let xx=((y/7)%2)*7;xx<LW;xx+=14)x.fillRect(xx,y,1,7);}
      for(let bx=40;bx<LW;bx+=160){x.fillStyle='#0c0e1c';x.fillRect(bx-2,40,30,56);for(let j=0;j<14;j++){const w=Math.round(Math.sqrt(196-(14-j)*(14-j)));x.fillRect(bx+13-w,26+j,w*2,1);}
        x.fillStyle='#2a3a6a';x.fillRect(bx+1,42,24,52);for(let j=0;j<12;j++){const w=Math.round(Math.sqrt(144-(12-j)*(12-j)));x.fillRect(bx+13-w,30+j,w*2,1);}
        x.fillStyle='#e8e4c8';x.fillRect(bx+15,48,6,6);x.fillStyle='#ffffff';x.fillRect(bx+5,60,1,1);x.fillRect(bx+19,72,1,1);x.fillRect(bx+9,84,1,1);
        x.fillStyle='#0c0e1c';x.fillRect(bx+12,30,2,64);x.fillRect(bx+1,62,24,2);}}));
    Ls.push(layer(.5,x=>{for(let bx=60;bx<LW;bx+=110){const h=40+(bx%3)*18;x.fillStyle='#3a2a1a';x.fillRect(bx,0,1,h);x.fillStyle='#0e1020';x.fillRect(bx-3,h,7,2);x.fillRect(bx-5,h+2,11,8);x.fillRect(bx-7,h+10,15,3);x.fillStyle='#8a6a2a';x.fillRect(bx-4,h+3,2,6);}
      x.fillStyle='#0a0c18';for(let bx=10;bx<LW;bx+=220){const cx=bx+30,cy=LH-30;for(let a=0;a<8;a++){const ang=a*Math.PI/4;x.fillRect(cx+Math.round(Math.cos(ang)*18)-3,cy+Math.round(Math.sin(ang)*18)-3,6,6);}for(let j=-15;j<=15;j++){const w=Math.round(Math.sqrt(225-j*j));x.fillRect(cx-w,cy+j,w*2,1);}x.fillStyle='#1c2034';x.fillRect(cx-3,cy-3,6,6);x.fillStyle='#0a0c18';}}));
  } else {
    Ls.push(layer(.12,x=>{x.fillStyle='#3a0a12';for(let xx=0;xx<LW;xx++){const y=Math.round(LH-60-26*Math.abs(Math.sin(xx/LW*Math.PI*3))-8*Math.sin(xx/LW*Math.PI*10));x.fillRect(xx,y,1,LH-y);}
      x.fillStyle='#ff6020';for(let k=0;k<3;k++){const cx=LW/6+k*LW/3|0;for(let j=0;j<30;j++)x.fillRect(cx+Math.round(Math.sin(j*.4)*2),LH-84+j*2,1,2);}}));
    const sp=[];for(let xx=0;xx<LW;xx+=r(30,60))sp.push([xx|0,r(8,16)|0,r(50,100)|0]);
    Ls.push(layer(.35,x=>{x.fillStyle='#1a0408';x.fillRect(0,LH-30,LW,30);for(const [bx,w,h] of sp){x.fillStyle='#1a0408';x.fillRect(bx,LH-h,w,h);triUp(x,bx+w/2|0,LH-h,w/2+1|0,20);x.fillStyle='#ff3020';x.fillRect(bx+w/2|0,LH-h+12,1,3);}}));
    const rk=[];for(let xx=0;xx<LW;xx+=r(18,40))rk.push([xx|0,r(10,34)|0]);
    Ls.push(layer(.6,x=>{x.fillStyle='#0e0204';x.fillRect(0,LH-10,LW,10);for(const [bx,h] of rk)triUp(x,bx,LH-10,7,h);}));
  }
  return {sky,Ls};
}
const TILES=[],BGS=[];
function getTheme(i){if(!TILES[i]){TILES[i]=makeTiles(i);BGS[i]=makeBG(i);}return [TILES[i],BGS[i]];}

// ---------- generatore di livelli ----------
function genLevel(i){
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

// ---------- audio ----------
let AC=null,master=null,musicG=null,muted=false;
try{muted=localStorage.getItem('baruxMute')==='1';}catch(e){}
function unlockAudio(){
  if(AC){if(AC.state==='suspended')AC.resume();return;}
  try{AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=muted?0:.55;master.connect(AC.destination);musicG=AC.createGain();musicG.gain.value=.55;musicG.connect(master);nextT=AC.currentTime+.05;loadOhm();}catch(e){AC=null;}
}
let ohmBuf=null,ohmLoading=false;
function loadOhm(){if(!AC||ohmBuf||ohmLoading)return;ohmLoading=true;fetch(ohmUrl).then(r=>r.arrayBuffer()).then(buf=>AC.decodeAudioData(buf,b=>{ohmBuf=b;},()=>{ohmLoading=false;})).catch(()=>{ohmLoading=false;});}
function playOhm(){if(!AC||muted)return false;if(!ohmBuf){loadOhm();return false;}const src=AC.createBufferSource(),g=AC.createGain();src.buffer=ohmBuf;src.playbackRate.value=.94+Math.random()*.12;g.gain.value=.95;src.connect(g);g.connect(master);src.start();return true;}
function tone(type,f0,f1,dur,vol=.12,delay=0){if(!AC||muted)return;const t=AC.currentTime+delay;const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);if(f1)o.frequency.exponentialRampToValueAtTime(f1,t+dur);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.02);}
function noise(dur,vol=.12,freq=1200){if(!AC||muted)return;const n=AC.sampleRate*dur|0,b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const s=AC.createBufferSource();s.buffer=b;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=freq;const g=AC.createGain();g.gain.value=vol;s.connect(f);f.connect(g);g.connect(master);s.start();}
const SFX={
  jump:()=>tone('square',260,560,.12,.07),
  coin:()=>{tone('square',988,0,.06,.06);tone('square',1318,0,.12,.06,.06);},
  swing:()=>noise(.09,.18,2400),
  kill:()=>{tone('square',500,120,.15,.08);noise(.1,.1,800);},
  hurt:()=>{if(!playOhm())tone('sawtooth',300,90,.3,.09);},
  slash:()=>{noise(.16,.2,3200);tone('triangle',900,300,.16,.05);},
  bossHit:()=>{tone('square',180,60,.18,.12);noise(.12,.2,600);},
  boom:()=>noise(.35,.3,300),
  flag:()=>{[523,659,784].forEach((f,i)=>tone('square',f,0,.12,.06,i*.08));},
  heart:()=>{[659,880].forEach((f,i)=>tone('triangle',f,0,.15,.1,i*.08));},
  portal:()=>{[392,523,659,784,1046].forEach((f,i)=>tone('triangle',f,0,.2,.1,i*.1));},
  die:()=>{[392,330,262,196].forEach((f,i)=>tone('square',f,0,.18,.08,i*.15));},
  throw:()=>tone('triangle',200,500,.12,.08),
  cast:()=>tone('sawtooth',800,200,.3,.05),
  slam:()=>{noise(.3,.3,200);tone('sine',90,40,.3,.2);},
  charge:()=>tone('sawtooth',120,240,.4,.06),
  screech:()=>tone('sawtooth',1400,600,.3,.05),
  fire:()=>noise(.2,.15,900),
  life:()=>{[523,659,784,1046].forEach((f,i)=>tone('square',f,0,.12,.07,i*.07));},
  roar:()=>{tone('sawtooth',90,50,.8,.14);noise(.6,.2,250);}
};
function sfx(n){try{SFX[n]&&SFX[n]();}catch(e){}}
const SONGS=[
 {bpm:150,mel:[62,0,65,0,69,67,65,64,62,0,57,0,60,62,64,0,65,0,64,62,64,0,60,0,62,0,0,62,64,65,64,0],
  bas:[38,0,50,0,38,0,50,0,36,0,48,0,36,0,48,0,34,0,46,0,36,0,48,0,38,0,50,0,33,0,45,0]},
 {bpm:104,mel:[69,0,0,72,71,0,69,0,67,0,0,64,65,0,64,0,62,0,0,64,65,0,67,0,64,0,0,0,0,0,0,0],
  bas:[45,0,0,0,45,0,0,0,43,0,0,0,41,0,0,0,38,0,0,0,40,0,0,0,45,0,0,0,40,0,0,0]},
 {bpm:120,mel:[62,63,62,0,69,0,68,0,62,63,62,0,70,69,68,67,62,63,62,0,69,0,68,0,65,64,63,62,61,0,0,0],
  bas:[38,0,38,0,38,0,38,0,39,0,39,0,39,0,39,0,38,0,38,0,38,0,38,0,37,0,37,0,37,0,37,0]},
 {bpm:170,mel:[64,0,64,67,0,64,70,0,69,67,64,0,62,64,0,0,64,0,64,67,0,64,71,0,72,71,67,64,66,0,0,0],
  bas:[40,40,52,40,40,52,40,40,38,38,50,38,38,50,38,38,40,40,52,40,40,52,40,40,36,36,48,36,35,35,47,35]}
];
let song=-1,mstep=0,nextT=0;
function music(i){if(song===i)return;song=i;mstep=0;if(AC)nextT=AC.currentTime+.08;}
function note(type,n,t,d,v){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=440*Math.pow(2,(n-69)/12);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(musicG);o.start(t);o.stop(t+d+.02);}
function musicTick(){
  if(!AC||song<0||muted)return;
  const s=SONGS[song],sp=60/s.bpm/2;
  if(nextT<AC.currentTime)nextT=AC.currentTime+.02;
  while(nextT<AC.currentTime+.15){const m=s.mel[mstep%s.mel.length],b=s.bas[mstep%s.bas.length];if(m)note('square',m,nextT,sp*.9,.035);if(b)note('triangle',b,nextT,sp*1.5,.08);mstep++;nextT+=sp;}
}
const muteBtn=document.getElementById('mute');
function setMute(m){muted=m;try{localStorage.setItem('baruxMute',m?'1':'0');}catch(e){}if(master)master.gain.value=m?0:.55;muteBtn.textContent='Audio: '+(m?'spento':'acceso');}
muteBtn.addEventListener('click',()=>{unlockAudio();setMute(!muted);});
setMute(muted);

// ---------- input ----------
const keys={},hit={};
const MAP={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'jump',KeyW:'jump',Space:'jump',KeyZ:'jump',KeyX:'attack',KeyJ:'attack',KeyK:'attack',Enter:'start',KeyP:'pause',Escape:'pause',KeyM:'mute',KeyC:'cont',Backspace:'pause',ArrowDown:'down',KeyS:'down'};
addEventListener('keydown',e=>{const a=MAP[e.code];unlockAudio();if(!a)return;e.preventDefault();if(!e.repeat){hit[a]=true;if(e.code==='ArrowUp'||e.code==='KeyW')hit.up=true;}keys[a]=true;if(a==='mute'&&!e.repeat)setMute(!muted);});
addEventListener('keyup',e=>{const a=MAP[e.code];if(a)keys[a]=false;});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;});
let tapPos=null;
scr.addEventListener('pointerdown',e=>{unlockAudio();const r=scr.getBoundingClientRect();tapPos={x:(e.clientX-r.left)/r.width*W*S,y:(e.clientY-r.top)/r.height*H*S};hit.tap=true;});
document.querySelectorAll('#touch button').forEach(b=>{
  const k=b.dataset.k;
  const on=e=>{e.preventDefault();unlockAudio();keys[k]=true;hit[k]=true;b.classList.add('on');try{b.setPointerCapture(e.pointerId);}catch(_){}};
  const off=e=>{keys[k]=false;b.classList.remove('on');};
  b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointercancel',off);b.addEventListener('lostpointercapture',off);
});
if(matchMedia('(pointer:coarse)').matches)document.body.classList.add('is-touch');
addEventListener('touchstart',()=>document.body.classList.add('is-touch'),{once:true,passive:true});
// ---------- controller ----------
const padPrev={};let padIdx=-1,padMsgT=0,padMsg='';
addEventListener('gamepadconnected',e=>{padIdx=e.gamepad.index;padMsg='Controller collegato';padMsgT=180;});
addEventListener('gamepaddisconnected',e=>{if(e.gamepad.index===padIdx){padIdx=-1;for(const a in padPrev)if(padPrev[a]){keys[a]=false;padPrev[a]=false;}padMsg='Controller scollegato';padMsgT=150;}});
function getPad(){if(!navigator.getGamepads)return null;const list=navigator.getGamepads();if(padIdx>=0&&list[padIdx])return list[padIdx];for(const g of list)if(g&&g.connected){padIdx=g.index;return g;}return null;}
function pollPad(){
  const g=getPad();if(!g)return;
  const b=i=>!!(g.buttons[i]&&(g.buttons[i].pressed||g.buttons[i].value>.5));
  const ax=g.axes[0]||0,ay=g.axes[1]||0,inPlay=state==='play';
  const now={
    left:b(14)||ax<-.5, right:b(15)||ax>.5,
    up:b(12)||ay<-.6, down:b(13)||ay>.6,
    jump:b(0),
    attack:b(2)||b(3)||(inPlay&&b(1)),
    pause:(inPlay&&b(9))||(!inPlay&&b(1)),
    start:!inPlay&&b(9)};
  for(const a in now){
    if(now[a]&&!padPrev[a]){hit[a]=true;unlockAudio();}
    if(now[a]!==!!padPrev[a]&&a!=='up'&&a!=='start')keys[a]=now[a];
    padPrev[a]=now[a];
  }
}
function rumble(ms,str){try{const g=getPad();g&&g.vibrationActuator&&g.vibrationActuator.playEffect('dual-rumble',{duration:ms,strongMagnitude:str,weakMagnitude:str*.6});}catch(e){}}
const confirmHit=()=>hit.start||hit.jump||hit.attack||hit.tap;
const menuOK=()=>hit.start||hit.attack||(hit.jump&&!hit.up);
document.getElementById('pausebtn').addEventListener('pointerdown',e=>{e.preventDefault();unlockAudio();hit.pause=true;});

// ---------- salvataggio ----------
function loadSave(){try{return Math.min(5,+localStorage.getItem('baruxLvl')||0);}catch(e){return 0;}}
let SEEN=new Set();try{SEEN=new Set(JSON.parse(localStorage.getItem('baruxSeen')||'[]'));}catch(e){}
function markSeen(id){if(SEEN.has(id))return;SEEN.add(id);try{localStorage.setItem('baruxSeen',JSON.stringify([...SEEN]));}catch(e){}}
function save(n){try{if(n>loadSave())localStorage.setItem('baruxLvl',String(Math.min(5,n)));}catch(e){}}

// ---------- stato di gioco ----------
let state='title',lvlIndex=0,lvl=null,tiles=null,bg=null,P=null;
let ents=[],projs=[],parts=[],boss=null,fight=false,portal=null,atkBox=null;
let pauseSel=0,selL=0,selG=0,cheatSel=0,cheatsFrom='title';
const CHEATS={lives:false,god:false,kill:false};
try{Object.assign(CHEATS,JSON.parse(localStorage.getItem('baruxCheats')||'{}'));}catch(e){}
function saveCheats(){try{localStorage.setItem('baruxCheats',JSON.stringify(CHEATS));}catch(e){}}
const startLives=()=>CHEATS.lives?99:3;
const CHEAT_LIST=[
 {k:'lives',label:'99 vite',desc:'Ogni partita e ogni livello iniziano con 99 vite.'},
 {k:'god',label:'Invincibilità',desc:'Nessun danno. Se cadi in una fossa, torni a terra.'},
 {k:'kill',label:'Uccisione istantanea',desc:'Nemici e boss vengono sconfitti al primo colpo.'}];
const IPAL={k:'#1a1020',g:'#e8b84a',G:'#a8781e',w:'#ffffff',r:'#d8344a',b:'#6a3a1a',c:'#bfe0f0',s:'#c8ccd8',S:'#7a8090',d:'#8a6a3a',p:'#6a4a9a',l:'#fff2b0',x:'#2fb06a',e:'#2fb06a'};
const ICON={
 shield:sprite([".kkkkkkkk.","ksssssSSSk","ksrrrrrrSk","ksrggggrSk","ksrggggrSk",".ksrrrrSk.",".kssssSSk.","..ksssSk..","...kssk...","....kk...."],IPAL),
 trophy:sprite(["kkkkkkkkkk","kglgggggGk","kgggggggGk",".kgggggGk.","..kgggGk..","...kgGk...","....kk....","...kggk...","..kkkkkk..","..kGGGGk.."],IPAL),
 crown:sprite(["g...g...g","gg.ggg.gg","ggggggggg","grggeggrg","ggggggggg","GGGGGGGGG"],IPAL),
 clock:sprite(["..kkkkkk..",".kllllllk.","kllllklllk","kllllklllk","kllllkkllk","kllllllllk","kllllllllk",".kllllllk.","..kkkkkk.."],IPAL),
 cane:sprite(["......ggg.","......ggg.",".....b....","....b.....","...b......","..b.......",".b........","b........."],IPAL),
 dove:sprite(["....ww....","...wwkw...","..wwwwwg..","wwwwwww...",".wwwwww...","..wwww....","...w.w...."],IPAL),
 moon:sprite(["..gggg....",".ggll.....","ggl.......","ggl.......","ggl.......","ggl.......",".ggll.....","..gggg...."],IPAL),
 orb:sprite(["..kkkk..",".kxxxxk.","kxllxxxk","kxlxxxxk","kxxxxxxk",".kxxxxk.","..kkkk.."],IPAL),
 sack:sprite(["...kkk....","..kdddk...","...kdk....","..kddddk..",".kddgdddk.","kddgggdddk","kdddgddddk",".kddddddk.","..kkkkkk.."],IPAL),
 chest:sprite([".kkkkkkkk.","kddddddddk","kGGGGGGGGk","kddddgdddk","kddddgdddk","kddddddddk","kkkkkkkkkk"],IPAL),
 book:sprite(["kkkkkkkkk.","kppppppgk.","kpgggppgk.","kppppppgk.","kpgggppgk.","kppppppgk.","kkkkkkkkk."],IPAL),
 star:sprite(["....k....","...kgk...","kkkkglkkk","kgggglggk",".kgggggk.","..kgggk..",".kggkggk.",".kgk.kgk.","kk.....kk"],IPAL),
 broken:sprite([".kk.kk.","krrkrrk","krrkrrk","krkrrrk",".krkrk.","..krk..","...k..."],IPAL)};
const ACH=[
 {id:'b0',n:'Rivoluzione monetaria',d:'Sconfiggi Pushing l’Esattore',c:'Storia',ic:()=>BOSS_SPR[0].r},
 {id:'b1',n:'Sfoltire i rovi',d:'Sconfiggi Gankàla la Strega dei Rovi',c:'Storia',ic:()=>BOSS_SPR[1].r},
 {id:'b2',n:'Gracidio finale',d:'Sconfiggi Pushatomìdir il Rospo Mannaro',c:'Storia',ic:()=>BOSS_SPR[2].r},
 {id:'b3',n:'Contro Rektato',d:'Sconfiggi Ser Rekter',c:'Storia',ic:()=>BOSS_SPR[3].r},
 {id:'b4',n:'Griefami questo!',d:'Sconfiggi Griefilla',c:'Storia',ic:()=>BOSS_SPR[4].r},
 {id:'b5',n:'Fine dell’anlaciamento',d:'Sconfiggi Anlaucer e completa il gioco',c:'Storia',ic:()=>BOSS_SPR[5].r},
 {id:'intoccabile',n:'Intoccabile',d:'Completa un livello senza subire danni',c:'Abilità',ic:()=>ICON.shield},
 {id:'duello',n:'Duello perfetto',d:'Sconfiggi un boss senza subire danni',c:'Abilità',ic:()=>ICON.trophy},
 {id:'macchia',n:'Senza una macchia',d:'Completa il gioco senza perdere vite, partendo da una nuova partita',c:'Abilità',ic:()=>ICON.crown},
 {id:'acciaio',n:'Barone d’acciaio',d:'Completa il gioco senza subire nessun danno, partendo da una nuova partita',c:'Abilità',ic:()=>ICON.star},
 {id:'corsa',n:'Barone di corsa',d:'Completa un livello in meno di 2 minuti',c:'Abilità',ic:()=>ICON.clock},
 {id:'bastone',n:'Solo bastone',d:'Completa un livello senza mai saltare in testa ai nemici',c:'Abilità',ic:()=>ICON.cane},
 {id:'pacifista',n:'Pacifista',d:'Completa un livello sconfiggendo solo il boss',c:'Abilità',ic:()=>ICON.dove},
 {id:'primo',n:'Prima bastonata',d:'Sconfiggi il tuo primo nemico',c:'Combattimento',stat:'kills',goal:1,ic:()=>KINDS.goblin.fr[0]},
 {id:'luna',n:'Mezzaluna letale',d:'Sconfiggi 25 nemici con l’attacco in volo',c:'Combattimento',stat:'air',goal:25,ic:()=>ICON.moon},
 {id:'schiaccia',n:'Schiacciasassi',d:'Sconfiggi 50 nemici saltandogli in testa',c:'Combattimento',stat:'stomp',goal:50,ic:()=>BAR.jump[0]},
 {id:'flagello',n:'Flagello degli scagnozzi',d:'Sconfiggi 300 nemici in totale',c:'Combattimento',stat:'kills',goal:300,ic:()=>KINDS.imp.fr[0]},
 {id:'mittente',n:'Al mittente',d:'Distruggi 20 proiettili nemici col bastone',c:'Combattimento',stat:'proj',goal:20,ic:()=>ICON.orb},
 {id:'spicciolo',n:'Primo spicciolo',d:'Raccogli la prima moneta',c:'Collezione',stat:'coins',goal:1,ic:()=>COIN},
 {id:'tesoriere',n:'Tesoriere del barone',d:'Raccogli 500 monete in totale',c:'Collezione',stat:'coins',goal:500,ic:()=>ICON.sack},
 {id:'tasca',n:'Tasca piena',d:'Raccogli tutte le monete di un livello',c:'Collezione',ic:()=>ICON.chest},
 {id:'enciclopedia',n:'Enciclopedia del reame',d:'Sblocca tutti i personaggi della galleria',c:'Collezione',ic:()=>ICON.book},
 {id:'cuor',n:'Cuor di leone',d:'Arriva a 5 cuori',c:'Collezione',ic:()=>HEART},
 {id:'ohm',n:'Ohm',d:'Subisci 100 danni in totale',c:'Segreto',stat:'damage',goal:100,secret:1,ic:()=>ICON.broken},
 {id:'ostinato',n:'Ostinato',d:'Vai in game over 5 volte',c:'Segreto',stat:'gameovers',goal:5,secret:1,ic:()=>KINDS.skull.fr[0]}];
const AST={u:{},s:{}};
try{const o=JSON.parse(localStorage.getItem('baruxAch')||'{}');Object.assign(AST.u,o.u||{});Object.assign(AST.s,o.s||{});}catch(e){}
function saveAch(){try{localStorage.setItem('baruxAch',JSON.stringify(AST));}catch(e){}}
const cheatsOn=()=>CHEATS.lives||CHEATS.god||CHEATS.kill;
const toasts=[];
function unlock(id){if(cheatsOn()||AST.u[id])return;AST.u[id]=Date.now();saveAch();toasts.push({id,t:0});sfx('life');}
function stat(k,n=1){if(cheatsOn())return;AST.s[k]=(AST.s[k]||0)+n;saveAch();for(const a of ACH)if(a.stat===k&&AST.s[k]>=a.goal)unlock(a.id);}
function checkGallery(){if(ROSTER.every(r=>r.id==='barux'||SEEN.has(r.id)))unlock('enciclopedia');}
let levelRun={damaged:false,stomped:false,kills:0,frames:0,coins:0,coinTotal:0,bossHit:false},gameRun={fromStart:false,deaths:0,damaged:false},selA=0;
function aRect(i){return {x:50+(i%7)*88,y:150+(i/7|0)*88,w:82,h:82};}
function cheatRect(i){return i<3?{x:240,y:160+i*112,w:800,h:96}:{x:490,y:500,w:300,h:64};}
let lives=3,coins=0,levelStartCoins=0,frame=0,stT=0,shake=0,checkpoint=null,menuSel=0,titleX=0;
const cam={x:0,y:0};
const floorY=(ROWS-3)*T;

function newPlayer(x,y){return {x,y,w:10,h:20,vx:0,vy:0,dir:1,onGround:false,coyote:0,jbuf:0,atk:0,atkCd:0,inv:0,knock:0,hp:3,safe:{x,y}};}
function spawnEnt(e){const o=Object.assign({},e,{alive:true,t0:Math.random()*200|0});
  if(e.t==='en'){const K=KINDS[e.kind];o.w=K.w;o.h=K.h;o.vx=0;o.vy=0;o.dir=-1;o.hp=K.hp;o.hurtT=0;o.ox=e.x;o.oy=e.y;o.st='idle';o.k=0;o.cd=0;}
  if(e.t==='mp'){o.x=e.x0;o.w=32;o.h=6;}
  if(e.t==='coin'){o.w=8;o.h=8;}
  if(e.t==='heart'){o.w=7;o.h=7;}
  if(e.t==='flag'){o.w=12;o.h=32;o.on=false;}
  return o;}
function loadLevel(i){
  lvlIndex=i;lvl=genLevel(i);[tiles,bg]=getTheme(i);
  ents=lvl.ents.map(spawnEnt);projs=[];parts=[];boss=null;fight=false;portal=null;
  checkpoint={x:lvl.start.x,y:lvl.start.y};P=newPlayer(checkpoint.x,checkpoint.y);
  levelRun={damaged:false,stomped:false,kills:0,frames:0,coins:0,coinTotal:ents.filter(e=>e.t==='coin').length,bossHit:false};
  levelStartCoins=coins;cam.x=0;cam.y=ROWS*T-H;
}

// ---------- collisioni ----------
function tileAt(c,r){if(c<0||c>=lvl.cols)return '#';if(r<0||r>=ROWS)return ' ';return lvl.g[r][c];}
function solidAt(x,y){return tileAt(Math.floor(x/T),Math.floor(y/T))==='#';}
function onewayAt(x,y){return tileAt(Math.floor(x/T),Math.floor(y/T))==='-';}
function moveBody(b){
  b.hitWall=0;
  b.x+=b.vx;
  const ys=[];for(let y=b.y+1;y<b.y+b.h-1;y+=8)ys.push(y);ys.push(b.y+b.h-1);
  if(b.vx>0){if(ys.some(y=>solidAt(b.x+b.w,y))){b.x=Math.floor((b.x+b.w)/T)*T-b.w-.01;b.vx=0;b.hitWall=1;}}
  else if(b.vx<0){if(ys.some(y=>solidAt(b.x,y))){b.x=(Math.floor(b.x/T)+1)*T;b.vx=0;b.hitWall=-1;}}
  const prevBot=b.y+b.h;
  b.y+=b.vy;b.onGround=false;
  const xs=[];for(let x=b.x+1;x<b.x+b.w-1;x+=8)xs.push(x);xs.push(b.x+b.w-1);
  if(b.vy>=0){const bot=b.y+b.h,r=Math.floor(bot/T);
    if(xs.some(x=>solidAt(x,bot)||(onewayAt(x,bot)&&prevBot<=r*T+.5))){b.y=r*T-b.h;b.vy=0;b.onGround=true;}}
  else if(xs.some(x=>solidAt(x,b.y))){b.y=(Math.floor(b.y/T)+1)*T;b.vy=0;}
}

// ---------- particelle ----------
function puff(x,y,col,n=8,sp=1.6,g=.05){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=Math.random()*sp;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-.5,life:20+Math.random()*20|0,col,g});}}
function updateParts(){for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.life--;}parts=parts.filter(p=>p.life>0);}

// ---------- giocatore ----------
function hurt(srcX){
  if(CHEATS.god||P.inv>0||state!=='play')return;
  P.hp--;rumble(180,.6);stat('damage');levelRun.damaged=true;gameRun.damaged=true;if(fight)levelRun.bossHit=true;P.inv=80;P.vy=-3.5;P.vx=(P.x+P.w/2<srcX)?-2.2:2.2;P.knock=14;shake=7;sfx('hurt');
  puff(P.x+5,P.y+10,'#ffffff',6);
  if(P.hp<=0)die();
}
function die(){
  if(state!=='play')return;
  state='dead';stT=0;lives--;gameRun.deaths++;P.vy=-5;P.vx=0;sfx('die');music(-1);
}
function respawn(){
  if(lives<0){state='gameover';stT=0;stat('gameovers');return;}
  if(fight){for(let r=0;r<ROWS;r++)lvl.g[r][lvl.A]=r>=ROWS-3?'#':' ';fight=false;boss=null;}
  ents=ents.filter(e=>e.t!=='en').concat(lvl.ents.filter(e=>e.t==='en').map(spawnEnt));projs=[];
  P=newPlayer(checkpoint.x,checkpoint.y);P.inv=60;
  state='play';music(THEMES[lvlIndex].song);
}
function updatePlayer(){
  const p=P;
  const ax=(keys.left?-1:0)+(keys.right?1:0);
  if(p.knock>0){p.knock--;}
  else if(ax){p.vx+=ax*.35;p.dir=ax;}
  else p.vx*=.72;
  p.vx=clamp(p.vx,-1.9,1.9);if(Math.abs(p.vx)<.05)p.vx=0;
  p.coyote=p.onGround?6:p.coyote-1;
  if(hit.jump)p.jbuf=7;else p.jbuf--;
  if(p.jbuf>0&&p.coyote>0){p.vy=-6.2;p.jbuf=0;p.coyote=0;sfx('jump');}
  if(!keys.jump&&p.vy<-2.6)p.vy=-2.6;
  p.vy=Math.min(p.vy+.35,6);
  if(p.atkCd>0)p.atkCd--;
  if(p.atk>0)p.atk--;
  if(hit.attack&&p.atkCd<=0){p.atk=14;p.atkCd=20;p.air=!p.onGround;sfx(p.air?'slash':'swing');}
  if(p.inv>0)p.inv--;
  const prevBot=p.y+p.h;
  moveBody(p);
  p.ride=null;
  if(!p.onGround&&p.vy>=0)for(const m of ents){if(m.t!=='mp')continue;
    if(p.x+p.w>m.x+1&&p.x<m.x+m.w-1&&prevBot<=m.y+2.5&&p.y+p.h>=m.y){p.y=m.y-p.h;p.vy=0;p.onGround=true;p.ride=m;break;}}
  if(p.onGround&&!p.ride&&solidAt(p.x+1,p.y+p.h+1)&&solidAt(p.x+p.w-1,p.y+p.h+1))p.safe={x:p.x,y:p.y};
  if(p.onGround&&Math.abs(p.vx)>.3)p.anim++;else p.anim=0;
}

// ---------- boss ----------
function arena(){return {x0:(lvl.A+1)*T,x1:(lvl.A+19)*T};}
function startFight(){
  fight=true;levelRun.bossHit=false;for(let r=0;r<ROWS;r++)lvl.g[r][lvl.A]='#';
  const d=BOSS_DEF[lvlIndex],{x1}=arena();
  boss={i:lvlIndex,x:x1-50-d.w,y:floorY-d.h,w:d.w,h:d.h,vx:0,vy:0,hp:d.hp,max:d.hp,t:0,k:0,st:'idle',dir:-1,face:-1,inv:0,intro:120,alpha:1,visible:true};
  if(boss.i===1)boss.baseY=floorY-d.h-4;
  if(boss.i===4)boss.y=floorY-104;
  if(boss.i===5)boss.y=floorY-84;
  music(3);sfx('roar');shake=6;
}
function damageBoss(){
  boss.hp=CHEATS.kill?0:boss.hp-1;boss.inv=30;sfx('bossHit');shake=5;puff(boss.x+boss.w/2,boss.y+boss.h/2,'#ffd84a',10,2.2);
  if(boss.hp<=0){boss.st='dying';boss.k=0;projs=[];ents.forEach(e=>{if(e.summoned&&e.alive){e.alive=false;puff(e.x+5,e.y+6,'#c42c38',8);}});}
}
function updateBoss(){
  const b=boss;
  if(b.intro>0){b.intro--;if(b.i===0||b.i===2||b.i===3){b.vy=Math.min(b.vy+.35,6);b.vx=0;moveBody(b);}return;}
  if(b.inv>0)b.inv--;
  b.t++;
  const {x0,x1}=arena();
  const px=P.x+P.w/2,bx=b.x+b.w/2,toP=px<bx?-1:1,low=b.hp<=b.max/2;
  if(b.st==='dying'){
    b.k++;shake=4;
    if(b.k%5===0)puff(b.x+Math.random()*b.w,b.y+Math.random()*b.h,['#ffd84a','#ff6020','#ffffff'][b.k%3],10,2.5);
    if(b.k%18===0)sfx('boom');
    if(b.k>110){puff(bx,b.y+b.h/2,'#ffffff',30,3.5);sfx('portal');
      portal={x:(lvl.A+10)*T-12,y:floorY-36,w:24,h:36,t:0};boss=null;music(THEMES[lvlIndex].song);}
    return;
  }
  switch(b.i){
  case 0:{ // Pushing: cammina, salta, lancia barili
    b.vx=b.dir*(low?1.1:.7);b.vy=Math.min(b.vy+.35,6);
    if(b.onGround&&b.t%160===80)b.vy=-5;
    moveBody(b);if(b.hitWall)b.dir*=-1;
    b.face=toP;
    if(b.t%(low?70:100)===0){const n=low?2:1;for(let k=0;k<n;k++)projs.push({type:'barrel',coin:true,x:bx-5,y:b.y,w:10,h:10,vx:toP*(1.1+k*.9+Math.random()*.4),vy:-4.5,life:420,rot:0});sfx('throw');}
    break;}
  case 1:{ // Gankàla: teletrasporto, rovi dal terreno, sfere
    b.y=b.baseY+Math.sin(b.t*.05)*3;
    if(b.st==='idle'){b.face=toP;b.alpha=1;b.visible=true;
      if(b.t%(low?60:85)===0){const xs=low?[px-42,px-6,px+30]:[px-6];xs.forEach(x=>projs.push({type:'thorn',x:clamp(x,x0,x1-12),y:floorY-28,w:12,h:28,ph:0,warn:40,life:999}));sfx('cast');}
      if(b.t%110===55){const a=Math.atan2(P.y+10-(b.y+12),px-bx);projs.push({type:'orb',x:bx-4,y:b.y+10,w:8,h:8,vx:Math.cos(a)*1.6,vy:Math.sin(a)*1.6,life:300});sfx('cast');}
      if(b.t%170===0){b.st='fade';b.k=0;}
    } else if(b.st==='fade'){b.k++;b.alpha=1-b.k/20;b.visible=b.k<8;
      if(b.k>=20){let nx,tries=0;do{nx=x0+10+Math.random()*(x1-x0-20-b.w);}while(Math.abs(nx+b.w/2-px)<70&&tries++<30);b.x=nx;b.st='appear';b.k=0;}
    } else if(b.st==='appear'){b.k++;b.alpha=b.k/20;b.visible=b.k>12;if(b.k>=20)b.st='idle';}
    break;}
  case 2:{ // Pushatomìdir: grandi salti e onde d'urto
    if(b.st==='idle'){b.vx*=.8;b.face=toP;b.k++;if(b.k>(low?35:55)&&b.onGround){b.st='air';b.vy=-6.8;b.vx=clamp((px-bx)/55,-2.6,2.6);b.k=0;sfx('jump');}}
    b.vy=Math.min(b.vy+.3,7);moveBody(b);
    if(b.st==='air'&&b.onGround){b.k++;if(b.k>2){b.st='idle';b.k=0;b.vx=0;shake=10;sfx('slam');
      projs.push({type:'wave',x:b.x-10,y:floorY-8,w:10,h:8,vx:-2.2,life:150},{type:'wave',x:b.x+b.w,y:floorY-8,w:10,h:8,vx:2.2,life:150});}}
    break;}
  case 3:{ // Ser Rekter: mira, carica, si stordisce contro il muro
    if(b.st==='idle'||b.st==='aim'){b.st='aim';b.vx=0;b.face=toP;b.k++;if(b.k>(low?40:65)){b.st='charge';b.dir=b.face;b.k=0;sfx('charge');}}
    else if(b.st==='charge')b.vx=b.dir*(low?4:3.3);
    else if(b.st==='stun'){b.vx=0;b.k++;if(b.k>(low?55:80)){b.st='aim';b.k=0;}}
    b.vy=Math.min(b.vy+.35,6);moveBody(b);
    if(b.st==='charge'&&b.hitWall){b.st='stun';b.k=0;shake=12;sfx('slam');puff(b.dir>0?b.x+b.w:b.x,b.y+14,'#c8ccd8',12,2);}
    if(b.st!=='stun'){const lb={x:b.face>0?b.x+b.w:b.x-16,y:b.y+14,w:16,h:4};if(overlap(P,lb))hurt(bx);}
    break;}
  case 4:{ // Griefilla: volteggia, strilla, picchiata
    const homeY=floorY-104,cx=(x0+x1)/2;
    const tx=cx-b.w/2+Math.sin(b.t*.02)*100;
    if(b.st==='idle'||b.st==='hover'){b.st='hover';b.k++;b.x+=(tx-b.x)*.2;b.y=homeY+Math.sin(b.t*.09)*6;
      if(b.k%(low?45:65)===0){for(const vx of [-.9,0,.9])projs.push({type:'shriek',x:bx-4,y:b.y+18,w:8,h:8,vx,vy:1.6,life:200});sfx('screech');}
      if(b.k>(low?120:170)){b.st='dive';b.k=0;const dx=px-bx,dy=floorY-26-(b.y+b.h/2),d=Math.hypot(dx,dy)||1;b.vx=dx/d*3.4;b.vy=dy/d*3.4;sfx('screech');}}
    else if(b.st==='dive'){b.x=clamp(b.x+b.vx,x0,x1-b.w);b.y+=b.vy;if(b.y+b.h>=floorY-2){b.y=floorY-2-b.h;b.st='rest';b.k=0;shake=5;}}
    else if(b.st==='rest'){b.k++;if(b.k>(low?35:50))b.st='rise';}
    else if(b.st==='rise'){b.y-=1.6;b.x+=(tx-b.x)*.05;if(b.y<=homeY){b.st='hover';b.k=1;}}
    b.face=toP;
    break;}
  case 5:{ // Anlaucer
    const homeY=floorY-84,cx=(x0+x1)/2;
    if(b.st==='idle'||b.st==='hover'){b.st='hover';b.k++;b.face=toP;
      b.x+=(cx-b.w/2+Math.sin(b.t*.015)*90-b.x)*.05;b.y+=(homeY+Math.sin(b.t*.06)*8-b.y)*.1;
      if(b.k>(low?55:90)){b.k=0;const r=Math.random(),imps=ents.filter(e=>e.alive&&e.summoned).length;
        if(r<.4)b.st='fire';else if(r<.62&&imps<3)b.st='summon';else{b.st='swoop';b.dir=bx<cx?1:-1;b.ph=0;}}}
    else if(b.st==='fire'){b.k++;b.face=toP;
      if(b.k===20||b.k===50||(low&&b.k===80)){const n=low?7:5,base=Math.atan2(P.y+10-(b.y+b.h/2),px-bx);
        for(let j=0;j<n;j++){const a=base+(j-(n-1)/2)*.22;projs.push({type:'fire',x:bx-4,y:b.y+b.h/2-4,w:8,h:8,vx:Math.cos(a)*1.7,vy:Math.sin(a)*1.7,life:300});}sfx('fire');}
      if(b.k>(low?100:75)){b.st='hover';b.k=0;}}
    else if(b.st==='summon'){b.k++;if(b.k===30){for(const sx of [x0+20,x1-32]){const e=spawnEnt({t:'en',kind:'imp',x:sx,y:floorY-60});e.summoned=true;e.dir=sx<cx?1:-1;ents.push(e);puff(sx+5,floorY-54,'#ff6020',12,2);}sfx('cast');}if(b.k>60){b.st='hover';b.k=0;}}
    else if(b.st==='swoop'){const sx=b.dir>0?x0+4:x1-b.w-4;b.face=b.dir;
      if(b.ph===0){b.x+=(sx-b.x)*.08;b.y+=(homeY-b.y)*.08;if(Math.abs(sx-b.x)<3)b.ph=1;}
      else if(b.ph===1){b.y+=2.2;if(b.y+b.h>=floorY-4){b.y=floorY-4-b.h;b.ph=2;sfx('roar');}}
      else if(b.ph===2){b.x+=b.dir*(low?3.2:2.5);if(b.x<=x0+2||b.x+b.w>=x1-2)b.ph=3;}
      else{b.y-=1.8;if(b.y<=homeY){b.st='hover';b.k=0;}}}
    if(low&&b.t%6===0)parts.push({x:b.x+Math.random()*b.w,y:b.y+b.h,vx:0,vy:-.6,life:25,col:'#ff6020',g:0});
    break;}
  }
  // contatto con il giocatore
  if(b.visible!==false){
    if(atkBox&&overlap(atkBox,b)&&b.inv<=0)damageBoss();
    else if(overlap(P,b)&&boss&&boss.st!=='dying'){
      const stomp=P.vy>.5&&P.y+P.h-b.y<10;
      if(stomp){levelRun.stomped=true;if(b.inv<=0)damageBoss();P.vy=keys.jump?-6:-5;}
      else hurt(b.x+b.w/2);
    }
  }
}

// ---------- entità ----------
function killEnt(e,src){markSeen(e.kind);checkGallery();e.alive=false;stat('kills');if(src==='air')stat('air');if(src==='stomp')stat('stomp');if(!e.summoned)levelRun.kills++;sfx('kill');puff(e.x+e.w/2,e.y+e.h/2,KINDS[e.kind].col,10,2);puff(e.x+e.w/2,e.y+e.h/2,'#ffffff',4,1);}
function hitEnemy(e,fromX,src){e.hp=CHEATS.kill?0:e.hp-1;e.hurtT=20;if(e.hp<=0)killEnt(e,src);else{sfx('bossHit');puff(e.x+e.w/2,e.y+e.h/2,'#ffffff',5,1.4);if(!KINDS[e.kind].fly){e.vx=(e.x+e.w/2<fromX?-1:1)*2;e.vy=-2;}}}
function addCoin(){coins++;stat('coins');levelRun.coins++;sfx('coin');if(coins%100===0){lives++;sfx('life');}}
function edgeAhead(e){const fx=e.dir>0?e.x+e.w+1:e.x-1;return !solidAt(fx,e.y+e.h+2)&&!onewayAt(fx,e.y+e.h+2);}
function updateMP(e){e.t0++;const ox=e.x;e.x=e.x0+(Math.sin(e.t0*e.sp)*.5+.5)*(e.x1-e.x0);if(P.ride===e)P.x+=e.x-ox;}
function updateEnemy(e){
  const K=KINDS[e.kind],px=P.x+P.w/2,ex=e.x+e.w/2,dx=px-ex,dy=(P.y+P.h)-(e.y+e.h);
  if(e.hurtT>0)e.hurtT--;
  const grav=()=>{e.vy=Math.min(e.vy+.35,6);};
  switch(K.ai){
  case 'walk':
    if(e.hurtT<=10)e.vx=e.dir*K.spd*(e.summoned?1.4:1);grav();moveBody(e);
    if(e.hitWall)e.dir*=-1;else if(e.onGround&&edgeAhead(e))e.dir*=-1;
    break;
  case 'throw':
    e.vx*=.8;grav();moveBody(e);e.dir=dx<0?-1:1;
    if(Math.abs(dx)<170&&Math.abs(dy)<90&&e.t0%130===0){projs.push({type:'barrel',coin:true,x:ex-5,y:e.y-6,w:10,h:10,vx:clamp(dx/55,-2.2,2.2),vy:-4.2,life:220,rot:0});sfx('throw');}
    break;
  case 'hop':
    grav();
    if(e.onGround){e.vx*=.6;e.k++;if(e.k>45){e.k=0;if(Math.abs(dx)<150)e.dir=dx<0?-1:1;e.vy=-4.6;e.vx=e.dir*1.3;}}
    moveBody(e);if(e.hitWall)e.dir*=-1;
    break;
  case 'charge':
    if(e.st==='charge'){e.vx=e.dir*2.6;e.k++;if(e.k>70){e.st='rest';e.k=0;}}
    else if(e.st==='rest'){e.vx=0;e.k++;if(e.k>45)e.st='idle';}
    else{e.vx=e.dir*.4;if(Math.abs(dy)<24&&Math.abs(dx)<110&&Math.sign(dx)===e.dir){e.st='charge';e.k=0;sfx('charge');}}
    grav();moveBody(e);
    if(e.hitWall){e.dir*=-1;if(e.st==='charge'){e.st='rest';e.k=0;}}
    else if(e.onGround&&edgeAhead(e)){if(e.st==='charge'){e.st='rest';e.k=0;e.vx=0;}else e.dir*=-1;}
    break;
  case 'sine':case 'caster':
    e.x=e.ox+Math.sin(e.t0*K.fx)*K.ax;e.y=e.oy+Math.sin(e.t0*.08)*K.ay;e.dir=dx<0?-1:1;
    if(K.ai==='caster'&&Math.abs(dx)<170&&Math.abs(dy)<120&&e.t0%140===0){const a=Math.atan2(P.y+10-(e.y+5),px-ex);projs.push({type:'orb',x:ex-4,y:e.y+2,w:8,h:8,vx:Math.cos(a)*1.3,vy:Math.sin(a)*1.3,life:240});sfx('cast');}
    break;
  case 'dive':
    if(e.cd>0)e.cd--;
    if(e.st==='dive'){e.x+=e.vx;e.y+=e.vy;e.k++;if(e.k>45||solidAt(ex,e.y+e.h)){e.st='back';}}
    else if(e.st==='back'){const bx=e.ox-e.x,by=e.oy-e.y,d=Math.hypot(bx,by);if(d<2){e.st='idle';e.cd=80;}else{e.x+=bx/d*1.2;e.y+=by/d*1.2;}}
    else{e.x=e.ox+Math.sin(e.t0*.03)*12;e.y=e.oy+Math.sin(e.t0*.09)*4;e.dir=dx<0?-1:1;
      if(e.cd<=0&&Math.abs(dx)<80&&dy>0&&dy<130){const d=Math.hypot(dx,dy+10)||1;e.vx=dx/d*2.7;e.vy=(dy+10)/d*2.7;e.st='dive';e.k=0;sfx('screech');}}
    break;
  }
  if(e.y>ROWS*T){e.alive=false;return;}
  if(atkBox&&overlap(atkBox,e)){if(e.hurtT<=0)hitEnemy(e,P.x+P.w/2,P.air?'air':'cane');return;}
  if(overlap(P,e)){
    const stomp=P.vy>.5&&P.y+P.h-e.y<9;
    if(stomp&&!K.spiky){levelRun.stomped=true;if(e.hurtT<=0)hitEnemy(e,px,'stomp');P.vy=keys.jump?-6:-4.2;}
    else if(stomp){hurt(ex);if(state==='play')P.vy=-4.5;}
    else if(e.hurtT<=0)hurt(ex);
  }
}
function updateEnts(){
  for(const e of ents){
    if(!e.alive||e.t==='mp')continue;
    e.t0++;
    if(e.t==='en')updateEnemy(e);
    else if(e.t==='coin'){if(overlap(P,e)){e.alive=false;addCoin();puff(e.x+4,e.y+4,'#fff2b0',5,1);}}
    else if(e.t==='heart'){if(overlap(P,e)){e.alive=false;P.hp=Math.min(5,P.hp+1);if(P.hp>=5)unlock('cuor');sfx('heart');puff(e.x+3,e.y+3,'#ff9aa8',8,1.2);}}
    else if(e.t==='flag'){if(!e.on&&overlap(P,e)){e.on=true;if(e.x>checkpoint.x)checkpoint={x:e.x,y:e.y+12};sfx('flag');puff(e.x+6,e.y,'#e8b84a',12,1.5);}}
  }
  ents=ents.filter(e=>e.alive||e.t==='flag');
}
function updateProjs(){
  for(const q of projs){
    q.life--;
    if(q.type==='barrel'){q.vy=Math.min(q.vy+.25,6);moveBody(q);q.rot+=q.vx*.3;if(q.hitWall||q.y>ROWS*T){q.life=0;puff(q.x+5,q.y+5,q.coin?'#f0c040':'#8a5428',8,1.5);}}
    else if(q.type==='wave'){q.x+=q.vx;if(solidAt(q.vx>0?q.x+q.w:q.x,q.y+4))q.life=0;}
    else if(q.type==='thorn'){q.ph++;if(q.ph===q.warn){sfx('kill');}if(q.ph>q.warn+42)q.life=0;}
    else{q.x+=q.vx;q.y+=q.vy;if(solidAt(q.x+q.w/2,q.y+q.h/2)){q.life=0;puff(q.x+4,q.y+4,q.type==='fire'?'#ff6020':'#9ae02a',5,1);}
      if(q.type==='fire'&&frame%3===0)parts.push({x:q.x+4,y:q.y+4,vx:0,vy:0,life:10,col:'#ff9030',g:0});}
    if(q.life<=0)continue;
    if(q.type==='thorn'){if(q.ph>q.warn){const hg=Math.min(28,(q.ph-q.warn)*4);if(overlap(P,{x:q.x+1,y:floorY-hg,w:10,h:hg}))hurt(q.x+6);}}
    else{
      if(atkBox&&q.type!=='wave'&&overlap(atkBox,q)){q.life=0;stat('proj');puff(q.x+4,q.y+4,'#ffffff',6,1.4);sfx('kill');continue;}
      if(overlap(P,q)){hurt(q.x+q.w/2);if(q.type!=='wave'&&q.type!=='barrel')q.life=0;}
    }
  }
  projs=projs.filter(q=>q.life>0);
}
function spikeCheck(){
  if(CHEATS.god)return;
  const c0=Math.floor(P.x/T),c1=Math.floor((P.x+P.w-1)/T),r0=Math.floor(P.y/T),r1=Math.floor((P.y+P.h-1)/T);
  for(let r=r0;r<=r1;r++)for(let c=c0;c<=c1;c++)if(tileAt(c,r)==='^'&&P.y+P.h>r*T+9){hurt(c*T+8);if(state==='play')P.vy=-5;return;}
}
function camera(){
  let tx,ty=P.y-92;
  if(fight)tx=lvl.A*T;
  else tx=P.x+P.w/2-W/2+P.dir*24;
  tx=clamp(tx,0,lvl.cols*T-W);ty=clamp(ty,0,ROWS*T-H);
  cam.x+=(tx-cam.x)*(fight?.12:.15);cam.y+=(ty-cam.y)*.1;
}
function levelClear(){markSeen('boss'+lvlIndex);
  unlock('b'+lvlIndex);
  if(!levelRun.damaged)unlock('intoccabile');
  if(!levelRun.bossHit)unlock('duello');
  if(levelRun.frames<7200)unlock('corsa');
  if(!levelRun.stomped)unlock('bastone');
  if(levelRun.kills===0)unlock('pacifista');
  if(levelRun.coinTotal>0&&levelRun.coins>=levelRun.coinTotal)unlock('tasca');
  if(lvlIndex===5&&gameRun.fromStart&&gameRun.deaths===0)unlock('macchia');
  if(lvlIndex===5&&gameRun.fromStart&&!gameRun.damaged)unlock('acciaio');
  checkGallery();
  state='clear';stT=0;save(lvlIndex+1);sfx('portal');}

function updatePlay(){
  levelRun.frames++;
  if(hit.pause){state='pause';pauseSel=0;return;}
  for(const m of ents)if(m.t==='mp')updateMP(m);
  updatePlayer();
  atkBox=(P.atk>3&&P.atk<13)?(P.air?{x:P.dir>0?P.x-2:P.x-18,y:P.y-8,w:30,h:38}:{x:P.dir>0?P.x+P.w-2:P.x-16,y:P.y+5,w:18,h:13}):null;
  updateEnts();
  if(!fight&&!portal&&P.x>(lvl.A+3)*T)startFight();
  if(boss)updateBoss();
  if(state!=='play')return;
  updateProjs();
  updateParts();
  if(portal){portal.t++;if(overlap(P,portal)){levelClear();return;}}
  spikeCheck();
  if(P.y+P.h>ROWS*T-4){if(CHEATS.god){P.x=P.safe.x;P.y=P.safe.y;P.vx=0;P.vy=0;P.inv=40;puff(P.x+5,P.y+10,'#e8b84a',10,1.5);}else{P.hp=0;die();}}
  camera();
}

// ---------- ciclo ----------
function step(){
  frame++;
  pollPad();if(padMsgT>0)padMsgT--;
  if(toasts.length){toasts[0].t++;if(toasts[0].t>210)toasts.shift();}
  if(shake>0){shake*=.86;if(shake<.4)shake=0;}
  switch(state){
  case 'title':{titleX+=.4;const items=titleItems(),n=items.length;
    if(menuSel>=n)menuSel=0;
    if(hit.down||hit.right)menuSel=(menuSel+1)%n;
    if(hit.up||hit.left)menuSel=(menuSel+n-1)%n;
    if(hit.tap&&tapPos){items.forEach((it,i)=>{if(Math.abs(tapPos.y-(TITLE_Y+i*50))<28&&Math.abs(tapPos.x-820)<240){menuSel=i;it.act();}});break;}
    if(hit.cont&&loadSave()>0){startGame(true);break;}
    if(menuOK())items[menuSel].act();
    break;}
  case 'levels':{titleX+=.4;const max=loadSave();
    if(hit.right)selL=Math.min(5,selL+1);if(hit.left)selL=Math.max(0,selL-1);
    if(hit.down)selL=Math.min(5,selL+3);if(hit.up)selL=Math.max(0,selL-3);
    if(hit.pause){state='title';break;}
    if(hit.tap&&tapPos){if(backHit()){state='title';break;}for(let i=0;i<6;i++){const r=levelRect(i);if(inRect(tapPos,r)){selL=i;if(i<=max)startLevel(i);}}break;}
    if(menuOK()&&selL<=max)startLevel(selL);
    break;}
  case 'gallery':{titleX+=.4;const n=ROSTER.length;
    if(hit.right)selG=Math.min(n-1,selG+1);if(hit.left)selG=Math.max(0,selG-1);
    if(hit.down)selG=Math.min(n-1,selG+G_COLS);if(hit.up)selG=Math.max(0,selG-G_COLS);
    if(hit.pause||hit.start){state='title';break;}
    if(hit.tap&&tapPos){if(backHit()){state='title';break;}for(let i=0;i<n;i++)if(inRect(tapPos,galRect(i)))selG=i;}
    break;}
  case 'ach':{titleX+=.4;const n=ACH.length;
    if(hit.right)selA=Math.min(n-1,selA+1);if(hit.left)selA=Math.max(0,selA-1);
    if(hit.down)selA=Math.min(n-1,selA+7);if(hit.up)selA=Math.max(0,selA-7);
    if(hit.pause||hit.start){state='title';break;}
    if(hit.tap&&tapPos){if(backHit()){state='title';break;}for(let i=0;i<n;i++)if(inRect(tapPos,aRect(i)))selA=i;}
    break;}
  case 'cheats':{if(cheatsFrom==='title')titleX+=.4;
    if(hit.down)cheatSel=(cheatSel+1)%4;if(hit.up)cheatSel=(cheatSel+3)%4;
    let act=-1;
    if(hit.pause)act=3;
    else if(hit.tap&&tapPos){if(backHit())act=3;else for(let i=0;i<4;i++)if(inRect(tapPos,cheatRect(i))){cheatSel=i;act=i;}}
    else if(menuOK())act=cheatSel;
    if(act>=0&&act<3){const k=CHEAT_LIST[act].k;CHEATS[k]=!CHEATS[k];saveCheats();sfx(CHEATS[k]?'flag':'kill');
      if(k==='lives'&&CHEATS.lives&&cheatsFrom==='pause')lives=Math.max(lives,99);}
    if(act===3)state=cheatsFrom;
    break;}
  case 'intro':stT++;camera0();if(confirmHit()){if(stT<INTRO.length*45)stT=INTRO.length*45;else{state='card';stT=0;}}break;
  case 'card':stT++;updateParts();camera();if((stT>30&&confirmHit())||stT>170){state='play';stT=0;}break;
  case 'play':updatePlay();break;
  case 'pause':{
    if(hit.down)pauseSel=(pauseSel+1)%4;if(hit.up)pauseSel=(pauseSel+3)%4;
    if(hit.pause){state='play';break;}
    let act=-1;
    if(hit.tap&&tapPos){for(let i=0;i<4;i++)if(Math.abs(tapPos.y-(PAUSE_Y+i*62))<28&&Math.abs(tapPos.x-640)<240)act=i;}
    else if(menuOK())act=pauseSel;
    if(act===0)state='play';
    else if(act===1){coins=levelStartCoins;loadLevel(lvlIndex);state='card';stT=0;music(THEMES[lvlIndex].song);}
    else if(act===2){cheatsFrom='pause';cheatSel=0;state='cheats';}
    else if(act===3){coins=levelStartCoins;state='title';menuSel=0;music(0);}
    break;}
  case 'dead':stT++;P.vy+=.3;P.y+=P.vy;updateParts();if(stT>100)respawn();break;
  case 'clear':stT++;updateParts();if(stT>50&&confirmHit()){if(lvlIndex>=5){state='win';stT=0;music(0);}else{loadLevel(lvlIndex+1);state='card';stT=0;music(THEMES[lvlIndex].song);}}break;
  case 'gameover':stT++;if(stT>50&&confirmHit()){lives=startLives();coins=levelStartCoins;loadLevel(lvlIndex);state='card';stT=0;music(THEMES[lvlIndex].song);}break;
  case 'win':stT++;updateParts();if(frame%10===0)puff(Math.random()*W,Math.random()*H*.6,['#e8b84a','#d8344a','#2fb06a','#ffffff'][frame/10%4|0],10,2);if(stT>80&&confirmHit()){state='title';menuSel=0;music(0);}break;
  }
  for(const k in hit)hit[k]=false;
}
const TITLE_Y=378,PAUSE_Y=300,G_COLS=5;
function titleItems(){const sv=loadSave(),it=[{label:'Nuova partita',act:()=>startGame(false)}];
  if(sv>0)it.push({label:'Continua · Livello '+(sv+1),act:()=>startGame(true)});
  it.push({label:'Seleziona livello',act:()=>{state='levels';selL=Math.min(loadSave(),5);}});
  it.push({label:'Personaggi',act:()=>{state='gallery';selG=0;}});
  it.push({label:'Obiettivi',act:()=>{state='ach';selA=0;}});
  it.push({label:'Trucchi',act:()=>{cheatsFrom='title';cheatSel=0;state='cheats';}});
  return it;}
function startLevel(i){gameRun={fromStart:false,deaths:0,damaged:false};lives=startLives();coins=0;loadLevel(i);state='card';stT=0;music(THEMES[i].song);}
const inRect=(p,r)=>p.x>=r.x&&p.x<=r.x+r.w&&p.y>=r.y&&p.y<=r.y+r.h;
const backHit=()=>tapPos&&inRect(tapPos,{x:30,y:30,w:230,h:60});
function levelRect(i){return {x:70+(i%3)*390,y:150+(i/3|0)*250,w:360,h:220};}
function galRect(i){return {x:50+(i%G_COLS)*102,y:140+(i/G_COLS|0)*102,w:92,h:92};}
function camera0(){cam.x=0;cam.y=ROWS*T-H;}
function startGame(cont){
  lives=startLives();coins=0;gameRun={fromStart:!cont,deaths:0,damaged:false};
  if(cont){loadLevel(loadSave());state='card';}
  else{loadLevel(0);state='intro';}
  stT=0;music(THEMES[lvlIndex].song);
}

// ---------- disegno ----------
function drawBG(cx,cy){
  ctx.drawImage(bg.sky,0,0);
  for(const L of bg.Ls){const ox=-(((cx*L.f)%LW)+LW)%LW,oy=Math.round(-cy*L.f*.4)-(LH-H)+Math.round(L.f*20);
    ctx.drawImage(L.c,Math.floor(ox),oy);ctx.drawImage(L.c,Math.floor(ox)+LW,oy);}
  const t=bg===BGS[2]?2:bg===BGS[5]?5:bg===BGS[3]?3:-1;
  if(t===2){ctx.fillStyle='#b8c89a';ctx.globalAlpha=.09;for(let b=0;b<3;b++)for(let x=0;x<W;x+=4){const y=90+b*28+Math.sin((x+frame*(.3+b*.2)+b*80)/34)*5;ctx.fillRect(x,y,4,12);}ctx.globalAlpha=1;}
  if(t===5||t===3){for(let i=0;i<22;i++){const x=(i*53+frame*.25*(1+i%3))%W,y=H-((frame*.45*(1+i%2)+i*37)%(H+20));px(x,y,1,1,t===5?(i%2?'#ff9030':'#ffd060'):'#6a5a8a');}}
}
function drawDeco(k,x,y){
  switch(lvlIndex){
  case 0:if(k===0){px(x+7,y-20,2,20,'#1a1218');px(x+4,y-25,8,6,'#1a1218');px(x+5,y-24,6,4,frame%40<20?'#ffd060':'#f0a040');}
    else if(k===1){px(x+3,y-11,10,11,'#1a0c06');px(x+4,y-10,8,9,'#7a4a22');px(x+4,y-8,8,1,'#3a2214');px(x+4,y-4,8,1,'#3a2214');px(x+5,y-10,1,9,'#9a6234');}
    else{px(x+4,y-6,8,6,'#5a3020');px(x+5,y-9,2,3,'#3a8a3a');px(x+9,y-10,2,4,'#3a8a3a');px(x+5,y-11,2,2,'#e04a5a');px(x+9,y-12,2,2,'#e8c040');}break;
  case 1:if(k===0){px(x+7,y-5,2,5,'#e8dcc0');px(x+4,y-9,8,4,'#c8303a');px(x+5,y-10,6,1,'#c8303a');px(x+6,y-8,1,1,'#ffffff');px(x+9,y-9,1,1,'#ffffff');}
    else if(k===1){for(let i=0;i<5;i++)px(x+4+i*2,y-3-(i%2)*3,1,3+(i%2)*3,'#4aa04a');}
    else{px(x+8,y-12,1,12,'#2f7a34');for(let j=0;j<4;j++){px(x+5-j%2,y-11+j*3,3,1,'#3a8a3a');px(x+9,y-10+j*3,3,1,'#3a8a3a');}}break;
  case 2:if(k===0){for(let i=0;i<4;i++){px(x+4+i*3,y-14+i*2,1,14-i*2,'#5a6a2a');}px(x+6,y-15,2,4,'#3a2414');}
    else if(k===1){px(x+5,y-5,6,5,'#d8d4c0');px(x+6,y-4,1,1,'#1a1a10');px(x+9,y-4,1,1,'#1a1a10');px(x+7,y-1,2,1,'#1a1a10');}
    else{px(x+3,y-2,10,2,'#2a4a1a');px(x+6,y-4,4,2,'#3a6a2a');}break;
  case 3:if(k===0){px(x+5,y-8,3,8,'#8a5ad0');px(x+8,y-12,3,12,'#a87ae8');px(x+11,y-6,2,6,'#8a5ad0');px(x+9,y-11,1,3,'#ffffff');}
    else if(k===1){px(x+3,y-5,10,5,'#3a3e52');px(x+5,y-7,6,2,'#4a4e62');}
    else{px(x+2,y-8,12,6,'#3a2616');px(x+3,y-7,10,4,'#5a3a20');px(x+4,y-2,2,2,'#1a1a1a');px(x+10,y-2,2,2,'#1a1a1a');px(x+4,y-9,8,2,'#7a809a');}break;
  case 4:if(k===0){px(x+7,y-8,2,8,'#e8e0c8');px(x+7,y-11,2,3,frame%30<15?'#ffd060':'#ff9030');px(x+5,y-1,6,1,'#8a6a2a');}
    else if(k===1){px(x+3,y-6,10,6,'#5a3a20');px(x+4,y-5,8,1,'#8a2a2a');px(x+4,y-3,8,1,'#2a4a8a');}
    else{px(x+5,y-7,6,5,'#b08a3a');px(x+4,y-2,8,2,'#b08a3a');px(x+7,y-8,2,1,'#b08a3a');}break;
  case 5:if(k===0){px(x+5,y-5,6,5,'#d8d4c0');px(x+6,y-4,1,1,'#1a0004');px(x+9,y-4,1,1,'#1a0004');}
    else if(k===1){px(x+5,y-6,6,6,'#2a1a1a');px(x+4,y-7,8,2,'#4a2a2a');const f=frame%12<6;px(x+6,y-11,4,4,'#ff6020');px(x+7,y-13-(f?1:0),2,3,'#ffd060');}
    else{triFill(x+8,y,4,12,'#3a2a2a');}break;
  }
}
function triFill(cx,by,hw,h,col){ctx.fillStyle=col;for(let j=0;j<h;j++){const w=Math.round(hw*(j+1)/h);ctx.fillRect(cx-w,by-h+j,w*2+1,1);}}
function drawWorld(){
  const sx=shake?Math.round((Math.random()-.5)*shake):0,sy=shake?Math.round((Math.random()-.5)*shake):0;
  const cx=Math.round(cam.x)+sx,cy=Math.round(cam.y)+sy;
  drawBG(cx,cy);
  const th=THEMES[lvlIndex];
  const c0=Math.max(0,Math.floor(cx/T)),c1=Math.min(lvl.cols-1,Math.floor((cx+W)/T)),r0=Math.max(0,Math.floor(cy/T)),r1=Math.min(ROWS-1,Math.floor((cy+H)/T));
  for(let c=c0;c<=c1;c++){
    const pitCol=lvl.g[ROWS-1][c]===' ';
    for(let r=r0;r<=r1;r++){
      const ch=lvl.g[r][c],x=c*T-cx,y=r*T-cy;
      if(ch==='#')ctx.drawImage((r===0||lvl.g[r-1][c]!=='#')?tiles.top:tiles.fill,x,y);
      else if(ch==='-')ctx.drawImage(tiles.plat,x,y);
      else if(ch==='^')ctx.drawImage(tiles.spike,x,y);
      if(pitCol&&r>=ROWS-2){
        if(r===ROWS-2){px(x,y+7,16,9,th.liq);for(let i=0;i<16;i+=2){const wy=Math.round(Math.sin((c*16+i+frame)*.15)*1.2);px(x+i,y+6+wy,2,1,th.liqT);}}
        else px(x,y,16,16,th.liq);
      }
    }
  }
  for(const d of lvl.deco){if(d.x>cx-20&&d.x<cx+W+4)drawDeco(d.k,d.x-cx,d.y-cy);}
  // entità
  for(const e of ents){
    if(!e.alive&&e.t!=='flag')continue;
    const x=Math.round(e.x-cx),y=Math.round(e.y-cy);
    if(x<-30||x>W+30)continue;
    if(e.t==='en'){const K=KINDS[e.kind],fr=(e.dir>0?K.fr:K.frL),img=fr[(e.t0>>3)%fr.length];
      if(e.hurtT>0&&(e.hurtT>>1)%2)ctx.globalAlpha=.4;
      ctx.drawImage(img,Math.round(x+e.w/2-img.width/2),y+e.h-img.height+(K.fly?0:0));ctx.globalAlpha=1;
      if(K.ai==='charge'){const lx=e.dir>0?x+e.w:x-12;px(lx,y+6,12,1,e.st==='charge'?'#ffffff':'#c8ccd8');}}
    else if(e.t==='mp'){ctx.drawImage(tiles.plat,x,y);ctx.drawImage(tiles.plat,x+16,y);}
    else if(e.t==='coin'){const ws=[8,6,2,6][(e.t0>>3)%4];ctx.drawImage(COIN,x+(8-ws)/2,y+Math.round(Math.sin(e.t0*.08)),ws,8);}
    else if(e.t==='heart')ctx.drawImage(HEART,x,y+Math.round(Math.sin(e.t0*.1)*1.5));
    else if(e.t==='flag'){px(x+1,y,2,32,'#2a1a14');px(x,y-2,4,3,'#e8b84a');
      if(e.on){const wv=(e.t0>>3)%2;px(x+3,y+1,11,8,'#c8303a');px(x+3,y+9,11-wv,1,'#8a1a24');px(x+7,y+3,3,4,'#e8b84a');px(x+8,y+4,1,2,'#c8303a');}
      else{px(x+3,y+22,9,7,'#4a3e44');px(x+6,y+24,3,3,'#6a5e64');}}
  }
  // portale
  if(portal){const x=portal.x-cx,y=portal.y-cy;
    for(let j=0;j<36;j++){const yy=(j-18)/18,w=Math.round(12*Math.sqrt(Math.max(0,1-yy*yy)));
      const cols=['#e8b84a','#a87ae8','#5a2a8a','#2a0a3a'];
      for(let r=0;r<4;r++){const ww=Math.max(0,w-r*3);if(ww<=0)break;px(x+12-ww,y+j,ww*2,1,cols[(r+(frame>>3)+(j>>3))%4]);}}
    if(frame%6===0)parts.push({x:portal.x+12+(Math.random()-.5)*20,y:portal.y+36,vx:0,vy:-.8,life:30,col:'#e8b84a',g:0});}
  // boss
  if(boss){const b=boss,sp=BOSS_SPR[b.i],face=b.face>0;
    let img=(b.inv>0&&(b.inv>>1)%2)?(face?sp.wr:sp.wl):(face?sp.r:sp.l);
    const sw=img.width,sh=img.height;
    let bx=Math.round(b.x+b.w/2-sw/2-cx),by=Math.round(b.y+b.h-sh-cy);
    if(b.st==='dying'){bx+=Math.round((Math.random()-.5)*4);if((b.k>>2)%2)img=face?sp.wr:sp.wl;}
    ctx.globalAlpha=b.alpha??1;
    if(b.i===4){const fl=(frame>>2)%2;ctx.drawImage(img,bx,by+(fl?2:0),sw,sh-(fl?4:0));}
    else if(b.i===2&&b.st==='idle'&&b.k<8){ctx.drawImage(img,bx-2,by+4,sw+4,sh-4);}
    else if(b.i===3&&b.st==='aim'){ctx.drawImage(img,bx+((frame>>1)%2?1:-1)*(b.k>30?1:0),by);}
    else ctx.drawImage(img,bx,by);
    ctx.globalAlpha=1;
    if(b.i===3&&b.st!=='dying'){const lx=b.face>0?b.x+b.w-cx:b.x-16-cx,ly=b.y+14-cy;
      if(b.st!=='stun'){px(lx,ly+1,16,2,'#c8ccd8');px(b.face>0?lx+14:lx,ly,2,4,'#ffffff');px(b.face>0?lx:lx+12,ly-1,4,6,'#7a8090');}
      else for(let i=0;i<3;i++){const a=frame*.15+i*2.1;px(b.x+b.w/2-cx+Math.cos(a)*10,b.y-6-cy+Math.sin(a)*3,2,2,'#ffe040');}}
    if(b.i===0&&b.st!=='dying'&&b.t%100>85){drawSack(b.x+b.w/2-6-cx,b.y-12-cy);}
  }
  // proiettili
  for(const q of projs){const x=Math.round(q.x-cx),y=Math.round(q.y-cy);
    if(q.type==='barrel')(q.coin?drawBigCoin(x,y):drawBarrel(x,y,q.rot));
    else if(q.type==='orb'){px(x,y+1,8,6,'#1a3a0a');px(x+1,y,6,8,'#1a3a0a');px(x+1,y+1,6,6,'#6ab02a');px(x+2,y+2,3,3,frame%8<4?'#e0ff8a':'#b0e050');}
    else if(q.type==='fire'){px(x,y+1,8,6,'#8a1a08');px(x+1,y,6,8,'#8a1a08');px(x+1,y+1,6,6,'#ff6020');px(x+2,y+2,4,4,'#ffd060');}
    else if(q.type==='shriek'){const r=frame%10<5;px(x,y+2,8,4,r?'#d04aa0':'#8a3a9a');px(x+2,y,4,8,r?'#d04aa0':'#8a3a9a');px(x+2,y+2,4,4,'#120818');}
    else if(q.type==='wave'){px(x,y+4,10,4,'#8a7a5a');px(x+2,y+1,6,3,'#b0a07a');px(x+3,y,4,1,'#ffffff');}
    else if(q.type==='thorn'){
      if(q.ph<=q.warn){if((q.ph>>2)%2)for(let i=0;i<12;i+=3)px(x+i,floorY-cy-2,2,2,'#9ae02a');}
      else{const hg=Math.min(28,(q.ph-q.warn)*4),base=floorY-cy;for(let i=0;i<3;i++){ctx.fillStyle='#1a3a0a';for(let j=0;j<hg;j++){const w=Math.max(0,Math.round(2*(j/hg)));ctx.fillRect(x+2+i*4-w,base-hg+j,w*2+1,1);}}px(x+3,base-hg+4,1,hg-4,'#4a8a2a');px(x+7,base-hg+2,1,hg-2,'#6ab02a');}}
  }
  drawPlayer(cx,cy);
  for(const p of parts)px(p.x-cx,p.y-cy,p.life>12?2:1,p.life>12?2:1,p.col);
}
function drawBigCoin(x,y){const w=[10,7,3,7][(frame>>2)%4],o=(10-w)/2;px(x+o,y,w,10,'#6a0a10');px(x+o+1,y+1,Math.max(1,w-2),8,'#f0c040');if(w>4){px(x+o+2,y+2,w-4,6,'#c8901a');px(x+4,y+3,2,4,'#fff2b0');}}
function drawSack(x,y){px(x+3,y,6,3,'#3a2414');px(x+1,y+3,10,9,'#3a2414');px(x+2,y+4,8,7,'#8a6a3a');px(x+4,y+1,4,2,'#8a6a3a');px(x+5,y+6,2,3,'#f0c040');}
function drawBarrel(x,y,r){px(x+2,y,6,10,'#1a0c06');px(x,y+2,10,6,'#1a0c06');px(x+1,y+1,8,8,'#1a0c06');px(x+2,y+1,6,8,'#8a5428');px(x+1,y+2,8,6,'#8a5428');const s=((Math.round(r)%3)+3)%3;px(x+1,y+2+s*2,8,1,'#4a2a12');px(x+3,y+2,1,6,'#b07a40');}
function drawPlayer(cx,cy){
  const p=P;
  if(state==='play'&&p.inv>0&&(p.inv>>2)%2)return;
  let f='idle';
  if(state==='dead'||!p.onGround)f='jump';else if(Math.abs(p.vx)>.3)f=(p.anim>>3)%2?'run1':'run2';
  const L=p.dir<0,dx=Math.round(p.x-3-cx),dy=Math.round(p.y-4-cy);
  ctx.drawImage(BAR[f][L?1:0],dx,dy);
  if(state==='dead')return;
  const hx=L?dx+2:dx+13;
  if(p.atk>0&&p.air){
    const dir=L?-1:1,a0=-1.8,a1=1.8,prog=Math.min(1,(14-p.atk)/9),cur=a0+(a1-a0)*prog,cxp=dx+8,cyp=dy+15,fade=p.atk<5?p.atk/5:1;
    for(let a=a0;a<=cur;a+=.05){const age=(cur-a)/(a1-a0);if(age>.8)continue;ctx.globalAlpha=(1-age/.8)*fade;
      const w=1+Math.round(4*Math.cos(a*.85));
      for(let r=14;r<=14+w;r++){const col=r===14+w?'#ffffff':(r<=15?'#e8b84a':'#fff2b0');px(cxp+dir*Math.cos(a)*r,cyp+Math.sin(a)*r,1,1,col);}}
    ctx.globalAlpha=1;
    if(p.atk>4){for(let r=3;r<=13;r++)px(cxp+dir*Math.cos(cur)*r,cyp+Math.sin(cur)*r,1,1,'#4a2a14');px(cxp+dir*Math.cos(cur)*14-1,cyp+Math.sin(cur)*14-1,3,3,'#e8b84a');}
    return;
  }
  if(p.atk>0){
    const ext=p.atk>10?8:14,dir=L?-1:1,hy=dy+18;
    for(let i=0;i<ext;i++)px(hx+dir*i,hy,1,2,'#4a2a14');
    px(hx+dir*ext-(L?2:0),hy-1,3,3,'#e8b84a');
    if(p.atk>6){ctx.globalAlpha=.6;for(let i=0;i<6;i++)px(hx+dir*(8+i*1.5),hy-8+i*2,2,1,'#ffffff');ctx.globalAlpha=1;}
  } else {px(hx,dy+17,1,7,'#4a2a14');px(hx-1,dy+15,3,2,'#e8b84a');}
}
function drawHUD(){
  const n=Math.max(3,P.hp);
  for(let i=0;i<n;i++)ctx.drawImage(i<P.hp?HEART:HEART_E,6+i*9,6);
  ctx.drawImage(COIN,6,16);
  ctx.drawImage(BAR.idle[0],0,0,16,15,W-46,3,16,15);
  if(boss&&fight){const bw=150,x0=(W-bw)/2,y0=H-10;px(x0-2,y0-2,bw+4,7,'#0a0408');px(x0,y0,bw,3,'#3a1a20');px(x0,y0,Math.round(bw*Math.max(0,boss.hp)/boss.max),3,boss.i===5?'#ff5a2a':'#d8344a');px(x0,y0,Math.round(bw*Math.max(0,boss.hp)/boss.max),1,'#ff9aa8');}
}
function text(s,x,y,size,col='#f3e3c3',align='center',weight=600){
  out.font=`${weight} ${size}px 'Pixelify Sans','Courier New',monospace`;out.textAlign=align;out.textBaseline='middle';
  const o=Math.max(3,size/12|0);out.fillStyle='#0a0408';out.fillText(s,x+o,y+o);out.fillStyle=col;out.fillText(s,x,y);
}
function band(y,h,a=.78){out.fillStyle=`rgba(12,4,10,${a})`;out.fillRect(0,y,W*S,h);out.fillStyle='#e8b84a';out.fillRect(0,y,W*S,4);out.fillRect(0,y+h-4,W*S,4);}
function hudText(){
  text(String(coins),16*S+6,20*S,30,'#f3e3c3','left');
  if(CHEATS.lives||CHEATS.god||CHEATS.kill)text('TRUCCHI ATTIVI',6*S,30*S,18,'#e8b84a','left',600);
  text('×'+Math.max(0,lives),(W-28)*S,10*S,30,'#f3e3c3','left');
  if(boss&&fight){const d=BOSS_DEF[boss.i];text(d.name,W*S/2,(H-17)*S,28,'#f3e3c3');
    if(boss.intro>0){const a=Math.min(1,boss.intro/20,(120-boss.intro)/20);out.globalAlpha=a;band(150,170);text(d.sub.toUpperCase(),W*S/2,195,26,'#e8b84a');text(d.name,W*S/2,262,64,'#f3e3c3','center',700);out.globalAlpha=1;}}
}

const INTRO=[
 'Nel borgo di Castelbarux viveva il Barone Barux,',
 'nobile elegantissimo dal cilindro più alto del reame.',
 'Ma un brutto giorno il Barone fu anlaciato troppo...',
 '...e tutto quell\'anlaciamento risvegliò il demone ANLAUCER!',
 'Con lui arrivarono cinque scagnozzi a seminare il caos.',
 'Riprenditi il regno, Barone. A colpi di bastone.'
];
function render(){renderMain();drawToast();}
function renderMain(){
  if(state==='cheats'){
    if(cheatsFrom==='title')menuBG(.8);
    else{drawWorld();drawHUD();out.drawImage(buf,0,0,W*S,H*S);out.fillStyle='rgba(10,4,8,.86)';out.fillRect(0,0,W*S,H*S);}
    backBtn();renderCheats();return;}
  if(state==='title'||state==='levels'||state==='gallery'||state==='ach'){renderMenus();return;}
  drawWorld();drawHUD();
  out.drawImage(buf,0,0,W*S,H*S);
  hudText();
  const cxm=W*S/2;
  if(state==='intro'){
    out.fillStyle='rgba(10,4,8,.88)';out.fillRect(0,0,W*S,H*S);
    INTRO.forEach((l,i)=>{const a=clamp((stT-i*45)/30,0,1);if(a<=0)return;out.globalAlpha=a;text(l,cxm,150+i*72,i===3?36:32,i===3?'#e8b84a':'#f3e3c3');});
    out.globalAlpha=1;
    if(stT>INTRO.length*45)text('Premi INVIO o tocca per iniziare',cxm,640,26,'#9a8476');
  } else if(state==='card'){
    const a=Math.min(1,stT/15,(170-stT)/20);out.globalAlpha=Math.max(0,a);
    band(200,320);text('LIVELLO '+(lvlIndex+1),cxm,260,30,'#e8b84a');text(THEMES[lvlIndex].name,cxm,340,72,'#f3e3c3','center',700);
    text('Sconfiggi '+BOSS_DEF[lvlIndex].name,cxm,430,30,'#d8b8a8');out.globalAlpha=1;
  } else if(state==='pause'){out.fillStyle='rgba(10,4,8,.6)';out.fillRect(0,0,W*S,H*S);band(140,460);
    text('PAUSA',cxm,208,64,'#f3e3c3','center',700);
    ['Riprendi','Ricomincia il livello','Trucchi','Torna al menu'].forEach((l,i)=>menuItem(l,cxm,PAUSE_Y+i*62,i===pauseSel));
    text('Ricominciando o tornando al menu, il livello riparte da capo',cxm,560,20,'#9a8476','center',400);}
  else if(state==='clear'){
    const d=BOSS_DEF[lvlIndex];band(170,380);
    text(d.name,cxm,250,52,'#f3e3c3','center',700);
    text(lvlIndex===5?'è stato rispedito negli inferi!':(d.fem?'è stata sconfitta!':'è stato sconfitto!'),cxm,320,36,'#e8b84a');
    text('Monete raccolte: '+coins,cxm,400,28,'#d8b8a8');
    if(stT>50)text('Premi INVIO o tocca per continuare',cxm,480,24,'#9a8476');
  } else if(state==='gameover'){out.fillStyle='rgba(10,4,8,.82)';out.fillRect(0,0,W*S,H*S);text('GAME OVER',cxm,300,96,'#d8344a','center',700);text('Il cilindro è caduto. Ma un barone si rialza sempre.',cxm,400,28,'#f3e3c3');if(stT>50)text('Premi INVIO o tocca per riprovare il livello',cxm,480,24,'#9a8476');}
  else if(state==='win'){
    out.fillStyle='rgba(10,4,8,.7)';out.fillRect(0,0,W*S,H*S);
    text('VITTORIA!',cxm,150,96,'#e8b84a','center',700);
    ['Anlaucer torna negli abissi da cui era venuto.','Il Barone Barux si sistema il cilindro e torna a casa.','Da oggi in poi si farà anlaciare con moderazione.'].forEach((l,i)=>text(l,cxm,270+i*58,32,'#f3e3c3'));
    text('Monete totali: '+coins,cxm,480,30,'#d8b8a8');
    if(stT>80)text('Premi INVIO o tocca per tornare al titolo',cxm,600,24,'#9a8476');
  }
}
const ROSTER=[
 {id:'barux',name:'Barone Barux',role:'Il protagonista',img:()=>BAR.idle[0],desc:'Nobile di Castelbarux dal cilindro più alto del reame. Fu anlaciato troppo e ora deve rimediare a colpi di bastone.'},
 {id:'boss0',boss:0,desc:'Goblin avido che riscuote tasse mai votate da nessuno. A chi non paga, tira addosso le monete.'},
 {id:'goblin',name:'Goblin di strada',lv:0,desc:'Goblin di bassa lega al servizio dell’Esattore. Pattuglia i vicoli della città vecchia.'},
 {id:'thrower',name:'Goblin riscossore',lv:0,desc:'Goblin col berretto blu. Riscuote a distanza, lanciando monete a parabola.'},
 {id:'boss1',boss:1,desc:'Strega del Bosco Oscuro. Sparisce e riappare dove meno te lo aspetti, e fa spuntare rovi dal terreno.'},
 {id:'bramble',name:'Rovo ambulante',lv:1,desc:'Cespuglio di spine con le gambe. Saltargli in testa è una pessima idea: meglio il bastone.'},
 {id:'witch',name:'Streghetta',lv:1,desc:'Apprendista di Gankàla. Vola sulla scopa e lancia sfere velenose.'},
 {id:'boss2',boss:2,desc:'Rospo grande quanto una carrozza. Ogni suo atterraggio fa tremare la palude con onde d’urto.'},
 {id:'toadlet',name:'Rospetto',lv:2,desc:'Figlio di Pushatomìdir. Appena ti vede, ti salta incontro.'},
 {id:'mosquito',name:'Zanzarone',lv:2,desc:'Zanzara della palude grande quanto un gatto. Vola a zig zag tra le nebbie.'},
 {id:'boss3',boss:3,desc:'Armatura vuota posseduta. Carica a testa bassa con la lancia finché non si schianta contro un muro.'},
 {id:'soldier',name:'Fante di Rekter',lv:3,desc:'Soldato corazzato. Se ti vede sulla sua strada, carica con la lancia. Servono due colpi.'},
 {id:'helmet',name:'Elmo infestato',lv:3,desc:'Un elmo che fluttua da solo nelle miniere. Duro di testa: servono due colpi.'},
 {id:'boss4',boss:4,desc:'Pipistrella gigante della torre. Strilla onde sonore e si getta in picchiata sulle prede.'},
 {id:'bat',name:'Pipistrello',lv:4,desc:'Aspetta tra le campane e si tuffa su chi passa sotto.'},
 {id:'gargoyle',name:'Gargoyle',lv:4,desc:'Statua di pietra che ha deciso di sgranchirsi le gambe. Dura: due colpi.'},
 {id:'boss5',boss:5,desc:'Il demone nato dall’anlaciamento eccessivo del Barone. Palle di fuoco, diavoletti e voli radenti.'},
 {id:'imp',name:'Diavoletto',lv:5,desc:'Evocato da Anlaucer. Piccolo, rosso e molto fastidioso.'},
 {id:'skull',name:'Teschio infuocato',lv:5,desc:'Teschio avvolto dalle fiamme che piomba sugli intrusi della fortezza.'}];
for(const r of ROSTER){
  if(r.boss!=null){const d=BOSS_DEF[r.boss];r.name=d.name;r.role=(r.boss===5?'Boss finale':'Boss')+' · '+THEMES[r.boss].name;r.img=()=>BOSS_SPR[r.boss].r;}
  else if(r.lv!=null){r.role='Scagnozzo · '+THEMES[r.lv].name;r.img=()=>KINDS[r.id].fr[0];}
}
const SIL=new Map();
function silhouette(c){if(!SIL.has(c))SIL.set(c,mk(c.width,c.height,x=>{x.drawImage(c,0,0);x.globalCompositeOperation='source-in';x.fillStyle='#3a2434';x.fillRect(0,0,c.width,c.height);}));return SIL.get(c);}
function drawFit(img,x,y,w,h,locked){const sc=Math.max(1,Math.floor(Math.min(w/img.width,h/img.height))),dw=img.width*sc,dh=img.height*sc;
  out.drawImage(locked?silhouette(img):img,Math.round(x+(w-dw)/2),Math.round(y+(h-dh)/2),dw,dh);}
function wrap(str,x,y,maxW,lh,size,col){out.font=`400 ${size}px 'Pixelify Sans','Courier New',monospace`;const words=str.split(' ');let line='',yy=y;
  for(const w of words){const t=line?line+' '+w:w;if(out.measureText(t).width>maxW&&line){text(line,x,yy,size,col,'left',400);line=w;yy+=lh;}else line=t;}
  if(line)text(line,x,yy,size,col,'left',400);}
function menuItem(label,x,y,sel){
  if(sel){out.fillStyle='rgba(92,22,38,.92)';out.fillRect(x-230,y-28,460,56);out.fillStyle='#e8b84a';out.fillRect(x-230,y-28,6,56);}
  text((sel?'▸ ':'')+label,x,y,32,sel?'#f3e3c3':'#9a8476');}
function panel(x,y,w,h){out.fillStyle='rgba(18,8,16,.92)';out.fillRect(x,y,w,h);out.strokeStyle='#5c1626';out.lineWidth=4;out.strokeRect(x+2,y+2,w-4,h-4);}
function menuBG(dark){
  [tiles,bg]=getTheme(0);
  drawBG(titleX,0);
  for(let x=-(titleX%16|0);x<W;x+=16)ctx.drawImage(tiles.top,x,H-16);
  out.drawImage(buf,0,0,W*S,H*S);
  out.fillStyle=`rgba(12,4,10,${dark})`;out.fillRect(0,0,W*S,H*S);
}
function backBtn(){out.fillStyle='rgba(92,22,38,.9)';out.fillRect(30,30,230,60);out.fillStyle='#e8b84a';out.fillRect(30,30,6,60);text('◂ Indietro',145,60,28,'#f3e3c3');}
function drawToast(){
  if(padMsgT>0){const a=Math.min(1,padMsgT/20);out.globalAlpha=a;out.fillStyle='rgba(18,8,16,.92)';out.fillRect(440,640,400,56);out.strokeStyle='#e8b84a';out.lineWidth=3;out.strokeRect(441,641,398,54);text('🎮 '+padMsg,640,668,24,'#f3e3c3','center',600);out.globalAlpha=1;}
  if(!toasts.length)return;const T0=toasts[0],a=ACH.find(x=>x.id===T0.id);if(!a)return;
  const slide=Math.min(1,T0.t/14,(210-T0.t)/14),y=Math.round(-110+130*slide);
  out.fillStyle='rgba(18,8,16,.95)';out.fillRect(390,y,500,96);out.strokeStyle='#e8b84a';out.lineWidth=4;out.strokeRect(392,y+2,496,92);
  drawFit(a.ic(),402,y+10,76,76,false);
  text('OBIETTIVO SBLOCCATO',492,y+30,18,'#e8b84a','left',600);
  text(a.n,492,y+64,28,'#f3e3c3','left',700);
}
function renderAch(){
  const got=ACH.filter(a=>AST.u[a.id]).length;
  text('OBIETTIVI',640,60,44,'#e8b84a','center',700);
  ACH.forEach((a,i)=>{const r=aRect(i),open=!!AST.u[a.id],sel=i===selA;
    out.fillStyle=sel?'rgba(92,22,38,.95)':(open?'rgba(60,30,20,.9)':'rgba(18,8,16,.85)');out.fillRect(r.x,r.y,r.w,r.h);
    out.strokeStyle=sel?'#e8b84a':(open?'#a8781e':'#3a1a26');out.lineWidth=sel?5:3;out.strokeRect(r.x+2,r.y+2,r.w-4,r.h-4);
    if(!open&&a.secret)text('?',r.x+r.w/2,r.y+r.h/2,44,'#5a4050','center',700);
    else drawFit(a.ic(),r.x+14,r.y+14,r.w-28,r.h-28,!open);});
  text('Sbloccati: '+got+' / '+ACH.length,355,540,22,'#9a8476','center',400);
  if(cheatsOn())text('Trucchi attivi: gli obiettivi sono in pausa',355,578,19,'#e8b84a','center',400);
  const a=ACH[selA],open=!!AST.u[a.id],hidden=a.secret&&!open;
  panel(680,130,550,540);
  if(hidden)text('?',955,250,120,'#5a4050','center',700);else drawFit(a.ic(),700,150,510,200,!open);
  text(hidden?'???':a.n,705,395,32,open?'#f3e3c3':'#b8a898','left',700);
  text(a.c,705,438,21,'#e8b84a','left',600);
  wrap(hidden?'Obiettivo segreto: continua a giocare per scoprirlo.':a.d,705,484,500,30,22,'#d8c8b8');
  if(a.stat&&!hidden&&a.goal>1){const v=Math.min(a.goal,AST.s[a.stat]||0);
    out.fillStyle='#2a1420';out.fillRect(705,570,500,18);out.fillStyle=open?'#2fb06a':'#e8b84a';out.fillRect(705,570,Math.round(500*v/a.goal),18);
    text(v+' / '+a.goal,1205,605,20,'#b8a898','right',400);}
  text(open?'Sbloccato il '+new Date(AST.u[a.id]).toLocaleDateString('it-IT'):'Da sbloccare',705,640,20,open?'#2fb06a':'#8a7a7a','left',600);
  text('Frecce per sfogliare · ESC per tornare',640,700,18,'#9a8476','center',400);
}
function renderCheats(){
  text('TRUCCHI',640,62,44,'#e8b84a','center',700);
  CHEAT_LIST.forEach((c,i)=>{const r=cheatRect(i),sel=i===cheatSel,on=CHEATS[c.k];
    out.fillStyle=sel?'rgba(92,22,38,.92)':'rgba(18,8,16,.88)';out.fillRect(r.x,r.y,r.w,r.h);
    out.strokeStyle=sel?'#e8b84a':'#3a1a26';out.lineWidth=sel?5:3;out.strokeRect(r.x+2,r.y+2,r.w-4,r.h-4);
    text(c.label,r.x+30,r.y+32,30,'#f3e3c3','left',700);
    text(c.desc,r.x+30,r.y+68,19,'#b8a898','left',400);
    const tx=r.x+r.w-140,ty=r.y+26;
    out.fillStyle=on?'#2fb06a':'#3a2a30';out.fillRect(tx,ty,110,44);
    out.fillStyle=on?'#a8f0c0':'#6a5a60';out.fillRect(on?tx+70:tx+6,ty+6,34,32);
    text(on?'ON':'OFF',on?tx+36:tx+74,ty+22,20,on?'#0a2a14':'#b8a898','center',700);});
  const r=cheatRect(3),sel=cheatSel===3;
  out.fillStyle=sel?'rgba(92,22,38,.92)':'rgba(18,8,16,.88)';out.fillRect(r.x,r.y,r.w,r.h);
  out.strokeStyle=sel?'#e8b84a':'#3a1a26';out.lineWidth=sel?5:3;out.strokeRect(r.x+2,r.y+2,r.w-4,r.h-4);
  text('Fatto',r.x+r.w/2,r.y+r.h/2,30,'#f3e3c3','center',700);
  text('INVIO per attivare o disattivare · ESC per uscire',640,640,20,'#9a8476','center',400);
}
function renderMenus(){
  if(state==='title'){
    menuBG(.35);
    out.drawImage(BAR.idle[0],120,(H-16)*S-24*13,16*13,24*13);
    out.fillStyle='#4a2a14';out.fillRect(120+13*13,(H-16)*S-7*13,13,7*13);out.fillStyle='#e8b84a';out.fillRect(120+12*13,(H-16)*S-9*13,39,26);
    const tx=820;
    text('IL BARONE',tx,100,44,'#e8b84a','center',600);
    text('BARUX',tx,200,150,'#f3e3c3','center',700);
    text('e la maledizione di Anlaucer',tx,300,34,'#d8b8a8','center',400);
    const items=titleItems();
    out.fillStyle='rgba(12,4,10,.72)';out.fillRect(tx-250,TITLE_Y-38,500,items.length*50+70);
    items.forEach((it,i)=>menuItem(it.label,tx,TITLE_Y+i*50,i===menuSel));
    text('INVIO per scegliere · frecce per spostarti',tx,TITLE_Y+items.length*50+8,20,'#9a8476','center',400);
    return;
  }
  menuBG(.72);backBtn();
  if(state==='levels'){
    text('SELEZIONA LIVELLO',640,60,44,'#e8b84a','center',700);
    const max=loadSave();
    for(let i=0;i<6;i++){const r=levelRect(i),open=i<=max,sel=i===selL;
      getTheme(i);
      out.drawImage(BGS[i].sky,r.x,r.y,r.w,r.h);
      for(let k=0;k<r.w;k+=48)out.drawImage(TILES[i].top,r.x+k,r.y+r.h-48,Math.min(48,r.w-k),48);
      out.fillStyle=open?'rgba(10,4,8,.45)':'rgba(10,4,8,.82)';out.fillRect(r.x,r.y,r.w,r.h);
      out.strokeStyle=sel?'#e8b84a':'#3a1a26';out.lineWidth=sel?6:4;out.strokeRect(r.x+2,r.y+2,r.w-4,r.h-4);
      text('LIVELLO '+(i+1),r.x+r.w/2,r.y+38,22,open?'#e8b84a':'#6a5a5a','center',600);
      if(open){text(THEMES[i].name,r.x+r.w/2,r.y+90,25,'#f3e3c3','center',700);
        text(SEEN.has('boss'+i)?'Boss: '+BOSS_DEF[i].name:'Boss: ???',r.x+r.w/2,r.y+135,17,'#d8b8a8','center',400);}
      else{out.fillStyle='#6a5a5a';out.fillRect(r.x+r.w/2-18,r.y+100,36,28);out.strokeStyle='#6a5a5a';out.lineWidth=6;out.beginPath();out.arc(r.x+r.w/2,r.y+100,12,Math.PI,0);out.stroke();
        text('Bloccato',r.x+r.w/2,r.y+155,22,'#8a7a7a','center',400);}
    }
    text('Ogni livello si sblocca raggiungendolo nella storia',640,680,22,'#9a8476','center',400);
    return;
  }
  if(state==='ach'){renderAch();return;}
  // galleria
  text('PERSONAGGI',640,60,44,'#e8b84a','center',700);
  ROSTER.forEach((r,i)=>{const g=galRect(i),open=r.id==='barux'||SEEN.has(r.id),sel=i===selG;
    out.fillStyle=sel?'rgba(92,22,38,.95)':'rgba(18,8,16,.85)';out.fillRect(g.x,g.y,g.w,g.h);
    out.strokeStyle=sel?'#e8b84a':(r.boss!=null?'#7a3a20':'#3a1a26');out.lineWidth=sel?5:3;out.strokeRect(g.x+2,g.y+2,g.w-4,g.h-4);
    drawFit(r.img(),g.x+10,g.y+10,g.w-20,g.h-20,!open);});
  const found=ROSTER.filter(r=>r.id==='barux'||SEEN.has(r.id)).length;
  text('Scoperti: '+found+' / '+ROSTER.length,50+(G_COLS*102-10)/2,580,22,'#9a8476','center',400);
  const r=ROSTER[selG],open=r.id==='barux'||SEEN.has(r.id);
  panel(600,130,630,540);
  drawFit(r.img(),630,150,570,250,!open);
  if(open){
    text(r.name,640,438,36,'#f3e3c3','left',700);
    text(r.role,640,482,22,'#e8b84a','left',600);
    wrap(r.desc,640,532,550,32,23,'#d8c8b8');
  } else {
    text('???',640,438,36,'#8a7a7a','left',700);
    text(r.role.split(' · ')[0]+' · ???',640,482,22,'#8a6a40','left',600);
    wrap(r.boss!=null?'Sconfiggi questo boss nella storia per sbloccare la sua scheda.':'Sconfiggi almeno uno di questi nemici per sbloccare la sua scheda.',640,532,550,32,23,'#8a7a7a');
  }
  text('Frecce per sfogliare · ESC per tornare',640,700,18,'#9a8476','center',400);
}

// ---------- avvio ----------
let last=performance.now(),acc=0;
function loop(now){
  acc+=Math.min(100,now-last);last=now;
  while(acc>=1000/60){step();acc-=1000/60;}
  try{render();}catch(e){console.error(e);}
  musicTick();
  requestAnimationFrame(loop);
}
function start(){
  getTheme(0);music(0);
  const go=()=>requestAnimationFrame(t=>{last=t;loop(t);});
  if(document.fonts&&document.fonts.load){Promise.race([document.fonts.load("700 40px 'Pixelify Sans'"),new Promise(r=>setTimeout(r,1500))]).then(go,go);}else go();
}
start();
})();
