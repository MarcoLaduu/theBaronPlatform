// Posizioni degli elementi nei menu (condivise tra disegno e input).
import { tapPos } from '../input.js';

export function aRect(i){return {x:50+(i%7)*88,y:150+(i/7|0)*88,w:82,h:82};}
import { CHEAT_LIST } from '../save.js';
// Le righe dei trucchi sono CHEAT_LIST.length; l'ultima voce è il pulsante "Fatto".
export function cheatRect(i){const n=CHEAT_LIST.length;return i<n?{x:240,y:140+i*104,w:800,h:92}:{x:490,y:150+n*104,w:300,h:60};}
export const TITLE_Y=378,TITLE_STEP=50,PAUSE_Y=300,PAUSE_STEP=56,G_COLS=5;
// Icona dell'audio nell'angolo in basso a destra (menu principale e pausa).
export const AUDIO_BTN={x:1188,y:640,w:64,h:56};
export const inRect=(p,r)=>p.x>=r.x&&p.x<=r.x+r.w&&p.y>=r.y&&p.y<=r.y+r.h;
export const backHit=()=>tapPos&&inRect(tapPos,{x:30,y:30,w:230,h:60});
export function levelRect(i){return {x:70+(i%3)*390,y:150+(i/3|0)*250,w:360,h:220};}
export function galRect(i){return {x:50+(i%G_COLS)*102,y:140+(i/G_COLS|0)*102,w:92,h:92};}
// Solo in locale: finestra di scelta "livello completo / vai al boss" nella selezione livelli.
export function choiceRect(i){return {x:410,y:300+i*80,w:460,h:60};}
