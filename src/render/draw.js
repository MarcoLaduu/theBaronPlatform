// Strumenti di disegno: testo, pannelli, pulsanti.
import { buf, ctx, out } from '../canvas.js';
import { H, S, W } from '../config.js';
import { drawBG } from './world.js';
import { G } from '../state.js';
import { mk } from '../utils.js';
import { getTheme } from '../world/themes.js';

export function triFill(cx,by,hw,h,col){ctx.fillStyle=col;for(let j=0;j<h;j++){const w=Math.round(hw*(j+1)/h);ctx.fillRect(cx-w,by-h+j,w*2+1,1);}}
// Il font unisce 'f' + 'i' (e simili) in una legatura che sembra una A: un separatore invisibile la impedisce.
const noLig=s=>String(s).replace(/([fF])(?=[ilfjtIL])/g,'$1\u200C');
export function text(s,x,y,size,col='#f3e3c3',align='center',weight=600){
  s=noLig(s);
  out.font=`${weight} ${size}px 'Pixelify Sans','Courier New',monospace`;out.textAlign=align;out.textBaseline='middle';
  const o=Math.max(3,size/12|0);out.fillStyle='#0a0408';out.fillText(s,x+o,y+o);out.fillStyle=col;out.fillText(s,x,y);
}
export function band(y,h,a=.78){out.fillStyle=`rgba(12,4,10,${a})`;out.fillRect(0,y,W*S,h);out.fillStyle='#e8b84a';out.fillRect(0,y,W*S,4);out.fillRect(0,y+h-4,W*S,4);}
const SIL=new Map();
function silhouette(c){if(!SIL.has(c))SIL.set(c,mk(c.width,c.height,x=>{x.drawImage(c,0,0);x.globalCompositeOperation='source-in';x.fillStyle='#3a2434';x.fillRect(0,0,c.width,c.height);}));return SIL.get(c);}
export function drawFit(img,x,y,w,h,locked){const sc=Math.max(1,Math.floor(Math.min(w/img.width,h/img.height))),dw=img.width*sc,dh=img.height*sc;
  out.drawImage(locked?silhouette(img):img,Math.round(x+(w-dw)/2),Math.round(y+(h-dh)/2),dw,dh);}
export function wrap(str,x,y,maxW,lh,size,col){out.font=`400 ${size}px 'Pixelify Sans','Courier New',monospace`;const words=str.split(' ');let line='',yy=y;
  for(const w of words){const t=line?line+' '+w:w;if(out.measureText(t).width>maxW&&line){text(line,x,yy,size,col,'left',400);line=w;yy+=lh;}else line=t;}
  if(line)text(line,x,yy,size,col,'left',400);}
export function menuItem(label,x,y,sel){
  if(sel){out.fillStyle='rgba(92,22,38,.92)';out.fillRect(x-230,y-28,460,56);out.fillStyle='#e8b84a';out.fillRect(x-230,y-28,6,56);}
  text((sel?'▸ ':'')+label,x,y,32,sel?'#f3e3c3':'#9a8476');}
export function panel(x,y,w,h){out.fillStyle='rgba(18,8,16,.92)';out.fillRect(x,y,w,h);out.strokeStyle='#5c1626';out.lineWidth=4;out.strokeRect(x+2,y+2,w-4,h-4);}
export function menuBG(dark){
  [G.tiles,G.bg]=getTheme(0);
  drawBG(G.titleX,0);
  for(let x=-(G.titleX%16|0);x<W;x+=16)ctx.drawImage(G.tiles.top,x,H-16);
  out.drawImage(buf,0,0,W*S,H*S);
  out.fillStyle=`rgba(12,4,10,${dark})`;out.fillRect(0,0,W*S,H*S);
}
export function backBtn(){out.fillStyle='rgba(92,22,38,.9)';out.fillRect(30,30,230,60);out.fillStyle='#e8b84a';out.fillRect(30,30,6,60);text('◂ Indietro',145,60,28,'#f3e3c3');}

// Icona di un controller in pixel art (le emoji nel canvas venivano disegnate due volte, ombra compresa).
const PAD_ICON=[".kkkkkkkkkk.","kbbbbbbbbbbk","kbwbbbbbbrbk","kwwwbbbbrbrk","kbwbbbbbbrbk","kbbbkkkkbbbk",".kkk....kkk."];
export function padIcon(x,y,u,col){
  const c={k:'#0a0408',b:col,w:'#f3e3c3',r:'#f3e3c3'};
  PAD_ICON.forEach((row,j)=>{for(let i=0;i<row.length;i++){const ch=row[i];if(ch==='.')continue;out.fillStyle=c[ch];out.fillRect(x+i*u,y+j*u,u,u);}});
}
// Larghezza di un testo con il font del gioco (serve per affiancare un'icona).
export function textWidth(s,size,weight=600){out.font=`${weight} ${size}px 'Pixelify Sans','Courier New',monospace`;return out.measureText(s).width;}
