// Scagnozzi, monete, cuori, checkpoint e piattaforme mobili.
import { sfx } from '../audio/audio.js';
import { ROWS, T } from '../config.js';
import { puff } from '../core/particles.js';
import { checkGallery, stat, unlock } from '../data/achievements.js';
import { hurt } from './player.js';
import { KINDS } from '../graphics/enemies.js';
import { keys } from '../input.js';
import { CHEATS, markSeen } from '../save.js';
import { G } from '../state.js';
import { clamp, overlap } from '../utils.js';
import { moveBody, onewayAt, solidAt } from '../world/physics.js';

export function spawnEnt(e){const o=Object.assign({},e,{alive:true,t0:Math.random()*200|0});
  if(e.t==='en'){const K=KINDS[e.kind];o.w=K.w;o.h=K.h;o.vx=0;o.vy=0;o.dir=-1;o.hp=K.hp;o.hurtT=0;o.ox=e.x;o.oy=e.y;o.st='idle';o.k=0;o.cd=0;}
  if(e.t==='mp'){o.x=e.x0;o.w=32;o.h=6;}
  if(e.t==='coin'){o.w=8;o.h=8;}
  if(e.t==='heart'){o.w=7;o.h=7;}
  if(e.t==='flag'){o.w=12;o.h=32;o.on=false;}
  return o;}
function killEnt(e,src){markSeen(e.kind);checkGallery();e.alive=false;stat('kills');if(src==='air')stat('air');if(src==='stomp')stat('stomp');if(!e.summoned)G.levelRun.kills++;sfx('kill');puff(e.x+e.w/2,e.y+e.h/2,KINDS[e.kind].col,10,2);puff(e.x+e.w/2,e.y+e.h/2,'#ffffff',4,1);}
function hitEnemy(e,fromX,src){e.hp=CHEATS.kill?0:e.hp-1;e.hurtT=20;if(e.hp<=0)killEnt(e,src);else{sfx('bossHit');puff(e.x+e.w/2,e.y+e.h/2,'#ffffff',5,1.4);if(!KINDS[e.kind].fly){e.vx=(e.x+e.w/2<fromX?-1:1)*2;e.vy=-2;}}}
function addCoin(){G.coins++;stat('coins');G.levelRun.coins++;sfx('coin');if(G.coins%100===0){G.lives++;sfx('life');}}
function edgeAhead(e){const fx=e.dir>0?e.x+e.w+1:e.x-1;return !solidAt(fx,e.y+e.h+2)&&!onewayAt(fx,e.y+e.h+2);}
export function updateMP(e){e.t0++;const ox=e.x;e.x=e.x0+(Math.sin(e.t0*e.sp)*.5+.5)*(e.x1-e.x0);if(G.P.ride===e)G.P.x+=e.x-ox;}
function updateEnemy(e){
  const K=KINDS[e.kind],px=G.P.x+G.P.w/2,ex=e.x+e.w/2,dx=px-ex,dy=(G.P.y+G.P.h)-(e.y+e.h);
  if(e.hurtT>0)e.hurtT--;
  const grav=()=>{e.vy=Math.min(e.vy+.35,6);};
  switch(K.ai){
  case 'walk':
    if(e.hurtT<=10)e.vx=e.dir*K.spd*(e.summoned?1.4:1);grav();moveBody(e);
    if(e.hitWall)e.dir*=-1;else if(e.onGround&&edgeAhead(e))e.dir*=-1;
    break;
  case 'throw':
    e.vx*=.8;grav();moveBody(e);e.dir=dx<0?-1:1;
    if(Math.abs(dx)<170&&Math.abs(dy)<90&&e.t0%130===0){G.projs.push({type:'barrel',coin:true,x:ex-5,y:e.y-6,w:10,h:10,vx:clamp(dx/55,-2.2,2.2),vy:-4.2,life:220,rot:0});sfx('throw');}
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
    if(K.ai==='caster'&&Math.abs(dx)<170&&Math.abs(dy)<120&&e.t0%140===0){const a=Math.atan2(G.P.y+10-(e.y+5),px-ex);G.projs.push({type:'orb',x:ex-4,y:e.y+2,w:8,h:8,vx:Math.cos(a)*1.3,vy:Math.sin(a)*1.3,life:240});sfx('cast');}
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
  if(G.atkBox&&overlap(G.atkBox,e)){if(e.hurtT<=0)hitEnemy(e,G.P.x+G.P.w/2,G.P.air?'air':'cane');return;}
  if(overlap(G.P,e)){
    const stomp=G.P.vy>.5&&G.P.y+G.P.h-e.y<9;
    if(stomp&&!K.spiky){G.levelRun.stomped=true;if(e.hurtT<=0)hitEnemy(e,px,'stomp');G.P.vy=keys.jump?-6:-4.2;}
    else if(stomp){hurt(ex);if(G.state==='play')G.P.vy=-4.5;}
    else if(e.hurtT<=0)hurt(ex);
  }
}
export function updateEnts(){
  for(const e of G.ents){
    if(!e.alive||e.t==='mp')continue;
    e.t0++;
    if(e.t==='en')updateEnemy(e);
    else if(e.t==='coin'){if(overlap(G.P,e)){e.alive=false;addCoin();puff(e.x+4,e.y+4,'#fff2b0',5,1);}}
    else if(e.t==='heart'){if(overlap(G.P,e)){e.alive=false;G.P.hp=Math.min(5,G.P.hp+1);if(G.P.hp>=5)unlock('cuor');sfx('heart');puff(e.x+3,e.y+3,'#ff9aa8',8,1.2);}}
    else if(e.t==='flag'){if(!e.on&&overlap(G.P,e)){e.on=true;if(e.x>G.checkpoint.x)G.checkpoint={x:e.x,y:e.y+12};sfx('flag');puff(e.x+6,e.y,'#e8b84a',12,1.5);}}
  }
  G.ents=G.ents.filter(e=>e.alive||e.t==='flag');
}
