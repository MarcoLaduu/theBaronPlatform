// Comportamento dei boss.
import { music, sfx } from '../audio/audio.js';
import { ROWS, T, floorY } from '../config.js';
import { puff } from '../core/particles.js';
import { spawnEnt } from './entities.js';
import { hurt } from './player.js';
import { BOSS_DEF } from '../graphics/bosses.js';
import { keys } from '../input.js';
import { CHEATS } from '../save.js';
import { G } from '../state.js';
import { clamp, overlap } from '../utils.js';
import { moveBody } from '../world/physics.js';
import { THEMES } from '../world/themes.js';

function arena(){return {x0:(G.lvl.A+1)*T,x1:(G.lvl.A+19)*T};}
export function startFight(){
  G.fight=true;G.levelRun.bossHit=false;for(let r=0;r<ROWS;r++)G.lvl.g[r][G.lvl.A]='#';
  const d=BOSS_DEF[G.lvlIndex],{x1}=arena();
  G.boss={i:G.lvlIndex,x:x1-50-d.w,y:floorY-d.h,w:d.w,h:d.h,vx:0,vy:0,hp:d.hp,max:d.hp,t:0,k:0,st:'idle',dir:-1,face:-1,inv:0,intro:120,alpha:1,visible:true};
  if(G.boss.i===1)G.boss.baseY=floorY-d.h-4;
  if(G.boss.i===4)G.boss.y=floorY-104;
  if(G.boss.i===5)G.boss.y=floorY-84;
  music(3);sfx('roar');G.shake=6;
}
function damageBoss(){
  G.boss.hp=CHEATS.kill?0:G.boss.hp-1;G.boss.inv=30;sfx('bossHit');G.shake=5;puff(G.boss.x+G.boss.w/2,G.boss.y+G.boss.h/2,'#ffd84a',10,2.2);
  const b=G.boss;
  // Ser Rekter, seconda fase: a metà vita l'armatura si spacca e l'elmo si stacca e combatte da solo
  if(b.i===3&&!b.phase2&&b.hp>0&&b.hp<=b.max/2){
    b.phase2=true;b.inv=60;b.st='wake';b.k=0;b.vx=0;G.shake=12;sfx('boom');
    puff(b.x+b.w/2,b.y+6,'#c8ccd8',24,3);puff(b.x+b.w/2,b.y+6,'#9a6ad8',12,2);
    b.helm={x:b.x+b.w/2-12,y:b.y-4,w:24,h:18,vy:-4.5,t:0,hp:2,inv:50,alive:true,state:'pop'};}
  if(G.boss.hp<=0&&b.helm&&b.helm.alive){b.helm.alive=false;puff(b.helm.x+12,b.helm.y+9,'#ff4030',20,3);}
  if(G.boss.hp<=0){G.boss.st='dying';G.boss.k=0;G.projs=[];G.ents.forEach(e=>{if(e.summoned&&e.alive){e.alive=false;puff(e.x+5,e.y+6,'#c42c38',8);}});}
}
export function updateBoss(){
  const b=G.boss;
  if(b.intro>0){b.intro--;if(b.i===0||b.i===2||b.i===3){b.vy=Math.min(b.vy+.35,6);b.vx=0;moveBody(b);}return;}
  if(b.inv>0)b.inv--;
  b.t++;
  const {x0,x1}=arena();
  const px=G.P.x+G.P.w/2,bx=b.x+b.w/2,toP=px<bx?-1:1,low=b.hp<=b.max/2;
  if(b.st==='dying'){
    b.k++;G.shake=4;
    if(b.k%5===0)puff(b.x+Math.random()*b.w,b.y+Math.random()*b.h,['#ffd84a','#ff6020','#ffffff'][b.k%3],10,2.5);
    if(b.k%18===0)sfx('boom');
    if(b.k>110){puff(bx,b.y+b.h/2,'#ffffff',30,3.5);sfx('portal');
      G.portal={x:(G.lvl.A+10)*T-12,y:floorY-36,w:24,h:36,t:0};G.boss=null;music(THEMES[G.lvlIndex].song);}
    return;
  }
  switch(b.i){
  case 0:{ // Pushing: primo boss, volutamente facile. Cammina piano e lancia una moneta alla volta.
    b.vx=b.dir*(low?.8:.5);b.vy=Math.min(b.vy+.35,6);
    if(low&&b.onGround&&b.t%240===120)b.vy=-4.5; // salta solo quando è a metà vita
    moveBody(b);if(b.hitWall)b.dir*=-1;
    b.face=toP;
    b.throwEvery=low?110:140; // il sacchetto sopra la testa avvisa 30 frame prima del lancio
    if(b.t%b.throwEvery===0){G.projs.push({type:'barrel',coin:true,x:bx-5,y:b.y,w:10,h:10,vx:toP*(.9+Math.random()*.4),vy:-4.2,life:420,rot:0});sfx('throw');}
    break;}
  case 1:{ // Gankàla: teletrasporto, rovi dal terreno, sfere
    b.y=b.baseY+Math.sin(b.t*.05)*3;
    if(b.st==='idle'){b.face=toP;b.alpha=1;b.visible=true;
      if(b.t%(low?60:85)===0){const xs=low?[px-42,px-6,px+30]:[px-6];xs.forEach(x=>G.projs.push({type:'thorn',x:clamp(x,x0,x1-12),y:floorY-28,w:12,h:28,ph:0,warn:40,life:999}));sfx('cast');}
      if(b.t%110===55){const a=Math.atan2(G.P.y+10-(b.y+12),px-bx);G.projs.push({type:'orb',x:bx-4,y:b.y+10,w:8,h:8,vx:Math.cos(a)*1.6,vy:Math.sin(a)*1.6,life:300});sfx('cast');}
      if(b.t%170===0){b.st='fade';b.k=0;}
    } else if(b.st==='fade'){b.k++;b.alpha=1-b.k/20;b.visible=b.k<8;
      if(b.k>=20){let nx,tries=0;do{nx=x0+10+Math.random()*(x1-x0-20-b.w);}while(Math.abs(nx+b.w/2-px)<70&&tries++<30);b.x=nx;b.st='appear';b.k=0;}
    } else if(b.st==='appear'){b.k++;b.alpha=b.k/20;b.visible=b.k>12;if(b.k>=20)b.st='idle';}
    break;}
  case 2:{ // Pushatomìdir: grandi salti con onde d'urto; ogni tanto si aggrappa a un muro e spara ultrasuoni
    if(b.st==='idle'){b.vx*=.8;b.face=toP;b.k++;
      if(b.k>(low?35:55)&&b.onGround){
        b.jumps=(b.jumps||0)+1;
        // ogni 3 salti (ogni 2 quando è a metà vita) salta sul muro più lontano dal giocatore
        if(b.jumps%(low?2:3)===0){const left=px>(x0+x1)/2;b.st='toWall';b.k=0;b.sx=b.x;b.sy=b.y;
          b.wx=left?x0:x1-b.w;b.wy=floorY-96;b.wallDir=left?1:-1;sfx('jump');}
        else{b.st='air';b.vy=-6.8;b.vx=clamp((px-bx)/55,-2.6,2.6);b.k=0;sfx('jump');}}}
    if(b.st==='toWall'){ // balzo ad arco verso il muro
      b.k++;const u=Math.min(1,b.k/40);b.x=b.sx+(b.wx-b.sx)*u;b.y=b.sy+(b.wy-b.sy)*u-Math.sin(u*Math.PI)*40;b.face=b.wallDir;
      if(u>=1){b.st='cling';b.k=0;G.shake=6;sfx('slam');puff(b.wallDir>0?b.x:b.x+b.w,b.y+b.h/2,'#c8c4a0',10,1.6);}
      break;}
    if(b.st==='cling'){ // aggrappato al muro: ultrasuoni verso il giocatore
      b.k++;b.x=b.wx+Math.round(Math.sin(b.k*.6))*(b.k%30>22?1:0);b.y=b.wy;b.face=b.wallDir;
      const shots=low?4:3;
      if(b.k%30===0&&b.k<=shots*30){
        const ox=b.wallDir>0?b.x+b.w:b.x-12,oy=b.y+12,a=Math.atan2(G.P.y+10-oy,px-ox);
        G.projs.push({type:'sonic',x:ox,y:oy-9,w:12,h:18,vx:Math.cos(a)*2.3,vy:Math.sin(a)*2.3,dir:b.wallDir,life:260});sfx('screech');}
      if(b.k>shots*30+40){b.st='air';b.vy=-2;b.vx=b.wallDir*1.6;b.k=0;} // si stacca e ricade con un'onda d'urto
      break;}
    b.vy=Math.min(b.vy+.3,7);moveBody(b);
    if(b.st==='air'&&b.onGround){b.k++;if(b.k>2){b.st='idle';b.k=0;b.vx=0;G.shake=10;sfx('slam');
      G.projs.push({type:'wave',x:b.x-10,y:floorY-8,w:10,h:8,vx:-2.2,life:150},{type:'wave',x:b.x+b.w,y:floorY-8,w:10,h:8,vx:2.2,life:150});}}
    break;}
  case 3:{ // Ser Rekter: carica con la lancia, la miniera crolla quando sbatte; a metà vita si divide in due
    const p2=b.phase2;
    // dopo la rottura dell'armatura il corpo resta fermo circa 2,5 secondi prima di tornare all'attacco
    if(b.st==='wake'){b.vx=0;b.k++;if(b.k>150){b.st='aim';b.k=0;}}
    else if(b.st==='idle'||b.st==='aim'){b.st='aim';b.vx=0;b.face=toP;b.k++;if(b.k>(p2?30:low?40:65)){b.st='charge';b.dir=b.face;b.k=0;sfx('charge');}}
    else if(b.st==='charge')b.vx=b.dir*(p2?4.4:3.3);
    else if(b.st==='stun'){b.vx=0;b.k++;if(b.k>(p2?50:80)){b.st='aim';b.k=0;}}
    b.vy=Math.min(b.vy+.35,6);moveBody(b);
    if(b.st==='charge'&&b.hitWall){b.st='stun';b.k=0;G.shake=12;sfx('slam');puff(b.dir>0?b.x+b.w:b.x,b.y+14,'#c8ccd8',12,2);
      // crollo: massi e stalattiti cadono dal soffitto, con un'ombra a terra che avvisa poco prima
      const n=p2?6:4;
      for(let i=0;i<n;i++){const rx=i===0?clamp(px-6,x0+4,x1-16):x0+6+Math.random()*(x1-x0-24);
        G.projs.push({type:'rock',x:Math.round(rx),y:floorY-150,w:12,h:12,vx:0,vy:0,warn:45+i*14,life:600});}}
    if(b.st!=='stun'&&b.st!=='wake'){const lb={x:b.face>0?b.x+b.w:b.x-16,y:b.y+14,w:16,h:4};if(overlap(G.P,lb))hurt(bx);}
    // l'elmo staccato vola sopra l'arena e spara raggi dagli occhi
    const h=b.helm;
    if(h&&h.alive){h.t++;if(h.inv>0)h.inv--;
      if(h.state==='pop'){h.vy+=.2;h.y+=h.vy;if(h.vy>0)h.state='fly';}
      else{const tx=clamp(px-12+Math.sin(h.t*.03)*70,x0+4,x1-28),ty=floorY-92+Math.sin(h.t*.07)*10;h.x+=(tx-h.x)*.03;h.y+=(ty-h.y)*.05;
        if(h.t%95===0){const a=Math.atan2(G.P.y+10-(h.y+9),px-(h.x+12));G.projs.push({type:'beam',x:h.x+9,y:h.y+6,w:6,h:6,vx:Math.cos(a)*3,vy:Math.sin(a)*3,life:200});sfx('cast');}}
      const hitH=()=>{h.hp--;h.inv=20;sfx('bossHit');puff(h.x+12,h.y+9,'#ffd84a',8,2);
        if(h.hp<=0){h.alive=false;sfx('boom');G.shake=6;puff(h.x+12,h.y+9,'#ff4030',20,3);puff(h.x+12,h.y+9,'#c8ccd8',12,2);}};
      if(G.atkBox&&overlap(G.atkBox,h)){if(h.inv<=0)hitH();}
      else if(h.state!=='pop'&&overlap(G.P,h)){
        if(G.P.vy>.5&&G.P.y+G.P.h-h.y<8){G.P.vy=keys.jump?-6:-5;if(h.inv<=0)hitH();}
        else hurt(h.x+12);}}
    break;}
  case 4:{ // Griefilla: volteggia, strilla, picchiata
    const homeY=floorY-104,cx=(x0+x1)/2;
    const tx=cx-b.w/2+Math.sin(b.t*.02)*100;
    if(b.st==='idle'||b.st==='hover'){b.st='hover';b.k++;b.x+=(tx-b.x)*.2;b.y=homeY+Math.sin(b.t*.09)*6;
      if(b.k%(low?45:65)===0){for(const vx of [-.9,0,.9])G.projs.push({type:'shriek',x:bx-4,y:b.y+18,w:8,h:8,vx,vy:1.6,life:200,bounce:vx!==0});sfx('screech');}
      if(b.k>(low?120:170)){b.st='warn';b.k=0;b.again=false;sfx('screech');}}
    else if(b.st==='warn'){ // lampeggia prima della picchiata
      b.k++;b.y+=Math.sin(b.k*.8)*.6;
      if(b.k>(b.again?18:30)){b.st='dive';b.k=0;const dx=px-bx,dy=floorY-26-(b.y+b.h/2),d=Math.hypot(dx,dy)||1;b.vx=dx/d*4.4;b.vy=dy/d*4.4;}}
    else if(b.st==='dive'){b.x=clamp(b.x+b.vx,x0,x1-b.w);b.y+=b.vy;if(b.y+b.h>=floorY-2){b.y=floorY-2-b.h;b.st='rest';b.k=0;G.shake=5;}}
    else if(b.st==='rest'){b.k++;
      if(low&&!b.again&&b.k>14){b.st='hop';b.k=0;b.again=true;} // seconda picchiata quando è debole
      else if(b.k>(low?35:50))b.st='rise';}
    else if(b.st==='hop'){b.y-=3.6;b.x+=(cx-b.w/2-b.x)*.03;if(b.y<=floorY-84){b.st='warn';b.k=0;}}
    else if(b.st==='rise'){b.y-=1.6;b.x+=(tx-b.x)*.05;if(b.y<=homeY){b.st='hover';b.k=1;}}
    b.face=toP;
    break;}
  case 5:{ // Anlaucer
    const homeY=floorY-84,cx=(x0+x1)/2;
    if(b.st==='idle'||b.st==='hover'){b.st='hover';b.k++;b.face=toP;
      b.x+=(cx-b.w/2+Math.sin(b.t*.015)*90-b.x)*.05;b.y+=(homeY+Math.sin(b.t*.06)*8-b.y)*.1;
      if(b.k>(low?55:90)){b.k=0;const r=Math.random(),imps=G.ents.filter(e=>e.alive&&e.summoned).length;
        if(r<.4)b.st='fire';else if(r<.62&&imps<3)b.st='summon';else{b.st='swoop';b.dir=bx<cx?1:-1;b.ph=0;}}}
    else if(b.st==='fire'){b.k++;b.face=toP;
      if(b.k===20||b.k===50||(low&&b.k===80)){const n=low?7:5,base=Math.atan2(G.P.y+10-(b.y+b.h/2),px-bx);
        for(let j=0;j<n;j++){const a=base+(j-(n-1)/2)*.22;G.projs.push({type:'fire',x:bx-4,y:b.y+b.h/2-4,w:8,h:8,vx:Math.cos(a)*1.7,vy:Math.sin(a)*1.7,life:300});}sfx('fire');}
      if(b.k>(low?100:75)){b.st='hover';b.k=0;}}
    else if(b.st==='summon'){b.k++;if(b.k===30){for(const sx of [x0+20,x1-32]){const e=spawnEnt({t:'en',kind:'imp',x:sx,y:floorY-60});e.summoned=true;e.dir=sx<cx?1:-1;G.ents.push(e);puff(sx+5,floorY-54,'#ff6020',12,2);}sfx('cast');}if(b.k>60){b.st='hover';b.k=0;}}
    else if(b.st==='swoop'){const sx=b.dir>0?x0+4:x1-b.w-4;b.face=b.dir;
      if(b.ph===0){b.x+=(sx-b.x)*.08;b.y+=(homeY-b.y)*.08;if(Math.abs(sx-b.x)<3)b.ph=1;}
      else if(b.ph===1){b.y+=2.2;if(b.y+b.h>=floorY-4){b.y=floorY-4-b.h;b.ph=2;sfx('roar');}}
      else if(b.ph===2){b.x+=b.dir*(low?3.2:2.5);if(b.x<=x0+2||b.x+b.w>=x1-2)b.ph=3;}
      else{b.y-=1.8;if(b.y<=homeY){b.st='hover';b.k=0;}}}
    if(low&&b.t%6===0)G.parts.push({x:b.x+Math.random()*b.w,y:b.y+b.h,vx:0,vy:-.6,life:25,col:'#ff6020',g:0});
    break;}
  }
  // contatto con il giocatore
  if(b.visible!==false){
    if(G.atkBox&&overlap(G.atkBox,b)&&b.inv<=0)damageBoss();
    else if(overlap(G.P,b)&&G.boss&&G.boss.st!=='dying'){
      const stomp=G.P.vy>.5&&G.P.y+G.P.h-b.y<10;
      if(stomp){G.levelRun.stomped=true;if(b.inv<=0)damageBoss();G.P.vy=keys.jump?-6:-5;}
      else hurt(b.x+b.w/2);
    }
  }
}
