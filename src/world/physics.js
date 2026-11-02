// Collisioni con il terreno.
import { ROWS, T } from '../config.js';
import { G } from '../state.js';

export function tileAt(c,r){if(c<0||c>=G.lvl.cols)return '#';if(r<0||r>=ROWS)return ' ';return G.lvl.g[r][c];}
export function solidAt(x,y){return tileAt(Math.floor(x/T),Math.floor(y/T))==='#';}
export function onewayAt(x,y){return tileAt(Math.floor(x/T),Math.floor(y/T))==='-';}
export function moveBody(b){
  b.hitWall=0;
  b.x+=b.vx;
  const ys=[];for(let y=b.y+1;y<b.y+b.h-1;y+=8)ys.push(y);ys.push(b.y+b.h-1);
  if(b.vx>0){if(ys.some(y=>solidAt(b.x+b.w,y))){b.x=Math.floor((b.x+b.w)/T)*T-b.w-.01;b.vx=0;b.hitWall=1;}}
  else if(b.vx<0){if(ys.some(y=>solidAt(b.x,y))){b.x=(Math.floor(b.x/T)+1)*T;b.vx=0;b.hitWall=-1;}}
  const prevBot=b.y+b.h;
  b.y+=b.vy;b.onGround=false;
  const xs=[];for(let x=b.x+1;x<b.x+b.w-1;x+=8)xs.push(x);xs.push(b.x+b.w-1);
  if(b.vy>=0){const bot=b.y+b.h,r=Math.floor(bot/T);
    if(xs.some(x=>solidAt(x,bot)||(onewayAt(x,bot)&&prevBot<=r*T+.5))){b.y=r*T-b.h;b.vy=0;b.onGround=true;}}
  else if(xs.some(x=>solidAt(x,b.y))){b.y=(Math.floor(b.y/T)+1)*T;b.vy=0;}
}
