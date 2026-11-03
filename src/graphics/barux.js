// Sprite del Barone Barux.
import { flip, sprite } from '../utils.js';

// più toni: luce dall'alto a sinistra, ombre in basso a destra
const PAL_B={k:'#1a1020',p:'#2a1838',P:'#6a4a8a',q:'#b098d8',Q:'#b04458',H:'#86283a',h:'#5c1626',d:'#3a0c18',
 y:'#fff0a0',g:'#e8b84a',G:'#a8781e',e:'#2fb06a',r:'#d8344a',
 n:'#fbdcc0',s:'#eab894',S:'#c48a70',b:'#2a1a14',B:'#5a3a24',w:'#eef9ff',W:'#8aaed0',
 j:'#5a1424',J:'#7c2236',K:'#a8404e',v:'#d8a838',l:'#f2ecdc',t:'#3a0e1a',T:'#5e1e32',o:'#0c0a0c',O:'#4a4450'};
const B_TOP=[
"...pPq..........",
"...pPPqp........",
"....kPQHhhk.....",
"....kygggGk.....",
"....kgegrGk.....",
"....kQhghdk.....",
"....kQHhhdk.....",
"....kygggGk.....",
"..kkQHhhhhdkk...",
"....kbnsssSk....",
"...kkwWkkwWk....",
"....knsssSSk....",
"....kbBsBbbk....",
"....kbBbBbbk....",
".....kbBbbk.....",
"...kjKlllJjk....",
"..kjKgvlvgJjk...",
"..kjKyvGvgJjk...",
"..knjgvGvgjSk...",
"...kjgvvvgjk....",
"...kjjTttjjk...."];
const LEGS={
 idle:["....kTt.Ttk.....","....kTt.Ttk.....","...kOo..Ook....."],
 run1:["....kTt.Ttk.....","...kTt...Ttk....","..kOo.....Ook..."],
 run2:["....kTttTk......",".....kTtk.......",".....kOook......"],
 jump:["...kTtk.Ttk.....","..kOo...kOok....","................"]};
export const BAR={};
for(const k in LEGS){const c=sprite(B_TOP.concat(LEGS[k]),PAL_B);BAR[k]=[c,flip(c)];}
