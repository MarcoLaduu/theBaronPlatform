// Ciclo di gioco: stati, menu, livelli, avvio.
import { music, musicTick, sfx, toggleMute } from '../audio/audio.js';
import { H, ROWS, T, W } from '../config.js';
import { puff, updateParts } from './particles.js';
import { ACH, checkGallery, toasts, unlock } from '../data/achievements.js';
import { ROSTER } from '../data/roster.js';
import { startFight, updateBoss } from '../entities/bosses.js';
import { spawnEnt, updateEnts, updateMP } from '../entities/entities.js';
import { die, hurt, newPlayer, respawn, updatePlayer } from '../entities/player.js';
import { updateProjs } from '../entities/projectiles.js';
import { confirmHit, hit, menuOK, pollPad, tapPos, tickPad } from '../input.js';
import { INTRO, render } from '../render/screens.js';
import { CHEATS, CHEAT_LIST, helpSeen, loadSave, markHelpSeen, markSeen, save, saveCheats, startLives } from '../save.js';
import { checkOrientation, syncTouchUI } from '../mobile.js';
import { G, cam } from '../state.js';
import { AUDIO_BTN, G_COLS, PAUSE_STEP, PAUSE_Y, TITLE_STEP, TITLE_Y, aRect, backHit, cheatRect, galRect, inRect, levelRect } from '../ui/layout.js';
import { clamp, overlap } from '../utils.js';
import { genLevel } from '../world/level.js';
import { tileAt } from '../world/physics.js';
import { THEMES, getTheme } from '../world/themes.js';

function loadLevel(i){
  G.lvlIndex=i;G.lvl=genLevel(i);[G.tiles,G.bg]=getTheme(i);
  G.ents=G.lvl.ents.map(spawnEnt);G.projs=[];G.parts=[];G.boss=null;G.fight=false;G.portal=null;
  G.checkpoint={x:G.lvl.start.x,y:G.lvl.start.y};G.P=newPlayer(G.checkpoint.x,G.checkpoint.y);
  G.levelRun={damaged:false,stomped:false,kills:0,frames:0,coins:0,coinTotal:G.ents.filter(e=>e.t==='coin').length,bossHit:false};
  G.levelStartCoins=G.coins;cam.x=0;cam.y=ROWS*T-H;
}

function spikeCheck(){
  if(CHEATS.god)return;
  const c0=Math.floor(G.P.x/T),c1=Math.floor((G.P.x+G.P.w-1)/T),r0=Math.floor(G.P.y/T),r1=Math.floor((G.P.y+G.P.h-1)/T);
  for(let r=r0;r<=r1;r++)for(let c=c0;c<=c1;c++)if(tileAt(c,r)==='^'&&G.P.y+G.P.h>r*T+9){hurt(c*T+8);if(G.state==='play')G.P.vy=-5;return;}
}
function camera(){
  let tx,ty=G.P.y-92;
  if(G.fight)tx=G.lvl.A*T;
  else tx=G.P.x+G.P.w/2-W/2+G.P.dir*24;
  tx=clamp(tx,0,G.lvl.cols*T-W);ty=clamp(ty,0,ROWS*T-H);
  cam.x+=(tx-cam.x)*(G.fight?.12:.15);cam.y+=(ty-cam.y)*.1;
}
function levelClear(){markSeen('boss'+G.lvlIndex);
  unlock('b'+G.lvlIndex);
  if(!G.levelRun.damaged)unlock('intoccabile');
  if(!G.levelRun.bossHit)unlock('duello');
  if(G.levelRun.frames<7200)unlock('corsa');
  if(!G.levelRun.stomped)unlock('bastone');
  if(G.levelRun.kills===0)unlock('pacifista');
  if(G.levelRun.coinTotal>0&&G.levelRun.coins>=G.levelRun.coinTotal)unlock('tasca');
  if(G.lvlIndex===5&&G.gameRun.fromStart&&G.gameRun.deaths===0)unlock('macchia');
  if(G.lvlIndex===5&&G.gameRun.fromStart&&!G.gameRun.damaged)unlock('acciaio');
  checkGallery();
  G.state='clear';G.stT=0;save(G.lvlIndex+1);sfx('portal');}

function updatePlay(){
  G.levelRun.frames++;
  if(G.oneUpT>0)G.oneUpT--;
  if(hit.pause){G.state='pause';G.pauseSel=0;return;}
  for(const m of G.ents)if(m.t==='mp')updateMP(m);
  updatePlayer();
  G.atkBox=(G.P.atk>3&&G.P.atk<13)?(G.P.air?{x:G.P.dir>0?G.P.x-2:G.P.x-18,y:G.P.y-8,w:30,h:38}:{x:G.P.dir>0?G.P.x+G.P.w-2:G.P.x-16,y:G.P.y+5,w:18,h:13}):null;
  updateEnts();
  if(!G.fight&&!G.portal&&G.P.x>(G.lvl.A+3)*T)startFight();
  if(G.boss)updateBoss();
  if(G.state!=='play')return;
  updateProjs();
  updateParts();
  if(G.portal){G.portal.t++;if(overlap(G.P,G.portal)){levelClear();return;}}
  spikeCheck();
  if(G.P.y+G.P.h>ROWS*T-4){if(CHEATS.god){G.P.x=G.P.safe.x;G.P.y=G.P.safe.y;G.P.vx=0;G.P.vy=0;G.P.inv=40;puff(G.P.x+5,G.P.y+10,'#e8b84a',10,1.5);}else{G.P.hp=0;die();}}
  camera();
}

