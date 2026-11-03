// Piccolo "pennello" per disegnare sprite pixel per pixel da codice,
// con forme ombreggiate (luce dall'alto a sinistra) e contorno automatico.
import { mk } from '../utils.js';

const hex=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
const toHex=a=>'#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
// toni più chiari virano verso il giallo caldo, quelli più scuri verso il viola freddo
export const lighten=(c,t=.3)=>{const [r,g,b]=hex(c);return toHex([r+(255-r)*t,g+(244-g)*t,b+(210-b)*t*.8]);};
export const darken=(c,t=.3)=>{const [r,g,b]=hex(c);return toHex([r*(1-t)+24*t,g*(1-t)+8*t,b*(1-t)+40*t]);};

export function pix(w,h){
  const g=[];for(let y=0;y<h;y++)g.push(new Array(w).fill(null));
  const o={w,h,g,
    S(x,y,c){x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<w&&y<h)g[y][x]=c;},
    G(x,y){return (x>=0&&y>=0&&x<w&&y<h)?g[y][x]:null;},
    R(x,y,ww,hh,c){for(let j=0;j<hh;j++)for(let i=0;i<ww;i++)o.S(x+i,y+j,c);},
    // ellisse piena con tre toni: chiaro in alto a sinistra, scuro in basso a destra
    E(cx,cy,rx,ry,base,opt={}){const L=opt.light||lighten(base,.32),D=opt.dark||darken(base,.32),hl=opt.hl;
      for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){
        const nx=(x-cx)/rx,ny=(y-cy)/ry,d=nx*nx+ny*ny;if(d>1.02)continue;
        const s=nx*.55+ny*.85;let c=base;
        if(s>.35&&d>.45)c=D;else if(s<-.45&&d>.25)c=L;
        if(hl&&Math.abs(nx+.45)<.18&&Math.abs(ny+.5)<.18)c=hl;
        o.S(x,y,c);}},
    // poligono pieno (lista di punti [x,y]); col può essere una funzione (x,y)=>colore
    P(pts,col){const ys=pts.map(q=>q[1]),y0=Math.floor(Math.min(...ys)),y1=Math.ceil(Math.max(...ys));
      for(let y=y0;y<=y1;y++){const xs=[];for(let i=0;i<pts.length;i++){const [ax,ay]=pts[i],[bx,by]=pts[(i+1)%pts.length];
          if((ay<=y+.5&&by>y+.5)||(by<=y+.5&&ay>y+.5))xs.push(ax+(y+.5-ay)/(by-ay)*(bx-ax));}
        xs.sort((a,b)=>a-b);for(let k=0;k+1<xs.length;k+=2)for(let x=Math.round(xs[k]);x<Math.round(xs[k+1]);x++)o.S(x,y,typeof col==='function'?col(x,y):col);}},
    // linea di un pixel
    L(x0,y0,x1,y1,c){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1;for(let i=0;i<=n;i++)o.S(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,c);},
    // contorno esterno; con inner=true le linee tra due colori diventano scure invece che nere
    outline(c){const add=[];for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(g[y][x])continue;
        if([[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>o.G(x+a,y+b)&&o.G(x+a,y+b)!==c))add.push([x,y]);}
      add.forEach(([x,y])=>{g[y][x]=c;});return o;},
    canvas(){return mk(w,h,x=>{g.forEach((r,j)=>r.forEach((c,i)=>{if(c){x.fillStyle=c;x.fillRect(i,j,1,1);}}));});}
  };
  return o;
}
