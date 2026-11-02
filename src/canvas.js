// Canvas di gioco (320x180) e canvas di uscita ingrandito.
import { H, S, W } from './config.js';

export const scr=document.getElementById('screen'); scr.width=W*S; scr.height=H*S;
export const out=scr.getContext('2d'); out.imageSmoothingEnabled=false;
export const buf=document.createElement('canvas'); buf.width=W; buf.height=H;
export const ctx=buf.getContext('2d'); ctx.imageSmoothingEnabled=false;
export function px(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
