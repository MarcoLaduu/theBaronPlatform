// Il giocatore: movimento, attacchi, danni, morte.
import { music, sfx } from '../audio/audio.js';
import { ROWS } from '../config.js';
import { puff } from '../core/particles.js';
import { stat } from '../data/achievements.js';
import { spawnEnt } from './entities.js';
import { hit, keys, rumble } from '../input.js';
import { CHEATS } from '../save.js';
import { G } from '../state.js';
import { clamp } from '../utils.js';
import { moveBody, solidAt } from '../world/physics.js';
import { THEMES } from '../world/themes.js';

export function newPlayer(x,y){return {x,y,w:10,h:20,vx:0,vy:0,dir:1,onGround:false,coyote:0,jbuf:0,atk:0,atkCd:0,inv:0,knock:0,hp:3,safe:{x,y}};}
export function hurt(srcX){
  if(CHEATS.god||G.P.inv>0||G.state!=='play')return;
  G.P.hp--;rumble(180,.6);stat('damage');G.levelRun.damaged=true;G.gameRun.damaged=true;if(G.fight)G.levelRun.bossHit=true;G.P.inv=80;G.P.vy=-3.5;G.P.vx=(G.P.x+G.P.w/2<srcX)?-2.2:2.2;G.P.knock=14;G.shake=7;sfx('hurt');
  puff(G.P.x+5,G.P.y+10,'#ffffff',6);
  if(G.P.hp<=0)die();
}
export function die(){
  if(G.state!=='play')return;
  G.state='dead';G.stT=0;G.lives--;G.gameRun.deaths++;G.P.vy=-5;G.P.vx=0;sfx('die');music(-1);
}
export function respawn(){
  if(G.lives<0){G.state='gameover';G.stT=0;stat('gameovers');return;}
  if(G.fight){for(let r=0;r<ROWS;r++)G.lvl.g[r][G.lvl.A]=r>=ROWS-3?'#':' ';G.fight=false;G.boss=null;}
  G.ents=G.ents.filter(e=>e.t!=='en').concat(G.lvl.ents.filter(e=>e.t==='en').map(spawnEnt));G.projs=[];
  G.P=newPlayer(G.checkpoint.x,G.checkpoint.y);G.P.inv=60;
  G.state='play';music(THEMES[G.lvlIndex].song);
}
export function updatePlayer(){
  const p=G.P;
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
  if(!p.onGround&&p.vy>=0)for(const m of G.ents){if(m.t!=='mp')continue;
    if(p.x+p.w>m.x+1&&p.x<m.x+m.w-1&&prevBot<=m.y+2.5&&p.y+p.h>=m.y){p.y=m.y-p.h;p.vy=0;p.onGround=true;p.ride=m;break;}}
  if(p.onGround&&!p.ride&&solidAt(p.x+1,p.y+p.h+1)&&solidAt(p.x+p.w-1,p.y+p.h+1))p.safe={x:p.x,y:p.y};
  if(p.onGround&&Math.abs(p.vx)>.3)p.anim++;else p.anim=0;
}
