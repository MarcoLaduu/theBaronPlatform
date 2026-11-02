// Posizioni degli elementi nei menu (condivise tra disegno e input).
import { tapPos } from '../input.js';

export function aRect(i){return {x:50+(i%7)*88,y:150+(i/7|0)*88,w:82,h:82};}
export function cheatRect(i){return i<3?{x:240,y:160+i*112,w:800,h:96}:{x:490,y:500,w:300,h:64};}
export const TITLE_Y=378,PAUSE_Y=300,G_COLS=5;
export const inRect=(p,r)=>p.x>=r.x&&p.x<=r.x+r.w&&p.y>=r.y&&p.y<=r.y+r.h;
export const backHit=()=>tapPos&&inRect(tapPos,{x:30,y:30,w:230,h:60});
export function levelRect(i){return {x:70+(i%3)*390,y:150+(i/3|0)*250,w:360,h:220};}
export function galRect(i){return {x:50+(i%G_COLS)*102,y:140+(i/G_COLS|0)*102,w:92,h:92};}
