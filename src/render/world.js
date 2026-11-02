// Disegno del mondo di gioco e dell'HUD.
import { ctx, out, px } from '../canvas.js';
import { H, ROWS, S, T, W, floorY } from '../config.js';
import { BAR } from '../graphics/barux.js';
import { BOSS_DEF, BOSS_SPR } from '../graphics/bosses.js';
import { KINDS } from '../graphics/enemies.js';
import { COIN, HEART, HEART_E } from '../graphics/items.js';
import { band, text, triFill } from './draw.js';
import { CHEATS, devUnlock } from '../save.js';
import { G, cam } from '../state.js';
import { BGS, LH, LW, THEMES } from '../world/themes.js';

export function drawBG(cx,cy){
  ctx.drawImage(G.bg.sky,0,0);
  for(const L of G.bg.Ls){const ox=-(((cx*L.f)%LW)+LW)%LW,oy=Math.round(-cy*L.f*.4)-(LH-H)+Math.round(L.f*20);
    ctx.drawImage(L.c,Math.floor(ox),oy);ctx.drawImage(L.c,Math.floor(ox)+LW,oy);}
  const t=G.bg===BGS[2]?2:G.bg===BGS[5]?5:G.bg===BGS[3]?3:-1;
  if(t===2){ctx.fillStyle='#b8c89a';ctx.globalAlpha=.09;for(let b=0;b<3;b++)for(let x=0;x<W;x+=4){const y=90+b*28+Math.sin((x+G.frame*(.3+b*.2)+b*80)/34)*5;ctx.fillRect(x,y,4,12);}ctx.globalAlpha=1;}
  if(t===5||t===3){for(let i=0;i<22;i++){const x=(i*53+G.frame*.25*(1+i%3))%W,y=H-((G.frame*.45*(1+i%2)+i*37)%(H+20));px(x,y,1,1,t===5?(i%2?'#ff9030':'#ffd060'):'#6a5a8a');}}
}
function drawDeco(k,x,y){
  switch(G.lvlIndex){
  case 0:if(k===0){px(x+7,y-20,2,20,'#1a1218');px(x+4,y-25,8,6,'#1a1218');px(x+5,y-24,6,4,G.frame%40<20?'#ffd060':'#f0a040');}
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
  case 4:if(k===0){px(x+7,y-8,2,8,'#e8e0c8');px(x+7,y-11,2,3,G.frame%30<15?'#ffd060':'#ff9030');px(x+5,y-1,6,1,'#8a6a2a');}
    else if(k===1){px(x+3,y-6,10,6,'#5a3a20');px(x+4,y-5,8,1,'#8a2a2a');px(x+4,y-3,8,1,'#2a4a8a');}
    else{px(x+5,y-7,6,5,'#b08a3a');px(x+4,y-2,8,2,'#b08a3a');px(x+7,y-8,2,1,'#b08a3a');}break;
  case 5:if(k===0){px(x+5,y-5,6,5,'#d8d4c0');px(x+6,y-4,1,1,'#1a0004');px(x+9,y-4,1,1,'#1a0004');}
    else if(k===1){px(x+5,y-6,6,6,'#2a1a1a');px(x+4,y-7,8,2,'#4a2a2a');const f=G.frame%12<6;px(x+6,y-11,4,4,'#ff6020');px(x+7,y-13-(f?1:0),2,3,'#ffd060');}
    else{triFill(x+8,y,4,12,'#3a2a2a');}break;
  }
}
export function drawWorld(){
  const sx=G.shake?Math.round((Math.random()-.5)*G.shake):0,sy=G.shake?Math.round((Math.random()-.5)*G.shake):0;
  const cx=Math.round(cam.x)+sx,cy=Math.round(cam.y)+sy;
  drawBG(cx,cy);
  const th=THEMES[G.lvlIndex];
  const c0=Math.max(0,Math.floor(cx/T)),c1=Math.min(G.lvl.cols-1,Math.floor((cx+W)/T)),r0=Math.max(0,Math.floor(cy/T)),r1=Math.min(ROWS-1,Math.floor((cy+H)/T));
  for(let c=c0;c<=c1;c++){
    const pitCol=G.lvl.g[ROWS-1][c]===' ';
    for(let r=r0;r<=r1;r++){
      const ch=G.lvl.g[r][c],x=c*T-cx,y=r*T-cy;
      if(ch==='#')ctx.drawImage((r===0||G.lvl.g[r-1][c]!=='#')?G.tiles.top:G.tiles.fill,x,y);
      else if(ch==='-')ctx.drawImage(G.tiles.plat,x,y);
      else if(ch==='^')ctx.drawImage(G.tiles.spike,x,y);
      if(pitCol&&r>=ROWS-2){
        if(r===ROWS-2){px(x,y+7,16,9,th.liq);for(let i=0;i<16;i+=2){const wy=Math.round(Math.sin((c*16+i+G.frame)*.15)*1.2);px(x+i,y+6+wy,2,1,th.liqT);}}
        else px(x,y,16,16,th.liq);
      }
    }
  }
  for(const d of G.lvl.deco){if(d.x>cx-20&&d.x<cx+W+4)drawDeco(d.k,d.x-cx,d.y-cy);}
  // entità
  for(const e of G.ents){
    if(!e.alive&&e.t!=='flag')continue;
    const x=Math.round(e.x-cx),y=Math.round(e.y-cy);
    if(x<-30||x>W+30)continue;
    if(e.t==='en'){const K=KINDS[e.kind],fr=(e.dir>0?K.fr:K.frL),img=fr[(e.t0>>3)%fr.length];
      if(e.hurtT>0&&(e.hurtT>>1)%2)ctx.globalAlpha=.4;
      ctx.drawImage(img,Math.round(x+e.w/2-img.width/2),y+e.h-img.height+(K.fly?0:0));ctx.globalAlpha=1;
      if(K.ai==='charge'){const lx=e.dir>0?x+e.w:x-12;px(lx,y+6,12,1,e.st==='charge'?'#ffffff':'#c8ccd8');}}
    else if(e.t==='mp'){ctx.drawImage(G.tiles.plat,x,y);ctx.drawImage(G.tiles.plat,x+16,y);}
    else if(e.t==='coin'){const ws=[8,6,2,6][(e.t0>>3)%4];ctx.drawImage(COIN,x+(8-ws)/2,y+Math.round(Math.sin(e.t0*.08)),ws,8);}
    else if(e.t==='heart')ctx.drawImage(HEART,x,y+Math.round(Math.sin(e.t0*.1)*1.5));
    else if(e.t==='flag'){px(x+1,y,2,32,'#2a1a14');px(x,y-2,4,3,'#e8b84a');
      if(e.on){const wv=(e.t0>>3)%2;px(x+3,y+1,11,8,'#c8303a');px(x+3,y+9,11-wv,1,'#8a1a24');px(x+7,y+3,3,4,'#e8b84a');px(x+8,y+4,1,2,'#c8303a');}
      else{px(x+3,y+22,9,7,'#4a3e44');px(x+6,y+24,3,3,'#6a5e64');}}
  }
  // portale
  if(G.portal){const x=G.portal.x-cx,y=G.portal.y-cy;
    for(let j=0;j<36;j++){const yy=(j-18)/18,w=Math.round(12*Math.sqrt(Math.max(0,1-yy*yy)));
      const cols=['#e8b84a','#a87ae8','#5a2a8a','#2a0a3a'];
      for(let r=0;r<4;r++){const ww=Math.max(0,w-r*3);if(ww<=0)break;px(x+12-ww,y+j,ww*2,1,cols[(r+(G.frame>>3)+(j>>3))%4]);}}
    if(G.frame%6===0)G.parts.push({x:G.portal.x+12+(Math.random()-.5)*20,y:G.portal.y+36,vx:0,vy:-.8,life:30,col:'#e8b84a',g:0});}
  // boss
  if(G.boss){const b=G.boss,sp=BOSS_SPR[b.i],face=b.face>0;
    let img=(b.inv>0&&(b.inv>>1)%2)?(face?sp.wr:sp.wl):(face?sp.r:sp.l);
    const sw=img.width,sh=img.height;
    let bx=Math.round(b.x+b.w/2-sw/2-cx),by=Math.round(b.y+b.h-sh-cy);
    if(b.st==='dying'){bx+=Math.round((Math.random()-.5)*4);if((b.k>>2)%2)img=face?sp.wr:sp.wl;}
    ctx.globalAlpha=b.alpha??1;
    if(b.i===4){const fl=(G.frame>>2)%2;ctx.drawImage(img,bx,by+(fl?2:0),sw,sh-(fl?4:0));}
    else if(b.i===2&&b.st==='idle'&&b.k<8){ctx.drawImage(img,bx-2,by+4,sw+4,sh-4);}
    else if(b.i===3&&b.st==='aim'){ctx.drawImage(img,bx+((G.frame>>1)%2?1:-1)*(b.k>30?1:0),by);}
    else ctx.drawImage(img,bx,by);
    ctx.globalAlpha=1;
    if(b.i===3&&b.st!=='dying'){const lx=b.face>0?b.x+b.w-cx:b.x-16-cx,ly=b.y+14-cy;
      if(b.st!=='stun'){px(lx,ly+1,16,2,'#c8ccd8');px(b.face>0?lx+14:lx,ly,2,4,'#ffffff');px(b.face>0?lx:lx+12,ly-1,4,6,'#7a8090');}
      else for(let i=0;i<3;i++){const a=G.frame*.15+i*2.1;px(b.x+b.w/2-cx+Math.cos(a)*10,b.y-6-cy+Math.sin(a)*3,2,2,'#ffe040');}}
    if(b.i===0&&b.st!=='dying'&&b.t%100>85){drawSack(b.x+b.w/2-6-cx,b.y-12-cy);}
  }
  // proiettili
  for(const q of G.projs){const x=Math.round(q.x-cx),y=Math.round(q.y-cy);
    if(q.type==='barrel')(q.coin?drawBigCoin(x,y):drawBarrel(x,y,q.rot));
    else if(q.type==='orb'){px(x,y+1,8,6,'#1a3a0a');px(x+1,y,6,8,'#1a3a0a');px(x+1,y+1,6,6,'#6ab02a');px(x+2,y+2,3,3,G.frame%8<4?'#e0ff8a':'#b0e050');}
    else if(q.type==='fire'){px(x,y+1,8,6,'#8a1a08');px(x+1,y,6,8,'#8a1a08');px(x+1,y+1,6,6,'#ff6020');px(x+2,y+2,4,4,'#ffd060');}
    else if(q.type==='shriek'){const r=G.frame%10<5;px(x,y+2,8,4,r?'#d04aa0':'#8a3a9a');px(x+2,y,4,8,r?'#d04aa0':'#8a3a9a');px(x+2,y+2,4,4,'#120818');}
    else if(q.type==='wave'){px(x,y+4,10,4,'#8a7a5a');px(x+2,y+1,6,3,'#b0a07a');px(x+3,y,4,1,'#ffffff');}
    else if(q.type==='thorn'){
      if(q.ph<=q.warn){if((q.ph>>2)%2)for(let i=0;i<12;i+=3)px(x+i,floorY-cy-2,2,2,'#9ae02a');}
      else{const hg=Math.min(28,(q.ph-q.warn)*4),base=floorY-cy;for(let i=0;i<3;i++){ctx.fillStyle='#1a3a0a';for(let j=0;j<hg;j++){const w=Math.max(0,Math.round(2*(j/hg)));ctx.fillRect(x+2+i*4-w,base-hg+j,w*2+1,1);}}px(x+3,base-hg+4,1,hg-4,'#4a8a2a');px(x+7,base-hg+2,1,hg-2,'#6ab02a');}}
  }
  drawPlayer(cx,cy);
  for(const p of G.parts)px(p.x-cx,p.y-cy,p.life>12?2:1,p.life>12?2:1,p.col);
}
function drawBigCoin(x,y){const w=[10,7,3,7][(G.frame>>2)%4],o=(10-w)/2;px(x+o,y,w,10,'#6a0a10');px(x+o+1,y+1,Math.max(1,w-2),8,'#f0c040');if(w>4){px(x+o+2,y+2,w-4,6,'#c8901a');px(x+4,y+3,2,4,'#fff2b0');}}
function drawSack(x,y){px(x+3,y,6,3,'#3a2414');px(x+1,y+3,10,9,'#3a2414');px(x+2,y+4,8,7,'#8a6a3a');px(x+4,y+1,4,2,'#8a6a3a');px(x+5,y+6,2,3,'#f0c040');}
function drawBarrel(x,y,r){px(x+2,y,6,10,'#1a0c06');px(x,y+2,10,6,'#1a0c06');px(x+1,y+1,8,8,'#1a0c06');px(x+2,y+1,6,8,'#8a5428');px(x+1,y+2,8,6,'#8a5428');const s=((Math.round(r)%3)+3)%3;px(x+1,y+2+s*2,8,1,'#4a2a12');px(x+3,y+2,1,6,'#b07a40');}
function drawPlayer(cx,cy){
  const p=G.P;
  if(G.state==='play'&&p.inv>0&&(p.inv>>2)%2)return;
  let f='idle';
  if(G.state==='dead'||!p.onGround)f='jump';else if(Math.abs(p.vx)>.3)f=(p.anim>>3)%2?'run1':'run2';
  const L=p.dir<0,dx=Math.round(p.x-3-cx),dy=Math.round(p.y-4-cy);
  ctx.drawImage(BAR[f][L?1:0],dx,dy);
  if(G.state==='dead')return;
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
export function drawHUD(){
  const n=Math.max(3,G.P.hp);
  for(let i=0;i<n;i++)ctx.drawImage(i<G.P.hp?HEART:HEART_E,6+i*9,6);
  ctx.drawImage(COIN,6,16);
  ctx.drawImage(BAR.idle[0],0,0,16,15,W-46,3,16,15);
  if(G.boss&&G.fight){const bw=150,x0=(W-bw)/2,y0=H-10;px(x0-2,y0-2,bw+4,7,'#0a0408');px(x0,y0,bw,3,'#3a1a20');px(x0,y0,Math.round(bw*Math.max(0,G.boss.hp)/G.boss.max),3,G.boss.i===5?'#ff5a2a':'#d8344a');px(x0,y0,Math.round(bw*Math.max(0,G.boss.hp)/G.boss.max),1,'#ff9aa8');}
}
export function hudText(){
  text(String(G.coins),16*S+6,20*S,30,'#f3e3c3','left');
  if(CHEATS.lives||CHEATS.god||CHEATS.kill||devUnlock())text('TRUCCHI ATTIVI',6*S,30*S,18,'#e8b84a','left',600);
  text('×'+Math.max(0,G.lives),(W-28)*S,10*S,30,'#f3e3c3','left');
  if(G.boss&&G.fight){const d=BOSS_DEF[G.boss.i];text(d.name,W*S/2,(H-17)*S,28,'#f3e3c3');
    if(G.boss.intro>0){const a=Math.min(1,G.boss.intro/20,(120-G.boss.intro)/20);out.globalAlpha=a;band(150,170);text(d.sub.toUpperCase(),W*S/2,195,26,'#e8b84a');text(d.name,W*S/2,262,64,'#f3e3c3','center',700);out.globalAlpha=1;}}
}
