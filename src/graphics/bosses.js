// Definizione e sprite dei sei boss.
import { flip, white } from '../utils.js';
import { BOSS_ART } from './bossArt.js';

export const BOSS_DEF=[
 {name:'Pushing l’Esattore',sub:'Primo scagnozzo di Anlaucer',fem:false,hp:4,w:28,h:28,
  pal:{k:'#140a0c',g:'#6ab040',G:'#3e7a2a',y:'#ffe040',r:'#c8303a',b:'#7a4a24',w:'#f4f0e0'},
  map:["................",".....kkkkkk.....","....krrrrrrk....",".k..krrrrrrk..k.","kgk.kggggggk.kgk",".kgkgyggggygkgk.","..kggkggggkggk..","...kggwwwwggk...","....kggggggk....","...kbbbbbbbbk...","..kgbbGbbGbbgk..","..kgbbbbbbbbgk..","...kbbbbbbbbk...","....kgk..kgk....","....kgk..kgk....","...kkkk..kkkk..."]},
 {name:'Gankàla la Strega dei Rovi',sub:'Secondo scagnozzo di Anlaucer',fem:true,hp:7,w:26,h:28,
  pal:{k:'#120812',p:'#4a2a6a',P:'#6a4a9a',g:'#7ab05a',y:'#ffe060',t:'#2a6a1a'},
  map:[".......kk.......","......kppk......",".....kpppk......",".....kpPppk.....","....kppppppk....","..kkkkkkkkkkkk..","....kgggggk.....","....kgyggyk.....","....kggkggk.....","...kpkgggkpk....","..kpppkkkpppk...","..kpPpptppPpk...",".kgpppptpppppgk.","..kpppPtPpppk...",".kpptpppptpppk..",".kkkkkkkkkkkkk.."]},
 {name:'Pushatomìdir il Rospo Mannaro',sub:'Terzo scagnozzo di Anlaucer',fem:false,hp:8,w:30,h:28,
  pal:{k:'#0e100a',g:'#6a7a30',G:'#8a9a40',y:'#ffd030',r:'#a02020',l:'#c8c890',f:'#5a4020'},
  map:["................","..f..........f..","..kkk......kkk..",".kyyyk....kyyyk.",".kykyk....kykyk.","..kkkkkkkkkkkk..",".kgfGgggggGgfgk.","kggggfgggfgggggk","kgkkkkkkkkkkkkgk","kgkrrrrrrrrrrkgk","kggkkkkkkkkkkggk","kgllllllllllllgk",".kgllllllllllgk.","kgkkggggggggkkgk","kggk.kkkkkk.kggk","kkkk........kkkk"]},
 {name:'Ser Rekter',sub:'Quarto scagnozzo di Anlaucer',fem:false,hp:8,w:24,h:30,
  pal:{k:'#0a0a10',m:'#7a8090',M:'#b0b8c8',r:'#c02030',e:'#ff4030',G:'#d0a040'},
  map:["......kkk.......",".....krrrk......","....kkrrkkk.....","...kmmmmmmmk....","...kmMmmmmmk....","...kkkkkkkkk....","...kmeekeemk....","...kkkkkkkkk....","..kmmmmmmmmmk...",".kmMmmmGmmmmmk..",".kmkmmmmmmmkmk..",".kmkmmGmmmmkmk..","..kkmmmmmmmkk...","...kmmk.kmmk....","...kmmk.kmmk....","..kkkkk.kkkkk..."]},
 {name:'Griefilla',sub:'Quinto scagnozzo di Anlaucer',fem:true,hp:8,w:28,h:22,
  pal:{k:'#0c060e',d:'#3a2440',D:'#5a3a66',e:'#ff3050',w:'#f0f0f0'},
  map:[".....k....k.....",".....kk..kk.....","k....kkkkkk....k","kk..kddddddk..kk","kdk.kdeddedk.kdk","kddkkddddddkkddk","kdddkdwddwdkdddk","kddddkddddkddddk","kdDddkddddkddDdk","kdkddkddddkddkdk","kk.kdkkddkkdk.kk","k...kk.kk.kk...k"]},
 {name:'Anlaucer',sub:'Il demone evocato dall\'anlaciamento',fem:false,hp:16,w:34,h:34,
  pal:{k:'#0a0204',r:'#b0181c',R:'#e03a2a',y:'#ffd030',W:'#e8e0d0',w:'#ffffff',d:'#2a0a14'},
  map:["kk................kk","kWk..............kWk",".kWk............kWk.",".kWWk..kkkkkk..kWWk.","..kWWkkrrrrrrkkWWk..","...kkrrrrrrrrrrkk...","dd.krrrrrrrrrrrrk.dd","ddkrrryyrrrryyrrrkdd","dddkrrykrrrrkyrrkddd","ddddkrrrrrrrrrrkdddd","dddddkrkwkwkwrkddddd","ddddkkrkkkkkkrkkdddd","dddkrrrrrrrrrrrrkddd","ddkrrRrrrrrrrrRrrkdd","dk.krrrrrrrrrrrrk.kd","d..krrRrrrrrrRrrk..d","....krrrrrrrrrrk....","....krrk....krrk....","...kkrrk....krrkk...","...kkkkk....kkkkk..."]}
];
// gli sprite veri sono disegnati a mano in bossArt.js (stesse dimensioni delle mappe qui sopra a pixel doppi)
export const BOSS_SPR=BOSS_ART.map(art=>{const c=art();const f=flip(c);return {r:c,l:f,wr:white(c),wl:white(f)};});