// ---------- ciclo ----------
function step(){
  G.frame++;
  pollPad();tickPad();checkOrientation();syncTouchUI();
  if(toasts.length){toasts[0].t++;if(toasts[0].t>210)toasts.shift();}
  if(G.shake>0){G.shake*=.86;if(G.shake<.4)G.shake=0;}
  switch(G.state){
  case 'title':{G.titleX+=.4;const items=titleItems(),n=items.length;
    if(G.menuSel>=n)G.menuSel=0;
    if(hit.down||hit.right)G.menuSel=(G.menuSel+1)%n;
    if(hit.up||hit.left)G.menuSel=(G.menuSel+n-1)%n;
    if(hit.tap&&tapPos&&inRect(tapPos,AUDIO_BTN)){toggleMute();break;}
    if(hit.tap&&tapPos){items.forEach((it,i)=>{if(Math.abs(tapPos.y-(TITLE_Y+i*TITLE_STEP))<28&&Math.abs(tapPos.x-820)<240){G.menuSel=i;it.act();}});break;}
    if(hit.cont&&loadSave()>0){startGame(true);break;}
    if(menuOK())items[G.menuSel].act();
    break;}
  case 'levels':{G.titleX+=.4;const max=loadSave();
    if(hit.right)G.selL=Math.min(5,G.selL+1);if(hit.left)G.selL=Math.max(0,G.selL-1);
    if(hit.down)G.selL=Math.min(5,G.selL+3);if(hit.up)G.selL=Math.max(0,G.selL-3);
    if(hit.pause){G.state='title';break;}
    if(hit.tap&&tapPos){if(backHit()){G.state='title';break;}for(let i=0;i<6;i++){const r=levelRect(i);if(inRect(tapPos,r)){G.selL=i;if(i<=max)startLevel(i);}}break;}
    if(menuOK()&&G.selL<=max)startLevel(G.selL);
    break;}
  case 'gallery':{G.titleX+=.4;const n=ROSTER.length;
    if(hit.right)G.selG=Math.min(n-1,G.selG+1);if(hit.left)G.selG=Math.max(0,G.selG-1);
    if(hit.down)G.selG=Math.min(n-1,G.selG+G_COLS);if(hit.up)G.selG=Math.max(0,G.selG-G_COLS);
    if(hit.pause||hit.start){G.state='title';break;}
    if(hit.tap&&tapPos){if(backHit()){G.state='title';break;}for(let i=0;i<n;i++)if(inRect(tapPos,galRect(i)))G.selG=i;}
    break;}
  case 'ach':{G.titleX+=.4;const n=ACH.length;
    if(hit.right)G.selA=Math.min(n-1,G.selA+1);if(hit.left)G.selA=Math.max(0,G.selA-1);
    if(hit.down)G.selA=Math.min(n-1,G.selA+7);if(hit.up)G.selA=Math.max(0,G.selA-7);
    if(hit.pause||hit.start){G.state='title';break;}
    if(hit.tap&&tapPos){if(backHit()){G.state='title';break;}for(let i=0;i<n;i++)if(inRect(tapPos,aRect(i)))G.selA=i;}
    break;}
  case 'cheats':{if(G.cheatsFrom==='title')G.titleX+=.4;
    const nc=CHEAT_LIST.length,nr=nc+1;
    if(hit.down)G.cheatSel=(G.cheatSel+1)%nr;if(hit.up)G.cheatSel=(G.cheatSel+nr-1)%nr;
    let act=-1;
    if(hit.pause)act=nc;
    else if(hit.tap&&tapPos){if(backHit())act=nc;else for(let i=0;i<nr;i++)if(inRect(tapPos,cheatRect(i))){G.cheatSel=i;act=i;}}
    else if(menuOK())act=G.cheatSel;
    if(act>=0&&act<nc){const k=CHEAT_LIST[act].k;CHEATS[k]=!CHEATS[k];saveCheats();sfx(CHEATS[k]?'flag':'kill');
      if(k==='lives'&&CHEATS.lives&&G.cheatsFrom==='pause')G.lives=Math.max(G.lives,99);}
    if(act===nc)G.state=G.cheatsFrom;
    break;}
  case 'intro':G.stT++;camera0();if(confirmHit()){if(G.stT<INTRO.length*45)G.stT=INTRO.length*45;else{G.state='card';G.stT=0;}}break;
  case 'card':G.stT++;updateParts();camera();if((G.stT>30&&confirmHit())||G.stT>170){G.stT=0;
    // la prima volta che si gioca il livello 1 compare la finestra con i comandi
    if(G.lvlIndex===0&&!helpSeen()){G.state='help';G.helpFrom='play';}else G.state='play';}break;
  case 'help':G.stT++;if(G.stT>20&&(menuOK()||hit.tap||hit.pause)){markHelpSeen();G.state=G.helpFrom;G.stT=0;}break;
  case 'play':updatePlay();break;
  case 'pause':{
    if(hit.down)G.pauseSel=(G.pauseSel+1)%5;if(hit.up)G.pauseSel=(G.pauseSel+4)%5;
    if(hit.pause){G.state='play';break;}
    let act=-1;
    if(hit.tap&&tapPos&&inRect(tapPos,AUDIO_BTN)){toggleMute();break;}
    if(hit.tap&&tapPos){for(let i=0;i<5;i++)if(Math.abs(tapPos.y-(PAUSE_Y+i*PAUSE_STEP))<28&&Math.abs(tapPos.x-640)<240)act=i;}
    else if(menuOK())act=G.pauseSel;
    if(act===0)G.state='play';
    else if(act===1){G.coins=G.levelStartCoins;loadLevel(G.lvlIndex);G.state='card';G.stT=0;music(THEMES[G.lvlIndex].song);}
    else if(act===2){G.helpFrom='pause';G.stT=0;G.state='help';}
    else if(act===3){G.cheatsFrom='pause';G.cheatSel=0;G.state='cheats';}
    else if(act===4){G.coins=G.levelStartCoins;G.state='title';G.menuSel=0;music(0);}
    break;}
  case 'dead':G.stT++;G.P.vy+=.3;G.P.y+=G.P.vy;updateParts();if(G.stT>100)respawn();break;
  case 'clear':G.stT++;updateParts();if(G.stT>50&&confirmHit()){if(G.lvlIndex>=5){G.state='win';G.stT=0;music(0);}else{loadLevel(G.lvlIndex+1);G.state='card';G.stT=0;music(THEMES[G.lvlIndex].song);}}break;
  case 'gameover':G.stT++;if(G.stT>50&&confirmHit()){G.lives=startLives();G.coins=G.levelStartCoins;loadLevel(G.lvlIndex);G.state='card';G.stT=0;music(THEMES[G.lvlIndex].song);}break;
  case 'win':G.stT++;updateParts();if(G.frame%10===0)puff(Math.random()*W,Math.random()*H*.6,['#e8b84a','#d8344a','#2fb06a','#ffffff'][G.frame/10%4|0],10,2);if(G.stT>80&&confirmHit()){G.state='title';G.menuSel=0;music(0);}break;
  }
  for(const k in hit)hit[k]=false;
}
export function titleItems(){const sv=loadSave(),it=[{label:'Nuova partita',act:()=>startGame(false)}];
  if(sv>0)it.push({label:'Continua · Livello '+(sv+1),act:()=>startGame(true)});
  it.push({label:'Seleziona livello',act:()=>{G.state='levels';G.selL=Math.min(loadSave(),5);}});
  it.push({label:'Personaggi',act:()=>{G.state='gallery';G.selG=0;}});
  it.push({label:'Obiettivi',act:()=>{G.state='ach';G.selA=0;}});
  it.push({label:'Trucchi',act:()=>{G.cheatsFrom='title';G.cheatSel=0;G.state='cheats';}});
  return it;}
function startLevel(i){G.gameRun={fromStart:false,deaths:0,damaged:false};G.lives=startLives();G.coins=0;loadLevel(i);G.state='card';G.stT=0;music(THEMES[i].song);}
function camera0(){cam.x=0;cam.y=ROWS*T-H;}
function startGame(cont){
  G.lives=startLives();G.coins=0;G.gameRun={fromStart:!cont,deaths:0,damaged:false};
  if(cont){loadLevel(loadSave());G.state='card';}
  else{loadLevel(0);G.state='intro';}
  G.stT=0;music(THEMES[G.lvlIndex].song);
}

let last=performance.now(),acc=0;
function loop(now){
  acc+=Math.min(100,now-last);last=now;
  while(acc>=1000/60){step();acc-=1000/60;}
  try{render();}catch(e){console.error(e);}
  musicTick();
  requestAnimationFrame(loop);
}
export function boot(){
  getTheme(0);music(0);
  const go=()=>requestAnimationFrame(t=>{last=t;loop(t);});
  if(document.fonts&&document.fonts.load){Promise.race([document.fonts.load("700 40px 'Pixelify Sans'"),new Promise(r=>setTimeout(r,1500))]).then(go,go);}else go();
}
