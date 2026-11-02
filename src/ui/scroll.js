// Stato dei riquadri di testo scorrevoli (descrizioni lunghe in galleria e obiettivi).
// Il disegno è in render/draw.js (scrollText); qui stanno i dati condivisi con l'input.
export const SCROLL={key:null,off:0,manual:0,t:0,box:null};

// Va chiamata all'inizio di ogni fotogramma: il riquadro esiste solo se la schermata lo ridisegna.
export function resetScrollBox(){SCROLL.box=null;}
// Scorre il testo di dy pixel (rotellina o trascinamento); ferma per qualche secondo lo scorrimento automatico.
export function scrollBy(dy){const b=SCROLL.box;if(!b||b.max<=0)return false;SCROLL.off=Math.min(b.max,Math.max(0,SCROLL.off+dy));SCROLL.manual=300;return true;}
export function inScrollBox(x,y){const b=SCROLL.box;return !!b&&x>=b.x-10&&x<=b.x+b.w+24&&y>=b.y-10&&y<=b.y+b.h+10;}
