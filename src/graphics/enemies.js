// Sprite e caratteristiche degli scagnozzi.
import { flip, sprite } from '../utils.js';

const IMP_PAL={k:'#14060a',R:'#c42c38',y:'#ffd84a',w:'#ffffff'};
const IMP_A=["..k......k..",".kRk....kRk.",".kRRkkkkRRk.","kRRRRRRRRRRk","kRyyRRRRyyRk","kRykRRRRykRk","kRRRRRRRRRRk",".kRwkwwkwRk.",".kRRRRRRRRk.","..kRRRRRRk.."];
const IMP=[sprite(IMP_A.concat(["..kRk..kRk..","..kkk..kkk.."]),IMP_PAL),sprite(IMP_A.concat([".kRk....kRk.",".kkk....kkk."]),IMP_PAL)];
const FLY_PAL={k:'#120818',p:'#7a4a9a',w:'#f0e8e0',r:'#d02040'};
const FLY=sprite(["kk..........kk","kpk..kkkk..kpk","kppkkwwwwkkppk","kpppkwwrrwkppk","kppkwwrkrwwkpk","kpk.kwwwwwk.kk","kk...kwwwk....","......kkk....."],FLY_PAL);
// ---------- scagnozzi minori, ispirati ai boss ----------
const GOB_A=["...kkkkkk...","..krrrrrrk..",".kkrrrrrrkk.","kgkggggggkgk",".kgykggykgk.","..kggwwggk..","...kggggk...","..kbbbbbbk..",".kgbbGbbbgk.","..kbbbbbbk.."];
const GOB_P={k:'#140a0c',g:'#6ab040',G:'#e8b84a',y:'#ffe040',r:'#c8303a',b:'#7a4a24',w:'#f4f0e0'};
const BR_A=["..s..s..s...",".ktkktkktk..","kTTtTTtTTtk.","stTyTTTyTts.","kTTkTTTkTTk.","sTTTTTTTTTs.","kTtTTtTTtTk.",".kTTTTTTTk.."];
const SO_A=["....kkkk....","...kmmmmk...","...kMmmmk...","...kkkkkk...","...kekkek...","...kmmmmk...","..kmmmmmmk..",".kmkmGmmkmk.",".kmkmmmmkmk.","..kkmmmmkk..","...kmkkmk..."];
const GA_A=["k..........k","kk.kkkkkk.kk","ksksSSSSsksk","kssseSSesssk",".ksSSSSSSsk.","..ksswwssk..",".kssssssssk.","kskssSSssksk","ks.kssssk.sk"];
const SK_B=["..kwwwwwk.",".kwwwwwwwk",".kwkkwkkwk",".kwkkwkkwk",".kwwwkwwwk","..kwwwwwk.","..kwkwkwk.","...kkkkk.."];
const RK_P={k:'#0a0a10',m:'#7a8090',M:'#b0b8c8',r:'#c02030',e:'#ff4030',G:'#d0a040'};
const KDEF={
 goblin:{maps:[GOB_A.concat(["..kgk..kgk..","..kkk..kkk.."]),GOB_A.concat([".kgk....kgk.",".kkk....kkk."])],pal:GOB_P,w:10,h:12,ai:'walk',spd:.6,hp:1,col:'#6ab040'},
 thrower:{maps:[GOB_A.concat(["..kgk..kgk..","..kkk..kkk.."])],pal:Object.assign({},GOB_P,{r:'#3a5ac8'}),w:10,h:12,ai:'throw',hp:1,col:'#6ab040'},
 bramble:{maps:[BR_A.concat(["..kTk.kTk...","..kkk.kkk..."]),BR_A.concat([".kTk...kTk..",".kkk...kkk.."])],pal:{k:'#0e1a08',t:'#2a5a1a',T:'#4a8a2a',s:'#e8dcb0',y:'#ffe060'},w:10,h:10,ai:'walk',spd:.45,hp:1,spiky:1,col:'#4a8a2a'},
 witch:{maps:[["....kk......","...kppk.....","..kpPppk....",".kkkkkkkk...","...kgygk....","...kgggk....","..kppppk....",".kgpPpppk...","bbbbbbbbbkyy","..kpppk..kyy","...kk......."]],pal:{k:'#120812',p:'#4a2a6a',P:'#6a4a9a',g:'#7ab05a',y:'#ffe060',b:'#7a4a24'},w:10,h:10,ai:'caster',fly:1,fx:.02,ax:36,ay:6,hp:1,col:'#6a4a9a'},
 toadlet:{maps:[[".kk....kk...","kyyk..kyyk..","kykkkkkkyk..","kgggGggggk..","kgkkkkkkgk..","kglllllllgk.",".kgllllllgk.","kgkggggggkgk","kk.kkkkkk.kk"]],pal:{k:'#0e100a',g:'#6a7a30',G:'#8a9a40',y:'#ffd030',l:'#c8c890'},w:10,h:9,ai:'hop',hp:1,col:'#6a7a30'},
 mosquito:{maps:[[".aa..aa...","aaaaaaaa..",".kaakaak..","kddddddk..","kdrddddkkk",".kdddddk..","..k.k.k..."],["..........","..........",".kkkkkkk..","kddddddk..","kdrddddkkk","akdddddka.","aak.k.kaa."]],pal:{k:'#14100a',a:'#c8e0f0',d:'#6a4a2a',r:'#ff3030'},w:8,h:6,ai:'sine',fly:1,fx:.045,ax:34,ay:12,hp:1,col:'#6a4a2a'},
 soldier:{maps:[SO_A.concat(["...kmk.kmk..","..kkkk.kkkk."]),SO_A.concat(["..kmk..kmk..",".kkkk..kkkk."])],pal:RK_P,w:10,h:13,ai:'charge',hp:2,col:'#b0b8c8'},
 helmet:{maps:[["....rrr.....","...krrrk....","..kmmmmmk...",".kmMmmmmmk..",".kkkkkkkkk..",".kmeekeemk..",".kkkkkkkkk..","..kmmmmmk...","...kkkkk...."]],pal:RK_P,w:9,h:9,ai:'sine',fly:1,fx:.025,ax:30,ay:7,hp:2,col:'#b0b8c8'},
 bat:{maps:[["k............k","kk..k....k..kk","kdk.kkkkkk.kdk","kddkkdeedkkddk","kdddkddddkdddk","kk.kkdwwdkk.kk","k....kkkk....k"],["..............","....k....k....","....kkkkkk....","..kkkdeedkkk..","kkddkddddkddkk","kdddkdwwdkdddk","kdk..kkkk..kdk"]],pal:{k:'#0c060e',d:'#3a2440',e:'#ff3050',w:'#f0f0f0'},w:12,h:6,ai:'dive',fly:1,hp:1,col:'#5a3a66'},
 gargoyle:{maps:[GA_A.concat(["...ksk.ksk..","...kkk.kkk.."]),GA_A.concat(["..ksk...ksk.","..kkk...kkk."])],pal:{k:'#0e0e14',s:'#5a5a6a',S:'#8a8a9a',e:'#ff3050',w:'#e0e0e0'},w:10,h:11,ai:'walk',spd:.35,hp:2,col:'#8a8a9a'},
 skull:{maps:[["..f..y..f.",".fyf.fyfy."].concat(SK_B),[".f..y..f..","fyf.yfyf.."].concat(SK_B)],pal:{k:'#1a0408',w:'#e8e0d0',f:'#ff6020',y:'#ffd060'},w:9,h:10,ai:'dive',fly:1,hp:1,col:'#ff6020'}
};
export const KINDS={};
for(const k in KDEF){const d=KDEF[k],fr=d.maps.map(m=>sprite(m,d.pal));KINDS[k]=Object.assign({},d,{fr,frL:fr.map(flip)});}
KINDS.imp={fr:IMP,frL:IMP,w:10,h:12,ai:'walk',spd:.55,hp:1,col:'#c42c38'};
