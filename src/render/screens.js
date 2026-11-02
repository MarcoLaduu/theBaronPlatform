// Schermate: titolo, livelli, galleria, obiettivi, trucchi, pausa.
import { isMuted } from '../audio/audio.js';
import { buf, out } from '../canvas.js';
import { H, S, W } from '../config.js';
import { titleItems } from '../core/game.js';
import { ACH, AST, cheatsOn, toasts } from '../data/achievements.js';
import { ROSTER } from '../data/roster.js';
import { BAR } from '../graphics/barux.js';
import { BOSS_DEF } from '../graphics/bosses.js';
import { padMsg, padMsgT, padType } from '../input.js';
import { backBtn, band, drawFit, menuBG, menuItem, padIcon, panel, text, textWidth, wrap } from './draw.js';
import { drawHUD, drawWorld, hudText } from './world.js';
import { CHEATS, CHEAT_LIST, devUnlock, isSeen, loadSave } from '../save.js';
import { G } from '../state.js';
import { AUDIO_BTN, G_COLS, PAUSE_STEP, PAUSE_Y, TITLE_STEP, TITLE_Y, aRect, cheatRect, galRect, levelRect } from '../ui/layout.js';
import { clamp } from '../utils.js';
import { BGS, THEMES, TILES, getTheme } from '../world/themes.js';

export const INTRO=[
 'Nel borgo di Castelbarux viveva il Barone Barux,',
 'nobile elegantissimo dal cilindro più alto del reame.',
 'Ma un brutto giorno il Barone fu anlaciato troppo...',
 '...e tutto quell\'anlaciamento risvegliò il demone ANLAUCER!',
 'Con lui arrivarono cinque scagnozzi a seminare il caos.',
 'Riprenditi il regno, Barone. A colpi di bastone.'
];
export function render(){renderMain();drawToast();}
// ---------- finestra dei comandi ----------
const HELP_ACTIONS=['Muoversi','Saltare','Bastonata','Pausa','Indietro nei menu'];
const HELP_KEYS=['← →  oppure  A D','Spazio, ↑, W o Z','X, J o K','P o Esc','Esc'];
const HELP_TOUCH=['◀ ▶','A','B','II','Indietro'];
const HELP_PADS={
  xbox:   {name:'Xbox',        keys:['Croce o levetta sinistra','A','X, B o Y','Start','B'],              ok:'A'},
  ps:     {name:'PlayStation', keys:['Croce o levetta sinistra','✕','□, ○ o △','Options','○'],            ok:'✕'},
  switch: {name:'Switch',      keys:['Croce o levetta sinistra','B','Y, A o X','+','A'],                  ok:'B'},
  generic:{name:'',            keys:['Croce o levetta sinistra','Pulsante in basso','Altri pulsanti frontali','Start','Pulsante a destra'],ok:'il pulsante in basso'}};
const HELP_TIPS=[
 'Tieni premuto il salto per saltare più in alto.',
 'Bastonata a terra: colpisce davanti al Barone.',
 'Bastonata in volo: una mezzaluna che colpisce sopra, davanti e sotto.',
 'Salta in testa ai nemici per schiacciarli, ma non sui rovi con le spine!',
 'Il bastone distrugge anche monete, sfere e palle di fuoco nemiche.',
 'Bandiere = checkpoint · Cuori = salute · Ogni 100 monete, una vita extra.'];
