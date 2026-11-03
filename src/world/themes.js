// Ambientazioni: tile, piattaforme e sfondi di ogni livello.
import { H, W } from '../config.js';
import { mk, rng } from '../utils.js';

export const THEMES=[
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
  const grain=x=>{for(let i=0;i<10;i++){x.fillStyle=R()<.5?C.l:C.d;x.fillRect(R()*16|0,4+(R()*12|0),1,1);}x.fillStyle='rgba(10,4,16,.18)';x.fillRect(0,12,16,4);};
  const fill=mk(16,16,x=>{fillFn(x);grain(x);x.fillStyle='rgba(10,4,16,.12)';x.fillRect(0,0,16,16);});
  const top=mk(16,16,x=>{
    fillFn(x);grain(x);
    if(ti===0){x.fillStyle=C.m;x.fillRect(0,0,16,5);for(let i=0;i<4;i++){x.fillStyle=i%2?C.t:C.t2;x.fillRect(i*4,0,3,4);x.fillStyle=C.l;x.fillRect(i*4,0,2,1);}}
    else if(ti===4){x.fillStyle=C.t;x.fillRect(0,0,16,5);x.fillStyle=C.t2;x.fillRect(0,0,16,1);x.fillStyle='#3a2414';x.fillRect(0,5,16,1);x.fillRect(7,0,1,5);x.fillStyle='#c8c8c8';x.fillRect(2,2,1,1);x.fillRect(12,2,1,1);}
    else if(ti===5){x.fillStyle=C.t;x.fillRect(0,0,16,3);x.fillStyle=C.t2;for(let i=0;i<16;i++)if(R()<.6)x.fillRect(i,0,1,1);}
    else if(ti===3){x.fillStyle=C.t;x.fillRect(0,0,16,3);x.fillStyle=C.t2;x.fillRect(0,0,16,1);}
    else {x.fillStyle=C.t;x.fillRect(0,0,16,4);for(let i=0;i<16;i++){if(R()<.55)x.fillRect(i,4,1,1+(R()*3|0));}x.fillStyle=C.t2;x.fillRect(0,0,16,1);for(let i=0;i<16;i++)if(R()<.35)x.fillRect(i,1,1,1);
      if(ti===2){x.fillStyle='#5a7a2a';x.fillRect(3,4,1,4);x.fillRect(11,4,1,3);}}
  });
  const plat=mk(16,16,x=>{
    const f=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
    if(ti===0){ // città: asse di legno
      f('#2a1a0e',0,0,16,6);f('#8a5a2e',0,1,16,4);f('#b07a44',0,1,16,1);f('#5a3a1c',5,1,1,4);f('#5a3a1c',11,1,1,4);f('#2a1a0e',2,6,2,3);f('#2a1a0e',12,6,2,3);
    } else if(ti===1){ // bosco: tronco coperto di muschio
      f('#1e1408',0,0,16,7);f('#6a4424',0,1,16,5);f('#8a5a30',0,2,16,1);f('#4a2e16',0,5,16,1);f('#4a2e16',3,3,2,1);f('#4a2e16',10,4,3,1);
      f('#2f7a34',0,0,16,2);f('#5ab04a',0,0,16,1);for(const i of [1,6,11])f('#2f7a34',i,2,2,1);
      f('#3a8a3a',4,7,1,3);f('#3a8a3a',12,7,1,2);f('#e8dcc0',8,0,1,1);
    } else if(ti===2){ // palude: zattera marcia con alghe che pendono
      f('#141008',0,0,16,7);f('#4e4430',0,1,16,5);f('#6a5c3a',0,1,16,1);f('#2a2418',5,1,1,5);f('#2a2418',11,1,1,5);
      f('#4a6a2a',0,0,16,1);f('#7a9a3a',2,0,3,1);f('#7a9a3a',9,0,4,1);
      f('#5a7a2a',2,7,1,4);f('#5a7a2a',8,7,1,6);f('#5a7a2a',14,7,1,3);f('#9ae02a',8,12,1,1);
    } else if(ti===3){ // miniere: trave di ferro rivettata
      f('#14161e',0,0,16,7);f('#7a809a',0,1,16,5);f('#a4aac2',0,1,16,1);f('#4a4e62',0,5,16,1);
      for(const i of [2,7,12])f('#d8dce8',i,3,1,1);f('#c8601a',4,4,2,1);f('#8a3a10',13,2,1,2);
      f('#2a2e3a',1,7,2,4);f('#2a2e3a',13,7,2,4);
    } else if(ti===4){ // torre: mensola di pietra con bordo dorato
      f('#0e1020',0,0,16,7);f('#4e5672',0,1,16,4);f('#6a7494',0,1,16,1);f('#2a2e42',7,1,1,4);
      f('#b08a3a',0,5,16,1);f('#e8c060',2,5,2,1);f('#2a2e42',4,7,8,2);f('#2a2e42',6,9,4,2);f('#1a1c28',7,11,2,1);
    } else { // fortezza: lastra di ossidiana con crepe di lava e catene
      f('#0a0206',0,0,16,7);f('#2a1a24',0,1,16,5);f('#3e2834',0,1,16,1);
      f('#e0502a',3,3,3,1);f('#e0502a',5,4,1,1);f('#ffb030',10,2,1,2);f('#e0502a',11,4,3,1);
      for(let j=0;j<4;j+=2){f('#4a4a56',2,7+j,1,1);f('#4a4a56',13,7+j,1,1);}f('#2a2a34',2,8,1,1);f('#2a2a34',13,8,1,1);
    }
  });
  const spike=mk(16,16,x=>{for(let i=0;i<3;i++){const cx=i*5+3;for(let j=0;j<8;j++){const w=Math.floor(j/3);x.fillStyle='#2a2a34';x.fillRect(cx-w-1,8+j,w*2+3,1);x.fillStyle=j<2?'#ffffff':'#b8bcc8';x.fillRect(cx-w,8+j,w*2+1,1);}}x.fillStyle='#4a4a58';x.fillRect(0,15,16,1);});
  return {fill,top,plat,spike};
}

