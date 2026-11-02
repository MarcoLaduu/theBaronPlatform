// Sprite del Barone Barux.
import { flip, sprite } from '../utils.js';

const PAL_B={k:'#1a1020',h:'#5c1626',H:'#86283a',g:'#e8b84a',G:'#a8781e',e:'#2fb06a',r:'#d8344a',p:'#2a1838',P:'#6a4a8a',s:'#eab894',b:'#2a1a14',w:'#dff4ff',j:'#5a1424',J:'#7c2236',v:'#d8a838',l:'#f2ecdc',t:'#3a0e1a',o:'#0c0a0c'};
const B_TOP=[
"...pPp..........",
"...pPPPp........",
"....kPhhhhk.....",
"....khgggHk.....",
"....kgegrGk.....",
"....khhghHk.....",
"....khhhhHk.....",
"....kggggGk.....",
"..kkhhhhhhhkk...",
"....kbsssssk....",
"...kkwwkkwwk....",
"....kssssssk....",
"....kbbsbbbk....",
"....kbbbbbbk....",
".....kbbbbk.....",
"...kjJlllJjk....",
"..kjJgvlvgJjk...",
"..kjJgvGvgJjk...",
"..ksjgvGvgjsk...",
"...kjgvvvgjk....",
"...kjjtttjjk...."];
const LEGS={
 idle:["....ktt.ttk.....","....ktt.ttk.....","...koo..ook....."],
 run1:["....ktt.ttk.....","...ktt...ttk....","..koo.....ook..."],
 run2:["....kttttk......",".....kttk.......",".....koook......"],
 jump:["...kttk.ttk.....","..koo...kook....","................"]};
export const BAR={};
for(const k in LEGS){const c=sprite(B_TOP.concat(LEGS[k]),PAL_B);BAR[k]=[c,flip(c)];}
