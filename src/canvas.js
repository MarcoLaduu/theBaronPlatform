// Canvas di gioco (320x180) e canvas di uscita ingrandito.
import { H, S, W } from './config.js';

export const scr=document.getElementById('screen'); scr.width=W*S; scr.height=H*S;
export const out=scr.getContext('2d'); out.imageSmoothingEnabled=false;

// Il gioco disegna sempre in un'area logica di 1280x720 (W*S x H*S).
// Quando lo schermo è più grande, il canvas reale usa più pixel e scala il disegno,
// così testi e grafica restano nitidi a qualsiasi dimensione della finestra.
function fitResolution(){
  const r=scr.getBoundingClientRect(),dpr=window.devicePixelRatio||1;
  const k=Math.max(1,Math.min(3,Math.ceil(r.width*dpr/(W*S)*2)/2));
  if(scr.width!==Math.round(W*S*k)){scr.width=Math.round(W*S*k);scr.height=Math.round(H*S*k);}
  out.setTransform(k,0,0,k,0,0);out.imageSmoothingEnabled=false;
}
fitResolution();
addEventListener('resize',fitResolution);
if(window.ResizeObserver)new ResizeObserver(fitResolution).observe(scr);
export const buf=document.createElement('canvas'); buf.width=W; buf.height=H;
export const ctx=buf.getContext('2d'); ctx.imageSmoothingEnabled=false;
export function px(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
