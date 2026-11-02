// Tastiera, touch e controller.
import { muted, setMute, unlockAudio } from './audio/audio.js';
import { scr } from './canvas.js';
import { H, S, W } from './config.js';
import { G } from './state.js';
import { inScrollBox, scrollBy } from './ui/scroll.js';

export const keys={},hit={};
const MAP={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'jump',KeyW:'jump',Space:'jump',KeyZ:'jump',KeyX:'attack',KeyJ:'attack',KeyK:'attack',Enter:'start',KeyP:'pause',Escape:'pause',KeyM:'mute',KeyC:'cont',Backspace:'pause',ArrowDown:'down',KeyS:'down'};
addEventListener('keydown',e=>{const a=MAP[e.code];unlockAudio();if(!a)return;e.preventDefault();if(!e.repeat){hit[a]=true;if(e.code==='ArrowUp'||e.code==='KeyW')hit.up=true;}keys[a]=true;if(a==='mute'&&!e.repeat)setMute(!muted);});
addEventListener('keyup',e=>{const a=MAP[e.code];if(a)keys[a]=false;});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;});
export let tapPos=null;
// Rotellina e trascinamento col dito per far scorrere le descrizioni lunghe.
const toOut=e=>{const r=scr.getBoundingClientRect();return {x:(e.clientX-r.left)/r.width*W*S,y:(e.clientY-r.top)/r.height*H*S};};
scr.addEventListener('wheel',e=>{const p=toOut(e);if(inScrollBox(p.x,p.y)&&scrollBy(e.deltaY*.6))e.preventDefault();},{passive:false});
let dragY=null;
scr.addEventListener('pointerdown',e=>{const p=toOut(e);dragY=inScrollBox(p.x,p.y)?p.y:null;});
scr.addEventListener('pointermove',e=>{if(dragY==null)return;const p=toOut(e);scrollBy(dragY-p.y);dragY=p.y;});
addEventListener('pointerup',()=>{dragY=null;});
scr.addEventListener('pointerdown',e=>{unlockAudio();const r=scr.getBoundingClientRect();tapPos={x:(e.clientX-r.left)/r.width*W*S,y:(e.clientY-r.top)/r.height*H*S};hit.tap=true;});
document.querySelectorAll('#touch button').forEach(b=>{
  const k=b.dataset.k;
  const on=e=>{e.preventDefault();unlockAudio();keys[k]=true;hit[k]=true;b.classList.add('on');try{b.setPointerCapture(e.pointerId);}catch(_){}};
  const off=e=>{keys[k]=false;b.classList.remove('on');};
  b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointercancel',off);b.addEventListener('lostpointercapture',off);
});
if(matchMedia('(pointer:coarse)').matches)document.body.classList.add('is-touch');
addEventListener('touchstart',()=>document.body.classList.add('is-touch'),{once:true,passive:true});
// ---------- controller ----------
export const padPrev={};
export let padIdx=-1,padMsgT=0,padMsg='';
addEventListener('gamepadconnected',e=>{padIdx=e.gamepad.index;padMsg='Controller collegato';padMsgT=180;});
addEventListener('gamepaddisconnected',e=>{if(e.gamepad.index===padIdx){padIdx=-1;for(const a in padPrev)if(padPrev[a]){keys[a]=false;padPrev[a]=false;}padMsg='Controller scollegato';padMsgT=150;}});
export function getPad(){if(!navigator.getGamepads)return null;const list=navigator.getGamepads();if(padIdx>=0&&list[padIdx])return list[padIdx];for(const g of list)if(g&&g.connected){padIdx=g.index;return g;}return null;}
export function pollPad(){
  const g=getPad();if(!g)return;
  const b=i=>!!(g.buttons[i]&&(g.buttons[i].pressed||g.buttons[i].value>.5));
  const ax=g.axes[0]||0,ay=g.axes[1]||0,inPlay=G.state==='play';
  const now={
    left:b(14)||ax<-.5, right:b(15)||ax>.5,
    up:b(12)||ay<-.6, down:b(13)||ay>.6,
    jump:b(0),
    attack:b(2)||b(3)||(inPlay&&b(1)),
    pause:(inPlay&&b(9))||(!inPlay&&b(1)),
    start:!inPlay&&b(9)};
  for(const a in now){
    if(now[a]&&!padPrev[a]){hit[a]=true;unlockAudio();}
    if(now[a]!==!!padPrev[a]&&a!=='up'&&a!=='start')keys[a]=now[a];
    padPrev[a]=now[a];
  }
}
export function rumble(ms,str){try{const g=getPad();g&&g.vibrationActuator&&g.vibrationActuator.playEffect('dual-rumble',{duration:ms,strongMagnitude:str,weakMagnitude:str*.6});}catch(e){}}
export function tickPad(){if(padMsgT>0)padMsgT--;}
export const confirmHit=()=>hit.start||hit.jump||hit.attack||hit.tap;
export const menuOK=()=>hit.start||hit.attack||(hit.jump&&!hit.up);
document.getElementById('pausebtn').addEventListener('pointerdown',e=>{e.preventDefault();unlockAudio();hit.pause=true;});

// Tipo di controller collegato, per mostrare i nomi giusti dei pulsanti.
// Nota: i browser rendono visibile il controller solo dopo che si è premuto un suo tasto.
export function padType(){
  const g=getPad();if(!g)return null;
  const id=(g.id||'').toLowerCase();
  // Xbox per primo: anche il suo nome contiene "Wireless Controller", come quello dei pad PlayStation.
  if(/xbox|xinput|045e/.test(id))return 'xbox';
  if(/054c|dualshock|dualsense|playstation|wireless controller/.test(id))return 'ps';
  if(/057e|pro controller|nintendo|joy-con/.test(id))return 'switch';
  return 'generic';
}
