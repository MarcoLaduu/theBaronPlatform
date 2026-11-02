// Proiettili nemici.
import { sfx } from '../audio/audio.js';
import { ROWS, T, floorY } from '../config.js';
import { puff } from '../core/particles.js';
import { stat } from '../data/achievements.js';
import { hurt } from './player.js';
import { G } from '../state.js';
import { overlap } from '../utils.js';
import { moveBody, solidAt } from '../world/physics.js';

export function updateProjs(){
  for(const q of G.projs){
    q.life--;
    if(q.type==='barrel'){q.vy=Math.min(q.vy+.25,6);moveBody(q);q.rot+=q.vx*.3;if(q.hitWall||q.y>ROWS*T){q.life=0;puff(q.x+5,q.y+5,q.coin?'#f0c040':'#8a5428',8,1.5);}}
    else if(q.type==='wave'){q.x+=q.vx;if(solidAt(q.vx>0?q.x+q.w:q.x,q.y+4))q.life=0;}
    else if(q.type==='thorn'){q.ph++;if(q.ph===q.warn){sfx('kill');}if(q.ph>q.warn+42)q.life=0;}
    else{q.x+=q.vx;q.y+=q.vy;if(solidAt(q.x+q.w/2,q.y+q.h/2)){q.life=0;puff(q.x+4,q.y+4,q.type==='fire'?'#ff6020':'#9ae02a',5,1);}
      if(q.type==='fire'&&G.frame%3===0)G.parts.push({x:q.x+4,y:q.y+4,vx:0,vy:0,life:10,col:'#ff9030',g:0});}
    if(q.life<=0)continue;
    if(q.type==='thorn'){if(q.ph>q.warn){const hg=Math.min(28,(q.ph-q.warn)*4);if(overlap(G.P,{x:q.x+1,y:floorY-hg,w:10,h:hg}))hurt(q.x+6);}}
    else{
      if(G.atkBox&&q.type!=='wave'&&overlap(G.atkBox,q)){q.life=0;stat('proj');puff(q.x+4,q.y+4,'#ffffff',6,1.4);sfx('kill');continue;}
      if(overlap(G.P,q)){hurt(q.x+q.w/2);if(q.type!=='wave'&&q.type!=='barrel')q.life=0;}
    }
  }
  G.projs=G.projs.filter(q=>q.life>0);
}