// ---------- sfondi ----------
export const LW=640,LH=H+30;
const BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5]; // matrice di retino 4x4
function bands(x,cols,w,h){const n=cols.length,bh=h/n;
  for(let y=0;y<h;y++){const f=Math.max(0,(y-bh/2)/bh),i=Math.min(n-1,Math.floor(f)),t=f-i,j=Math.min(n-1,i+1);
    // ogni riga mescola due colori vicini con il retino: la sfumatura resta pixel art
    x.fillStyle=cols[i];x.fillRect(0,y,w,1);if(j===i||t<=0)continue;x.fillStyle=cols[j];
    for(let xx=0;xx<w;xx++)if(BAYER[(y&3)*4+(xx&3)]/16<t)x.fillRect(xx,y,1,1);}}
// bordo luminoso in cima alle sagome dello sfondo: dà profondità ai piani lontani
function rim(c,col){const x=c.getContext('2d'),d=x.getImageData(0,0,c.width,c.height).data,w=c.width;x.fillStyle=col;
  for(let y=1;y<c.height;y++)for(let xx=0;xx<w;xx++){const i=(y*w+xx)*4;if(d[i+3]&&!d[i-w*4+3])x.fillRect(xx,y,1,1);}
  return c;}
const RIM=['#8a3a5a','#1e4450','#3a4a26',null,'#2a3660','#7a1a14'];
function triUp(x,cx,by,hw,h){for(let j=0;j<h;j++){const w=Math.round(hw*(j+1)/h);x.fillRect(cx-w,by-h+j,w*2+1,1);}}
function pine(x,cx,by,h){x.fillRect(cx-1,by-5,3,5);for(let t=0;t<3;t++){const th=h/3*1.5,top=by-5-h+t*h/3;for(let j=0;j<th;j++){const w=Math.round((j/th)*(h*0.22+t*2.5));x.fillRect(cx-w,Math.round(top+j),w*2+1,1);}}}
function stars(x,R,n,maxY){for(let i=0;i<n;i++){x.fillStyle=R()<.3?'#ffffff':'#c8c0e0';x.fillRect(R()*W|0,R()*maxY|0,1,1);}}
function layer(f,fn){return {f,c:mk(LW,LH,x=>{for(const off of [0,-LW,LW]){x.save();x.translate(off,0);fn(x);x.restore();}})};}
function makeBG(ti){
  const th=THEMES[ti],R=rng(500+ti);
  const sky=mk(W,H,x=>{bands(x,th.sky,W,H);
    if(ti===0){for(const [r,c] of [[22,'#f2b860'],[17,'#f8c870']]){x.fillStyle=c;for(let j=-r;j<=r;j++){const w=Math.round(Math.sqrt(r*r-j*j));for(let xx=-w;xx<w;xx++)if((xx+j)&1||r<20)x.fillRect(220+xx,120+j,1,1);}}x.fillStyle='#ffd27a';for(let j=-12;j<=12;j++){const w=Math.round(Math.sqrt(144-j*j));x.fillRect(220-w,120+j,w*2,1);}x.fillStyle='#fff0b0';x.fillRect(214,112,8,3);}
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
  if(RIM[ti])Ls.forEach(l=>rim(l.c,RIM[ti]));
  return {sky,Ls};
}
export const TILES=[],BGS=[];
export function getTheme(i){if(!TILES[i]){TILES[i]=makeTiles(i);BGS[i]=makeBG(i);}return [TILES[i],BGS[i]];}
