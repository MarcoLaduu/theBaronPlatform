// Disegno del mondo di gioco e dell'HUD.
import { ctx, out, px } from '../canvas.js';
import { H, ROWS, S, T, W, floorY } from '../config.js';
import { BAR, HAT } from '../graphics/barux.js';
import { BOSS_DEF, BOSS_SPR, bossFrame } from '../graphics/bosses.js';
import { LANCE, REKTER_HEAD_ROWS } from '../graphics/bossArt.js';
import { flip } from '../utils.js';
const LANCE_SPR=(()=>{const c=LANCE();return [c,flip(c)];})();
import { KINDS } from '../graphics/enemies.js';
import { COIN, HEART, HEART_E } from '../graphics/items.js';
import { band, text, textWidth, triFill } from './draw.js';
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
  drawCorpses(cx,cy);
  // entità
  for(const e of G.ents){
    if(!e.alive&&e.t!=='flag')continue;
    const x=Math.round(e.x-cx),y=Math.round(e.y-cy);
    if(x<-30||x>W+30)continue;
    if(e.t==='en'){const K=KINDS[e.kind];drawEnemy(e,K,x,y);
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
  if(G.boss&&G.boss.lava){const L=G.boss.lava,ax0=(G.lvl.A+1)*T,ax1=(G.lvl.A+19)*T,mid=(ax0+ax1)/2; // lava della seconda fase di Anlaucer
    const zx=(L.side<0?ax0:mid)-cx,zw=(ax1-ax0)/2,fy=floorY-cy;
    if(L.ph==='warn'){ctx.globalAlpha=(G.frame>>3)%2?.55:.25;px(zx,fy,zw,16,'#ff3020');ctx.globalAlpha=1;if((G.frame>>3)%2)px(zx,fy,zw,2,'#ffb040');}
    else if(L.ph==='on'||(L.ph==='off'&&L.k<30)){ctx.globalAlpha=L.ph==='on'?1:1-L.k/30;
      px(zx,fy-1,zw,17,'#c8300a');px(zx,fy+6,zw,10,'#8a1a08');
      for(let x=0;x<zw;x+=4){const h=2+(Math.sin((x+cx)*.25+G.frame*.12)>0?1:0);px(zx+x,fy-1-h,4,h+1,'#ff7020');
        if(((x>>2)+(G.frame>>4))%5===0)px(zx+x+1,fy,2,2,'#ffd060');}
      ctx.globalAlpha=1;}}
  if(G.boss&&G.boss.st==='anla'&&G.boss.k<70&&(G.frame>>2)%2){const ax0=(G.lvl.A+1)*T;ctx.globalAlpha=.6;px(ax0-cx,G.boss.anlaY+6-cy,18*T,2,'#ff60c0');ctx.globalAlpha=1;} // avviso: linea dove passerà il raggio
  if(G.boss){const b=G.boss,sp=bossFrame(b.i,bossPose(b)),face=b.face>0;
    let img=((b.inv>0&&(b.inv>>1)%2)||(b.i===4&&b.st==='warn'&&(G.frame>>2)%2))?(face?sp.wr:sp.wl):(face?sp.r:sp.l);
    const sw=img.width,sh=img.height;
    let bx=Math.round(b.x+b.w/2-sw/2-cx),by=Math.round(b.y+b.h-sh-cy);
    if(b.st==='dying'){bx+=Math.round((Math.random()-.5)*4);if((b.k>>2)%2)img=face?sp.wr:sp.wl;}
    ctx.globalAlpha=b.alpha??1;
    if(b.i===5&&b.big){ // seconda fase: più grande e incandescente
      ctx.save();ctx.filter='saturate(1.7) brightness(1.15)';
      ctx.drawImage(img,Math.round(b.x+b.w/2-sw*1.25/2-cx),Math.round(b.y+b.h-sh*1.25-cy),Math.round(sw*1.25),Math.round(sh*1.25));ctx.restore();}
    else if(b.i===5&&b.st==='transform'&&b.k<70&&(b.k>>2)%2){ctx.drawImage(face?sp.wr:sp.wl,bx+((G.frame>>1)%2?1:-1),by);}
    else if(b.i===2&&(b.st==='cling'||b.st==='toWall')){ // aggrappato al muro: ruotato di 90° con le zampe verso la parete
      const u=b.st==='cling'?1:Math.min(1,b.k/40),ang=(b.wallDir>0?1:-1)*Math.PI/2*u;
      ctx.save();ctx.translate(Math.round(b.x+b.w/2-cx),Math.round(b.y+b.h/2-cy));ctx.rotate(ang);ctx.drawImage(img,-sw/2,-sh/2);ctx.restore();}
    else if(b.i===2&&b.st==='idle'&&(b.k<8||b.k>(b.hp<=b.max/2?35:55)-10)){ctx.drawImage(img,bx-2,by+4,sw+4,sh-4);} // schiacciato all'atterraggio e prima di saltare
    else if(b.i===2&&b.st==='air'&&b.vy<0){ctx.drawImage(img,bx+1,by-3,sw-2,sh+3);}                             // allungato in salita
    else if(b.i===3&&b.phase2){ // corpo senza testa, con fiamme spettrali al posto dell'elmo
      const sx=b.st==='wake'?((G.frame>>1)%2?1:-1)*(b.k<120?1:0):b.st==='aim'?((G.frame>>1)%2?1:-1)*(b.k>20?1:0):0; // trema mentre si riprende
      const hr=REKTER_HEAD_ROWS;ctx.drawImage(img,0,hr,sw,sh-hr,bx+sx,by+hr,sw,sh-hr);
      for(let i=0;i<6;i++){const fx=bx+sx+sw/2-6+i*2,fh=3+((G.frame>>2)+i*3)%5;px(fx,by+hr+1-fh,2,fh,i%2?'#9a6ad8':'#e0d0ff');}}
    else if(b.i===3&&b.st==='aim'){ctx.drawImage(img,bx+((G.frame>>1)%2?1:-1)*(b.k>30?1:0),by);}
    else ctx.drawImage(img,bx,by);
    ctx.globalAlpha=1;
    if(b.i===3&&b.st!=='dying'){ // lancia da torneo stretta nel guanto e puntata in avanti
      if(b.st!=='stun'){const lc=LANCE_SPR[b.face>0?0:1],lx=b.face>0?b.x+17:b.x+b.w-17-lc.width;ctx.drawImage(lc,Math.round(lx-cx),Math.round(b.y+18-cy));}
      else for(let i=0;i<3;i++){const a=G.frame*.15+i*2.1;px(b.x+b.w/2-cx+Math.cos(a)*10,b.y-6-cy+Math.sin(a)*3,2,2,'#ffe040');}}
    if(b.helm&&b.helm.alive&&!(b.helm.inv>0&&(b.helm.inv>>1)%2)){const h=b.helm,hs=G.P.x<h.x+12?BOSS_SPR[3].l:BOSS_SPR[3].r;ctx.drawImage(hs,0,0,32,REKTER_HEAD_ROWS,Math.round(h.x-4-cx),Math.round(h.y+2-cy),32,REKTER_HEAD_ROWS);} // l'elmo staccato è lo stesso del boss
    if(b.i===0&&b.st!=='dying'&&b.throwEvery&&b.t%b.throwEvery>b.throwEvery-30){drawSack(b.x+b.w/2-6-cx,b.y-12-cy);}
  }
  // proiettili
  for(const q of G.projs){const x=Math.round(q.x-cx),y=Math.round(q.y-cy);
    if(q.type==='barrel')(q.coin?drawBigCoin(x,y):drawBarrel(x,y,q.rot));
    else if(q.type==='orb'){px(x,y+1,8,6,'#1a3a0a');px(x+1,y,6,8,'#1a3a0a');px(x+1,y+1,6,6,'#6ab02a');px(x+2,y+2,3,3,G.frame%8<4?'#e0ff8a':'#b0e050');}
    else if(q.type==='fire'){px(x,y+1,8,6,'#8a1a08');px(x+1,y,6,8,'#8a1a08');px(x+1,y+1,6,6,'#ff6020');px(x+2,y+2,4,4,'#ffd060');}
    else if(q.type==='sonic'){const d=q.vx>=0?1:-1,cx0=x+(d>0?0:12),cy0=y+9;
      for(let i=0;i<3;i++){const r=4+i*4,col=((G.frame>>2)+i)%2?'#e0d0ff':'#9a6ad8';
        for(let a=-1;a<=1;a+=.18)px(cx0+d*Math.cos(a)*r,cy0+Math.sin(a)*r*1.1,1,1,col);}}
    else if(q.type==='rock'){const sy=floorY-cy-2,near=q.warn<=0?1:Math.max(.3,1-q.warn/60);
      if(q.warn>0?(q.warn>>2)%2:true){const w=Math.round(6+8*near);px(x+6-w/2,sy,w,2,'#0a0a10');}
      if(q.warn<=0){px(x+2,y,8,12,'#1a1c28');px(x,y+2,12,8,'#1a1c28');px(x+2,y+1,8,10,'#5a5e72');px(x+1,y+2,10,8,'#5a5e72');px(x+3,y+2,4,3,'#8a8ea2');px(x+7,y+7,3,2,'#3a3e52');}}
    else if(q.type==='anla'){const d=q.vx>0?1:-1;
      for(let i=0;i<q.w;i+=2){const t=d>0?i/q.w:1-i/q.w,hh=Math.round(4+10*t),w2=Math.sin(i*.5+G.frame*.6)>0;
        px(x+i,y+7-hh/2,2,hh,t>.8?'#ffffff':w2?'#ff60c0':'#c040a0');if(t>.3)px(x+i,y+7-hh/4,2,hh/2,'#ffd0f0');}}
    else if(q.type==='beam'){px(x,y,6,6,'#8a1010');px(x+1,y+1,4,4,'#ff4030');px(x+2,y+2,2,2,'#ffd0c0');}
    else if(q.type==='shriek'){const r=G.frame%10<5;px(x,y+2,8,4,r?'#d04aa0':'#8a3a9a');px(x+2,y,4,8,r?'#d04aa0':'#8a3a9a');px(x+2,y+2,4,4,'#120818');}
    else if(q.type==='wave'){px(x,y+4,10,4,'#8a7a5a');px(x+2,y+1,6,3,'#b0a07a');px(x+3,y,4,1,'#ffffff');}
    else if(q.type==='thorn'){
      if(q.ph<=q.warn){if((q.ph>>2)%2)for(let i=0;i<12;i+=3)px(x+i,floorY-cy-2,2,2,'#9ae02a');}
      else{const hg=Math.min(28,(q.ph-q.warn)*4),base=floorY-cy;for(let i=0;i<3;i++){ctx.fillStyle='#1a3a0a';for(let j=0;j<hg;j++){const w=Math.max(0,Math.round(2*(j/hg)));ctx.fillRect(x+2+i*4-w,base-hg+j,w*2+1,1);}}px(x+3,base-hg+4,1,hg-4,'#4a8a2a');px(x+7,base-hg+2,1,hg-2,'#6ab02a');}}
  }
  drawPlayer(cx,cy);
  if(G.oneUpT>0){ // testa del Barone + "+1" che sale quando guadagna una vita
    const t=70-G.oneUpT,x=Math.round(G.P.x+G.P.w/2-15-cx),y=Math.round(G.P.y-24-cy-Math.min(t,24)*.5);
    if(G.oneUpT>18||(G.oneUpT>>1)%2){
      ctx.drawImage(BAR.idle[0],0,0,16,15,x,y,16,15);
      const glyph=(cells,ox,oy)=>{for(const [a,b] of cells)px(ox+a-1,oy+b-1,3,3,'#1a1020');for(const [a,b] of cells)px(ox+a,oy+b,1,1,b<2?'#fff2b0':'#e8b84a');};
      glyph([[2,0],[2,1],[0,2],[1,2],[2,2],[3,2],[4,2],[2,3],[2,4]],x+18,y+6);
      glyph([[1,0],[0,1],[1,1],[1,2],[1,3],[0,4],[1,4],[2,4]],x+25,y+6);}}
  for(const p of G.parts)px(p.x-cx,p.y-cy,p.life>12?2:1,p.life>12?2:1,p.col);
}
function drawBigCoin(x,y){const w=[10,7,3,7][(G.frame>>2)%4],o=(10-w)/2;px(x+o,y,w,10,'#6a0a10');px(x+o+1,y+1,Math.max(1,w-2),8,'#f0c040');if(w>4){px(x+o+2,y+2,w-4,6,'#c8901a');px(x+4,y+3,2,4,'#fff2b0');}}
function drawSack(x,y){px(x+3,y,6,3,'#3a2414');px(x+1,y+3,10,9,'#3a2414');px(x+2,y+4,8,7,'#8a6a3a');px(x+4,y+1,4,2,'#8a6a3a');px(x+5,y+6,2,3,'#f0c040');}
function drawBarrel(x,y,r){px(x+2,y,6,10,'#1a0c06');px(x,y+2,10,6,'#1a0c06');px(x+1,y+1,8,8,'#1a0c06');px(x+2,y+1,6,8,'#8a5428');px(x+1,y+2,8,6,'#8a5428');const s=((Math.round(r)%3)+3)%3;px(x+1,y+2+s*2,8,1,'#4a2a12');px(x+3,y+2,1,6,'#b07a40');}
// sceglie il fotogramma del Barone: [nome, spostamento verticale]
const RUN=[['run1',0],['run2',-1],['run3',0],['run4',-1]];
function playerFrame(p){
  if(G.state==='dead')return ['dead',0];
  if(p.knock>0)return ['hurt',0];
  if(!p.onGround)return [p.vy<-.5?'rise':'fall',0];
  if(p.atk>6&&!p.air)return ['lean',0];
  if(p.landT>0)return ['land',0];
  if(Math.abs(p.vx)>.3)return RUN[(p.anim>>2)%4];
  const t=p.idleT||0;
  if(t%150>=140&&t%150<146)return ['blink',0];        // ogni tanto sbatte le palpebre
  return [(t>>5)%2?'breath':'idle',0];                  // respira
}
// bastone a riposo: pomo dorato in alto, punta che si sposta di "lean" pixel
function drawCane(x,y,lean,len=7){for(let i=0;i<len;i++)px(Math.round(x+lean*i/(len-1)),y+2+i,1,1,'#4a2a14');px(x-1,y,3,2,'#e8b84a');}
function drawPlayer(cx,cy){
  const p=G.P;
  if(G.state==='play'&&p.inv>0&&(p.inv>>2)%2)return;
  const [f,oy]=playerFrame(p);
  const L=p.dir<0,dir=L?-1:1,dx=Math.round(p.x-3-cx),dy=Math.round(p.y-4-cy)+oy;
  ctx.drawImage(BAR[f][L?1:0],dx,dy);
  if(G.state==='dead'){
    // il cilindro vola via girando
    const t=G.stT,hx=Math.round(p.deathX-3-cx-dir*t*.9),hy=Math.round(p.deathY-4-cy-t*3.2+t*t*.09),h=HAT[L?1:0];
    ctx.save();ctx.translate(hx+8,hy+5);ctx.rotate(-dir*((t>>2)%4)*Math.PI/2);ctx.drawImage(h,-8,-5);ctx.restore();
    return;
  }
  const hx=L?dx+2:dx+13;
  if(p.atk>0){
    // mezzaluna: in volo gira tutt'attorno (sopra, davanti, sotto), a terra solo davanti, dall'alto verso i piedi
    const air=p.air,a0=air?-1.8:-1.5,a1=air?1.8:1.05,R=air?14:12,prog=Math.min(1,(14-p.atk)/9),cur=a0+(a1-a0)*prog,cxp=dx+8,cyp=dy+(air?15:13),fade=p.atk<5?p.atk/5:1;
    for(let a=a0;a<=cur;a+=.05){const age=(cur-a)/(a1-a0);if(age>.8)continue;ctx.globalAlpha=(1-age/.8)*fade;
      const w=1+Math.round((air?4:3)*Math.cos(a*.85));
      for(let r=R;r<=R+w;r++){const col=r===R+w?'#ffffff':(r<=R+1?'#e8b84a':'#fff2b0');px(cxp+dir*Math.cos(a)*r,cyp+Math.sin(a)*r,1,1,col);}}
    ctx.globalAlpha=1;
    if(p.atk>4){for(let r=3;r<=R-1;r++)px(cxp+dir*Math.cos(cur)*r,cyp+Math.sin(cur)*r,1,1,'#4a2a14');px(cxp+dir*Math.cos(cur)*R-1,cyp+Math.sin(cur)*R-1,3,3,'#e8b84a');return;}
  }
  // il bastone segue la posa: oscilla nella corsa, si alza nel salto, si inclina quando lo colpiscono
  if(f.startsWith('run'))drawCane(hx,dy+15,dir*[2,0,-2,0][RUN.findIndex(r=>r[0]===f)]);
  else if(f==='rise')drawCane(hx,dy+13,dir*2,6);
  else if(f==='fall')drawCane(hx,dy+14,-dir,7);
  else if(f==='land')drawCane(hx,dy+17,dir,6);
  else if(f==='hurt')drawCane(hx-dir,dy+15,-dir*2);
  else drawCane(hx,dy+15+(f==='breath'?1:0),0);
}
// posa del boss in questo fotogramma, in base a cosa sta facendo
function bossPose(b){
  const f=G.frame,o={},blink=f%170>163,act=b.act>0,dying=b.st==='dying';
  if(dying){o.blink=1;if(b.i!==3)o.mouth=1;}
  switch(b.i){
  case 0:{const lift=b.throwEvery&&b.t%b.throwEvery>b.throwEvery-30;
    if(lift||act)o.arms=-3;else if(b.onGround){const c=(f>>3)%4;o.arms=c%2;if(c===1)o.legs=1;if(c===3)o.legs=2;}else o.arms=-1;
    if(act)o.mouth=1;break;}
  case 1:o.sway=[0,1,2,1,0,-1,-2,-1][(f>>3)%8];if(act)o.cast=1;break;
  case 2:if(b.st==='idle'&&b.onGround)o.belly=[0,1,2,1][(f>>4)%4];if(act||(b.st==='cling'&&b.k%30>24))o.mouth=1;break;
  case 3:{const ch=b.st==='charge';if(dying){o.eyes=0;break;}o.plume=(f>>(ch?2:4))%2;if(ch){const c=(f>>2)%4;if(c===1)o.legs=1;if(c===3)o.legs=2;}
    o.eyes=b.st==='stun'||b.st==='wake'?0:(b.st==='aim'&&b.k>(b.phase2?10:25))||ch?2:1;break;}
  case 4:o.flap=b.st==='dive'?.6:b.st==='rest'?.35:[-.1,.15,.35,.15][(f>>(b.st==='warn'?1:2))%4];if(act||b.st==='warn')o.mouth=1;break;
  case 5:o.flap=[-.2,.05,.3,.05][(f>>(b.st==='swoop'?2:3))%4];o.tail=[0,1,0,-1][(f>>4)%4];
    if(act||b.st==='anla'||b.st==='transform'||b.shout>0)o.mouth=1;break;
  }
  if(blink&&!o.mouth&&!dying)o.blink=1;
  if(o.eyes!==undefined&&o.blink)delete o.blink; // Ser Rekter non ha palpebre
  if(o.flap===0)delete o.flap;
  return o;
}
// scagnozzo: fotogramma, saltelli, schiacciamenti e lampo bianco quando è colpito
function drawEnemy(e,K,x,y){
  const R=e.dir>0,fly=K.fly,moving=Math.abs(e.vx||0)>.1;
  const sp=fly||(K.ai==='charge'&&e.st==='charge')?2:3;                   // chi vola o carica si muove più in fretta
  let i=(e.t0>>sp)%K.fr.length;
  if(K.ai==='hop')i=(e.onGround&&e.k<40&&e.t0%120>112)?1:0;               // il rospetto ogni tanto sbatte le palpebre
  if(K.ai==='throw'||K.ai==='hop'||(K.ai==='charge'&&e.st!=='charge'&&!moving))i=K.ai==='hop'?i:0;
  let img=(e.hurtT>0&&(e.hurtT>>1)%2)?(R?K.wr:K.wl)[i]:(R?K.fr:K.frL)[i];
  if(K.thr&&e.act&&!(e.hurtT>0&&(e.hurtT>>1)%2))img=K.thr[R?0:1];
  let w=img.width,h=img.height,oy=0,ox=0;
  if(!fly&&e.onGround){
    if(moving&&K.ai!=='hop')oy=(e.t0>>2)%2?-1:0;                               // saltella camminando
    else if(K.ai==='hop'&&e.k>36){w+=2;h-=2;}                                  // si accuccia prima del salto
    else if(!moving&&(e.t0>>5)%2){w+=1;h-=1;}}                                // respira da fermo
  if(!fly&&!e.onGround&&K.ai==='hop'){w-=2;h+=2;}                              // si allunga in volo
  if(K.ai==='charge'&&e.st==='charge')ox=R?1:-1;                               // si butta in avanti
  if(K.ai==='charge'&&e.st==='rest')ox=(e.t0>>2)%2?1:-1;                       // stordito dopo la carica
  if(e.hurtT>14){w+=2;h-=2;}                                                   // schiacciato dal colpo
  ctx.drawImage(img,Math.round(x+e.w/2-w/2)+ox,y+e.h-h+oy,w,h);
}
function drawCorpses(cx,cy){
  for(const c of G.corpses){const w=c.img.width,h=c.img.height,X=Math.round(c.x-cx),Y=Math.round(c.y-cy);
    if(c.mode==='flat'){const hh=Math.max(2,Math.round(h*(c.t<4?1-c.t*.15:.3))),ww=Math.round(w*(c.t<4?1+c.t*.08:1.3));
      ctx.globalAlpha=c.t>14?1-(c.t-14)/10:1;ctx.drawImage(c.img,X-ww/2,Y-hh,ww,hh);ctx.globalAlpha=1;}
    else{ctx.save();ctx.translate(X,Y-h/2);ctx.rotate(c.spin*((c.t>>2)%4)*Math.PI/2);ctx.globalAlpha=c.t>55?1-(c.t-55)/15:1;ctx.drawImage(c.img,-w/2,-h/2);ctx.restore();}}
}
export function drawHUD(){
  const n=Math.max(3,G.P.hp);
  for(let i=0;i<n;i++)ctx.drawImage(i<G.P.hp?HEART:HEART_E,6+i*9,6);
  ctx.drawImage(COIN,6,16);
  ctx.drawImage(BAR.idle[0],0,0,16,15,W-46,3,16,15);
  if(G.boss&&G.fight){const bw=150,x0=(W-bw)/2,y0=H-10;px(x0-2,y0-2,bw+4,7,'#0a0408');px(x0,y0,bw,3,'#3a1a20');px(x0,y0,Math.round(bw*Math.max(0,G.boss.hp)/G.boss.max),3,G.boss.i===5?'#ff5a2a':'#d8344a');px(x0,y0,Math.round(bw*Math.max(0,G.boss.hp)/G.boss.max),1,'#ff9aa8');}
}
// fumetto in pixel art sopra la testa del boss, spostato verso il centro dell'arena
function speechBubble(b,str){
  const u=S,size=44,tw=textWidth(str,size,700),bw=Math.ceil((tw+14*u)/u)*u,bh=16*u;
  const hx=(b.x+b.w/2-cam.x)*S,hy=(b.y-cam.y)*S,side=b.dir<0?1:-1; // il fumetto va verso il centro
  let x=Math.round(hx+side*6*u-(side<0?bw:0)),y=Math.round(hy-bh-10*u);
  x=Math.max(2*u,Math.min(W*S-bw-2*u,x));y=Math.max(2*u,y);
  const pop=b.shout>92?(100-b.shout)/8:1;out.save();out.translate(hx,y+bh);out.scale(pop,pop);out.translate(-hx,-(y+bh));
  const rect=(rx,ry,rw,rh,c)=>{out.fillStyle=c;out.fillRect(rx,ry,rw,rh);};
  const body=(o,c)=>{rect(x+u-o,y-o,bw-2*u+2*o,bh+2*o,c);rect(x-o,y+u-o,bw+2*o,bh-2*u+2*o,c);};
  const tx=side>0?x+4*u:x+bw-10*u,tail=(o,c)=>{for(let i=0;i<6;i++)rect(tx-side*i*u+(side<0?i*u:0)-o,y+bh+i*u-u,(6-i)*u+2*o,u+o,c);};
  body(u,'#0a0408');tail(u,'#0a0408');body(0,'#fff4fa');tail(0,'#fff4fa');
  rect(x+u,y+bh-2*u,bw-2*u,u,'#f0c8dc'); // ombra interna
  const j=(G.frame>>1)%2?u/2:-u/2;
  out.font=`700 ${size}px 'Pixelify Sans','Courier New',monospace`;out.textAlign='center';out.textBaseline='middle';
  out.fillStyle='#c02070';out.fillText(str,x+bw/2+j,y+bh/2+u/2);
  out.restore();
}
export function hudText(){
  text(String(G.coins),16*S+6,20*S,30,'#f3e3c3','left');
  if(CHEATS.lives||CHEATS.god||CHEATS.kill||devUnlock())text('TRUCCHI ATTIVI',6*S,30*S,18,'#e8b84a','left',600);
  text('×'+Math.max(0,G.lives),(W-28)*S,10*S,30,'#f3e3c3','left');
  if(G.boss&&G.fight){const d=BOSS_DEF[G.boss.i];text(d.name,W*S/2,(H-17)*S,28,'#f3e3c3');
    if(G.boss.shout>0)speechBubble(G.boss,'ANLACI!!');
    if(G.boss.intro>0){const a=Math.min(1,G.boss.intro/20,(120-G.boss.intro)/20);out.globalAlpha=a;band(150,170);text(d.sub.toUpperCase(),W*S/2,195,26,'#e8b84a');text(d.name,W*S/2,262,64,'#f3e3c3','center',700);out.globalAlpha=1;}}
}
