// Particelle (polvere, scintille, esplosioni).
import { G } from '../state.js';

export function puff(x,y,col,n=8,sp=1.6,g=.05){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=Math.random()*sp;G.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-.5,life:20+Math.random()*20|0,col,g});}}
export function updateParts(){for(const p of G.parts){p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.life--;}G.parts=G.parts.filter(p=>p.life>0);}
