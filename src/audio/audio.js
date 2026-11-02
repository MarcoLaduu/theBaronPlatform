// Musica, effetti sonori e suono del danno.
import { buf } from '../canvas.js';

import ohmUrl from '../assets/danno_barone.mp3';
export let AC=null,master=null,musicG=null,muted=false;
try{muted=localStorage.getItem('baruxMute')==='1';}catch(e){}
export function unlockAudio(){
  if(AC){if(AC.state==='suspended')AC.resume();return;}
  try{AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=muted?0:.55;master.connect(AC.destination);musicG=AC.createGain();musicG.gain.value=.55;musicG.connect(master);nextT=AC.currentTime+.05;loadOhm();}catch(e){AC=null;}
}
let ohmBuf=null,ohmLoading=false;
function loadOhm(){if(!AC||ohmBuf||ohmLoading)return;ohmLoading=true;fetch(ohmUrl).then(r=>r.arrayBuffer()).then(buf=>AC.decodeAudioData(buf,b=>{ohmBuf=b;},()=>{ohmLoading=false;})).catch(()=>{ohmLoading=false;});}
function playOhm(){if(!AC||muted)return false;if(!ohmBuf){loadOhm();return false;}const src=AC.createBufferSource(),g=AC.createGain();src.buffer=ohmBuf;src.playbackRate.value=.94+Math.random()*.12;g.gain.value=.95;src.connect(g);g.connect(master);src.start();return true;}
function tone(type,f0,f1,dur,vol=.12,delay=0){if(!AC||muted)return;const t=AC.currentTime+delay;const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);if(f1)o.frequency.exponentialRampToValueAtTime(f1,t+dur);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.02);}
function noise(dur,vol=.12,freq=1200){if(!AC||muted)return;const n=AC.sampleRate*dur|0,b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const s=AC.createBufferSource();s.buffer=b;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=freq;const g=AC.createGain();g.gain.value=vol;s.connect(f);f.connect(g);g.connect(master);s.start();}
const SFX={
  jump:()=>tone('square',260,560,.12,.07),
  coin:()=>{tone('square',988,0,.06,.06);tone('square',1318,0,.12,.06,.06);},
  swing:()=>noise(.09,.18,2400),
  kill:()=>{tone('square',500,120,.15,.08);noise(.1,.1,800);},
  hurt:()=>{if(!playOhm())tone('sawtooth',300,90,.3,.09);},
  slash:()=>{noise(.16,.2,3200);tone('triangle',900,300,.16,.05);},
  bossHit:()=>{tone('square',180,60,.18,.12);noise(.12,.2,600);},
  boom:()=>noise(.35,.3,300),
  flag:()=>{[523,659,784].forEach((f,i)=>tone('square',f,0,.12,.06,i*.08));},
  heart:()=>{[659,880].forEach((f,i)=>tone('triangle',f,0,.15,.1,i*.08));},
  portal:()=>{[392,523,659,784,1046].forEach((f,i)=>tone('triangle',f,0,.2,.1,i*.1));},
  die:()=>{[392,330,262,196].forEach((f,i)=>tone('square',f,0,.18,.08,i*.15));},
  throw:()=>tone('triangle',200,500,.12,.08),
  cast:()=>tone('sawtooth',800,200,.3,.05),
  slam:()=>{noise(.3,.3,200);tone('sine',90,40,.3,.2);},
  charge:()=>tone('sawtooth',120,240,.4,.06),
  screech:()=>tone('sawtooth',1400,600,.3,.05),
  fire:()=>noise(.2,.15,900),
  life:()=>{[523,659,784,1046].forEach((f,i)=>tone('square',f,0,.12,.07,i*.07));},
  roar:()=>{tone('sawtooth',90,50,.8,.14);noise(.6,.2,250);}
};
export function sfx(n){try{SFX[n]&&SFX[n]();}catch(e){}}
const SONGS=[
 {bpm:150,mel:[62,0,65,0,69,67,65,64,62,0,57,0,60,62,64,0,65,0,64,62,64,0,60,0,62,0,0,62,64,65,64,0],
  bas:[38,0,50,0,38,0,50,0,36,0,48,0,36,0,48,0,34,0,46,0,36,0,48,0,38,0,50,0,33,0,45,0]},
 {bpm:104,mel:[69,0,0,72,71,0,69,0,67,0,0,64,65,0,64,0,62,0,0,64,65,0,67,0,64,0,0,0,0,0,0,0],
  bas:[45,0,0,0,45,0,0,0,43,0,0,0,41,0,0,0,38,0,0,0,40,0,0,0,45,0,0,0,40,0,0,0]},
 {bpm:120,mel:[62,63,62,0,69,0,68,0,62,63,62,0,70,69,68,67,62,63,62,0,69,0,68,0,65,64,63,62,61,0,0,0],
  bas:[38,0,38,0,38,0,38,0,39,0,39,0,39,0,39,0,38,0,38,0,38,0,38,0,37,0,37,0,37,0,37,0]},
 {bpm:170,mel:[64,0,64,67,0,64,70,0,69,67,64,0,62,64,0,0,64,0,64,67,0,64,71,0,72,71,67,64,66,0,0,0],
  bas:[40,40,52,40,40,52,40,40,38,38,50,38,38,50,38,38,40,40,52,40,40,52,40,40,36,36,48,36,35,35,47,35]}
];
let song=-1,mstep=0,nextT=0;
export function music(i){if(song===i)return;song=i;mstep=0;if(AC)nextT=AC.currentTime+.08;}
function note(type,n,t,d,v){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=440*Math.pow(2,(n-69)/12);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(musicG);o.start(t);o.stop(t+d+.02);}
export function musicTick(){
  if(!AC||song<0||muted)return;
  const s=SONGS[song],sp=60/s.bpm/2;
  if(nextT<AC.currentTime)nextT=AC.currentTime+.02;
  while(nextT<AC.currentTime+.15){const m=s.mel[mstep%s.mel.length],b=s.bas[mstep%s.bas.length];if(m)note('square',m,nextT,sp*.9,.035);if(b)note('triangle',b,nextT,sp*1.5,.08);mstep++;nextT+=sp;}
}
export const isMuted=()=>muted;
export function setMute(m){muted=m;try{localStorage.setItem('baruxMute',m?'1':'0');}catch(e){}if(master)master.gain.value=m?0:.55;}
export function toggleMute(){unlockAudio();setMute(!muted);}
export const audioLabel=()=>'Audio: '+(muted?'spento':'acceso');