function renderHelp(){
  out.fillStyle='rgba(10,4,8,.82)';out.fillRect(0,0,W*S,H*S);
  panel(70,30,1140,660);
  text('COME SI GIOCA',640,82,44,'#e8b84a','center',700);
  // lo schema cambia in base a cosa si sta usando: controller, touch o tastiera
  const pt=padType(),pad=pt&&HELP_PADS[pt],touch=!pad&&document.body.classList.contains('is-touch');
  let heads,cols,colsData;
  if(pad){heads=['Azione','Controller'+(pad.name?' '+pad.name:'')];cols=[140,520];colsData=[pad.keys];}
  else if(touch){heads=['Azione','Touch','Tastiera'];cols=[140,520,820];colsData=[HELP_TOUCH,HELP_KEYS];}
  else{heads=['Azione','Tastiera'];cols=[140,520];colsData=[HELP_KEYS];}
  heads.forEach((h,i)=>text(h.toUpperCase(),cols[i],140,18,i===1?'#e8b84a':'#9a8476','left',600));
  {const msg=pad?'Controller collegato':'Collega un controller per vedere i suoi comandi',col=pad?'#2fb06a':'#7a6a6a';
   text(msg,1170,140,16,col,'right',400);padIcon(1170-textWidth(msg,16,400)-32,133,2,col);}
  out.fillStyle='#5c1626';out.fillRect(110,160,1060,3);
  HELP_ACTIONS.forEach((act,j)=>{const y=190+j*38;
    text(act,cols[0],y,24,'#f3e3c3','left',700);
    colsData.forEach((c,i)=>text(c[j],cols[i+1],y,21,'#d8c8b8','left',400));});
  out.fillStyle='#5c1626';out.fillRect(110,375,1060,3);
  HELP_TIPS.forEach((t,j)=>{text('•',130,410+j*38,22,'#e8b84a','left',700);text(t,155,410+j*38,21,'#d8c8b8','left',400);});
  if(G.stT>20){const btn=pad?pad.ok:(touch?'tocca':'INVIO'),how=pad?'Premi '+btn:(touch?'Tocca':'Premi INVIO o tocca');
    text(how+(G.helpFrom==='pause'?' per tornare alla pausa':' per iniziare a giocare'),640,655,22,'#e8b84a','center',600);}
}
// Icona dell'altoparlante in pixel art: onde sonore se l'audio è acceso, una X rossa se è spento (tasto M o tocco).
function drawAudioBtn(){
  const b=AUDIO_BTN,u=4,ox=b.x+10,oy=b.y+8,m=isMuted();
  out.fillStyle='rgba(18,8,16,.9)';out.fillRect(b.x,b.y,b.w,b.h);
  out.strokeStyle=m?'#5c1626':'#e8b84a';out.lineWidth=3;out.strokeRect(b.x+1.5,b.y+1.5,b.w-3,b.h-3);
  const r=(x,y,w,h,c)=>{out.fillStyle=c;out.fillRect(ox+x*u,oy+y*u,w*u,h*u);};
  const ink=m?'#8a7a7a':'#f3e3c3';
  r(0,3,2,4,ink);r(2,2,1,6,ink);r(3,1,1,8,ink);r(4,0,1,10,ink);
  if(m){for(const [x,y] of [[6,2],[10,2],[7,3],[9,3],[8,4],[7,5],[9,5],[6,6],[10,6]])r(x,y+1,1,1,'#d8344a');}
  else{r(6,4,1,2,'#e8b84a');r(7,3,1,1,'#e8b84a');r(7,6,1,1,'#e8b84a');r(8,1,1,2,'#e8b84a');r(9,3,1,4,'#e8b84a');r(8,7,1,2,'#e8b84a');}
}
function renderMain(){
  if(G.state==='cheats'){
    if(G.cheatsFrom==='title')menuBG(.8);
    else{drawWorld();drawHUD();out.drawImage(buf,0,0,W*S,H*S);out.fillStyle='rgba(10,4,8,.86)';out.fillRect(0,0,W*S,H*S);}
    backBtn();renderCheats();return;}
  if(G.state==='title'||G.state==='levels'||G.state==='gallery'||G.state==='ach'){renderMenus();return;}
  drawWorld();drawHUD();
  out.drawImage(buf,0,0,W*S,H*S);
  hudText();
  const cxm=W*S/2;
  if(G.state==='intro'){
    out.fillStyle='rgba(10,4,8,.88)';out.fillRect(0,0,W*S,H*S);
    INTRO.forEach((l,i)=>{const a=clamp((G.stT-i*45)/30,0,1);if(a<=0)return;out.globalAlpha=a;text(l,cxm,150+i*72,i===3?36:32,i===3?'#e8b84a':'#f3e3c3');});
    out.globalAlpha=1;
    if(G.stT>INTRO.length*45)text('Premi INVIO o tocca per iniziare',cxm,640,26,'#9a8476');
  } else if(G.state==='card'){
    const a=Math.min(1,G.stT/15,(170-G.stT)/20);out.globalAlpha=Math.max(0,a);
    band(200,320);text('LIVELLO '+(G.lvlIndex+1),cxm,260,30,'#e8b84a');text(THEMES[G.lvlIndex].name,cxm,340,72,'#f3e3c3','center',700);
    text('Sconfiggi '+BOSS_DEF[G.lvlIndex].name,cxm,430,30,'#d8b8a8');out.globalAlpha=1;
  } else if(G.state==='pause'){out.fillStyle='rgba(10,4,8,.6)';out.fillRect(0,0,W*S,H*S);band(140,470);
    text('PAUSA',cxm,208,64,'#f3e3c3','center',700);
    ['Riprendi','Ricomincia il livello','Comandi','Trucchi','Torna al menu'].forEach((l,i)=>menuItem(l,cxm,PAUSE_Y+i*PAUSE_STEP,i===G.pauseSel));
    drawAudioBtn();
    text('Ricominciando o tornando al menu, il livello riparte da capo',cxm,580,20,'#9a8476','center',400);}
  else if(G.state==='help')renderHelp();
  else if(G.state==='clear'){
    const d=BOSS_DEF[G.lvlIndex];band(170,380);
    text(d.name,cxm,250,52,'#f3e3c3','center',700);
    text(G.lvlIndex===5?'è stato rispedito negli inferi!':(d.fem?'è stata sconfitta!':'è stato sconfitto!'),cxm,320,36,'#e8b84a');
    text('Monete raccolte: '+G.coins,cxm,400,28,'#d8b8a8');
    if(G.stT>50)text('Premi INVIO o tocca per continuare',cxm,480,24,'#9a8476');
  } else if(G.state==='gameover'){out.fillStyle='rgba(10,4,8,.82)';out.fillRect(0,0,W*S,H*S);text('GAME OVER',cxm,300,96,'#d8344a','center',700);text('Il cilindro è caduto. Ma un barone si rialza sempre.',cxm,400,28,'#f3e3c3');if(G.stT>50)text('Premi INVIO o tocca per riprovare il livello',cxm,480,24,'#9a8476');}
  else if(G.state==='win'){
    out.fillStyle='rgba(10,4,8,.7)';out.fillRect(0,0,W*S,H*S);
    text('VITTORIA!',cxm,150,96,'#e8b84a','center',700);
    ['Anlaucer torna negli abissi da cui era venuto.','Il Barone Barux si sistema il cilindro e torna a casa.','Da oggi in poi si farà anlaciare con moderazione.'].forEach((l,i)=>text(l,cxm,270+i*58,32,'#f3e3c3'));
    text('Monete totali: '+G.coins,cxm,480,30,'#d8b8a8');
    if(G.stT>80)text('Premi INVIO o tocca per tornare al titolo',cxm,600,24,'#9a8476');
  }
}
function drawToast(){
  if(padMsgT>0){const a=Math.min(1,padMsgT/20);out.globalAlpha=a;out.fillStyle='rgba(18,8,16,.92)';out.fillRect(440,640,400,56);out.strokeStyle='#e8b84a';out.lineWidth=3;out.strokeRect(441,641,398,54);{const w=textWidth(padMsg,24),iw=36,x0=640-(w+iw)/2;padIcon(x0,658,3,'#e8b84a');text(padMsg,x0+iw+8,668,24,'#f3e3c3','left',600);}out.globalAlpha=1;}
  if(!toasts.length)return;const T0=toasts[0],a=ACH.find(x=>x.id===T0.id);if(!a)return;
  const slide=Math.min(1,T0.t/14,(210-T0.t)/14),y=Math.round(-110+130*slide);
  out.fillStyle='rgba(18,8,16,.95)';out.fillRect(390,y,500,96);out.strokeStyle='#e8b84a';out.lineWidth=4;out.strokeRect(392,y+2,496,92);
  drawFit(a.ic(),402,y+10,76,76,false);
  text('OBIETTIVO SBLOCCATO',492,y+30,18,'#e8b84a','left',600);
  text(a.n,492,y+64,28,'#f3e3c3','left',700);
}
function renderAch(){
  const got=ACH.filter(a=>AST.u[a.id]||devUnlock()).length;
  text('OBIETTIVI',640,60,44,'#e8b84a','center',700);
  ACH.forEach((a,i)=>{const r=aRect(i),open=!!AST.u[a.id]||devUnlock(),sel=i===G.selA;
    out.fillStyle=sel?'rgba(92,22,38,.95)':(open?'rgba(60,30,20,.9)':'rgba(18,8,16,.85)');out.fillRect(r.x,r.y,r.w,r.h);
    out.strokeStyle=sel?'#e8b84a':(open?'#a8781e':'#3a1a26');out.lineWidth=sel?5:3;out.strokeRect(r.x+2,r.y+2,r.w-4,r.h-4);
    if(!open&&a.secret)text('?',r.x+r.w/2,r.y+r.h/2,44,'#5a4050','center',700);
    else drawFit(a.ic(),r.x+14,r.y+14,r.w-28,r.h-28,!open);});
  text('Sbloccati: '+got+' / '+ACH.length,355,540,22,'#9a8476','center',400);
  if(cheatsOn())text('Trucchi attivi: gli obiettivi sono in pausa',355,578,19,'#e8b84a','center',400);
  const a=ACH[G.selA],open=!!AST.u[a.id]||devUnlock(),hidden=a.secret&&!open;
  panel(680,130,550,540);
  if(hidden)text('?',955,250,120,'#5a4050','center',700);else drawFit(a.ic(),700,150,510,200,!open);
  text(hidden?'???':a.n,705,395,32,open?'#f3e3c3':'#b8a898','left',700);
  text(a.c,705,438,21,'#e8b84a','left',600);
  wrap(hidden?'Obiettivo segreto: continua a giocare per scoprirlo.':a.d,705,484,500,30,22,'#d8c8b8');
  if(a.stat&&!hidden&&a.goal>1){const v=Math.min(a.goal,AST.s[a.stat]||0);
    out.fillStyle='#2a1420';out.fillRect(705,570,500,18);out.fillStyle=open?'#2fb06a':'#e8b84a';out.fillRect(705,570,Math.round(500*v/a.goal),18);
    text(v+' / '+a.goal,1205,605,20,'#b8a898','right',400);}
  text(open?(AST.u[a.id]?'Sbloccato il '+new Date(AST.u[a.id]).toLocaleDateString('it-IT'):'Sbloccato (modalità sviluppo)'):'Da sbloccare',705,640,20,open?'#2fb06a':'#8a7a7a','left',600);
  text('Frecce per sfogliare · ESC per tornare',640,700,18,'#9a8476','center',400);
}
function renderCheats(){
  text('TRUCCHI',640,62,44,'#e8b84a','center',700);
  CHEAT_LIST.forEach((c,i)=>{const r=cheatRect(i),sel=i===G.cheatSel,on=CHEATS[c.k];
    out.fillStyle=sel?'rgba(92,22,38,.92)':'rgba(18,8,16,.88)';out.fillRect(r.x,r.y,r.w,r.h);
    out.strokeStyle=sel?'#e8b84a':'#3a1a26';out.lineWidth=sel?5:3;out.strokeRect(r.x+2,r.y+2,r.w-4,r.h-4);
    text(c.label,r.x+30,r.y+32,30,'#f3e3c3','left',700);
    text(c.desc,r.x+30,r.y+68,19,'#b8a898','left',400);
    const tx=r.x+r.w-140,ty=r.y+26;
    out.fillStyle=on?'#2fb06a':'#3a2a30';out.fillRect(tx,ty,110,44);
    out.fillStyle=on?'#a8f0c0':'#6a5a60';out.fillRect(on?tx+70:tx+6,ty+6,34,32);
    text(on?'ON':'OFF',on?tx+36:tx+74,ty+22,20,on?'#0a2a14':'#b8a898','center',700);});
  const r=cheatRect(CHEAT_LIST.length),sel=G.cheatSel===CHEAT_LIST.length;
  out.fillStyle=sel?'rgba(92,22,38,.92)':'rgba(18,8,16,.88)';out.fillRect(r.x,r.y,r.w,r.h);
  out.strokeStyle=sel?'#e8b84a':'#3a1a26';out.lineWidth=sel?5:3;out.strokeRect(r.x+2,r.y+2,r.w-4,r.h-4);
  text('Fatto',r.x+r.w/2,r.y+r.h/2,30,'#f3e3c3','center',700);
  text('INVIO per attivare o disattivare · ESC per uscire',640,700,20,'#9a8476','center',400);
}
function renderMenus(){
  if(G.state==='title'){
    menuBG(.35);
    out.drawImage(BAR.idle[0],120,(H-16)*S-24*13,16*13,24*13);
    out.fillStyle='#4a2a14';out.fillRect(120+13*13,(H-16)*S-7*13,13,7*13);out.fillStyle='#e8b84a';out.fillRect(120+12*13,(H-16)*S-9*13,39,26);
    const tx=820;
    text('IL BARONE',tx,100,44,'#e8b84a','center',600);
    text('BARUX',tx,200,150,'#f3e3c3','center',700);
    text('e la maledizione di Anlaucer',tx,300,34,'#d8b8a8','center',400);
    const items=titleItems();
    out.fillStyle='rgba(12,4,10,.72)';out.fillRect(tx-250,TITLE_Y-38,500,items.length*TITLE_STEP+70);
    items.forEach((it,i)=>menuItem(it.label,tx,TITLE_Y+i*TITLE_STEP,i===G.menuSel));
    text('INVIO per scegliere · frecce per spostarti',tx,TITLE_Y+items.length*TITLE_STEP+6,20,'#9a8476','center',400);
    drawAudioBtn();
    return;
  }
  menuBG(.72);backBtn();
  if(G.state==='levels'){
    text('SELEZIONA LIVELLO',640,60,44,'#e8b84a','center',700);
    const max=loadSave();
    for(let i=0;i<6;i++){const r=levelRect(i),open=i<=max,sel=i===G.selL;
      getTheme(i);
      out.drawImage(BGS[i].sky,r.x,r.y,r.w,r.h);
      for(let k=0;k<r.w;k+=48)out.drawImage(TILES[i].top,r.x+k,r.y+r.h-48,Math.min(48,r.w-k),48);
      out.fillStyle=open?'rgba(10,4,8,.45)':'rgba(10,4,8,.82)';out.fillRect(r.x,r.y,r.w,r.h);
      out.strokeStyle=sel?'#e8b84a':'#3a1a26';out.lineWidth=sel?6:4;out.strokeRect(r.x+2,r.y+2,r.w-4,r.h-4);
      text('LIVELLO '+(i+1),r.x+r.w/2,r.y+38,22,open?'#e8b84a':'#6a5a5a','center',600);
      if(open){text(THEMES[i].name,r.x+r.w/2,r.y+90,25,'#f3e3c3','center',700);
        text(isSeen('boss'+i)?'Boss: '+BOSS_DEF[i].name:'Boss: ???',r.x+r.w/2,r.y+135,17,'#d8b8a8','center',400);}
      else{out.fillStyle='#6a5a5a';out.fillRect(r.x+r.w/2-18,r.y+100,36,28);out.strokeStyle='#6a5a5a';out.lineWidth=6;out.beginPath();out.arc(r.x+r.w/2,r.y+100,12,Math.PI,0);out.stroke();
        text('Bloccato',r.x+r.w/2,r.y+155,22,'#8a7a7a','center',400);}
    }
    text('Ogni livello si sblocca raggiungendolo nella storia',640,680,22,'#9a8476','center',400);
    return;
  }
  if(G.state==='ach'){renderAch();return;}
  // galleria
  text('PERSONAGGI',640,60,44,'#e8b84a','center',700);
  ROSTER.forEach((r,i)=>{const g=galRect(i),open=r.id==='barux'||isSeen(r.id),sel=i===G.selG;
    out.fillStyle=sel?'rgba(92,22,38,.95)':'rgba(18,8,16,.85)';out.fillRect(g.x,g.y,g.w,g.h);
    out.strokeStyle=sel?'#e8b84a':(r.boss!=null?'#7a3a20':'#3a1a26');out.lineWidth=sel?5:3;out.strokeRect(g.x+2,g.y+2,g.w-4,g.h-4);
    drawFit(r.img(),g.x+10,g.y+10,g.w-20,g.h-20,!open);});
  const found=ROSTER.filter(r=>r.id==='barux'||isSeen(r.id)).length;
  text('Scoperti: '+found+' / '+ROSTER.length,50+(G_COLS*102-10)/2,580,22,'#9a8476','center',400);
  const r=ROSTER[G.selG],open=r.id==='barux'||isSeen(r.id);
  panel(600,130,630,540);
  drawFit(r.img(),630,150,570,250,!open);
  if(open){
    text(r.name,640,438,36,'#f3e3c3','left',700);
    text(r.role,640,482,22,'#e8b84a','left',600);
    wrap(r.desc,640,532,550,32,23,'#d8c8b8');
  } else {
    text('???',640,438,36,'#8a7a7a','left',700);
    text(r.role.split(' · ')[0]+' · ???',640,482,22,'#8a6a40','left',600);
    wrap(r.boss!=null?'Sconfiggi questo boss nella storia per sbloccare la sua scheda.':'Sconfiggi almeno uno di questi nemici per sbloccare la sua scheda.',640,532,550,32,23,'#8a7a7a');
  }
  text('Frecce per sfogliare · ESC per tornare',640,700,18,'#9a8476','center',400);
}
