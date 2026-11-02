// Telefono e tablet: obbliga l'orientamento orizzontale e prova a mettere il gioco a schermo intero.
import { G } from './state.js';

export const isTouch=()=>document.body.classList.contains('is-touch');
const portrait=matchMedia('(orientation: portrait)');
// true quando si gioca da touch con il dispositivo in verticale: il gioco va in pausa e compare l'avviso "ruota".
export const needsRotate=()=>isTouch()&&portrait.matches;

// Schermo intero + blocco in orizzontale. Funziona su Android (Chrome, Edge, Samsung Internet);
// su iPhone il browser non lo permette, quindi resta l'avviso a tutto schermo finché non si ruota il telefono.
async function goLandscape(){
  const el=document.documentElement;
  try{if(!document.fullscreenElement&&el.requestFullscreen)await el.requestFullscreen({navigationUI:'hide'});}catch(e){}
  try{if(screen.orientation&&screen.orientation.lock)await screen.orientation.lock('landscape');}catch(e){}
}
let tried=false;
addEventListener('touchend',()=>{if(!isTouch())return;if(!tried||needsRotate()){tried=true;goLandscape();}},{passive:true});

// Mentre si gioca, ruotare in verticale mette subito in pausa.
export function checkOrientation(){if(needsRotate()&&G.state==='play'){G.state='pause';G.pauseSel=0;}}

// I comandi touch e il pulsante di pausa servono solo mentre si gioca:
// nelle altre schermate (menu, comandi, pausa…) si nascondono per non coprire il testo.
let wasPlaying=null;
export function syncTouchUI(){const p=G.state==='play';if(p!==wasPlaying){wasPlaying=p;document.body.classList.toggle('playing',p);}}
