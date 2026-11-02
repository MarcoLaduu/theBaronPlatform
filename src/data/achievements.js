// Elenco degli obiettivi e loro sblocco.
import { sfx } from '../audio/audio.js';
import { ROSTER } from './roster.js';
import { BAR } from '../graphics/barux.js';
import { BOSS_SPR } from '../graphics/bosses.js';
import { KINDS } from '../graphics/enemies.js';
import { ICON } from '../graphics/icons.js';
import { COIN, HEART } from '../graphics/items.js';
import { CHEATS, SEEN } from '../save.js';

export const ACH=[
 {id:'b0',n:'Rivoluzione monetaria',d:'Sconfiggi Pushing l’Esattore',c:'Storia',ic:()=>BOSS_SPR[0].r},
 {id:'b1',n:'Sfoltire i rovi',d:'Sconfiggi Gankàla la Strega dei Rovi',c:'Storia',ic:()=>BOSS_SPR[1].r},
 {id:'b2',n:'Gracidio finale',d:'Sconfiggi Pushatomìdir il Rospo Mannaro',c:'Storia',ic:()=>BOSS_SPR[2].r},
 {id:'b3',n:'Contro Rektato',d:'Sconfiggi Ser Rekter',c:'Storia',ic:()=>BOSS_SPR[3].r},
 {id:'b4',n:'Griefami questo!',d:'Sconfiggi Griefilla',c:'Storia',ic:()=>BOSS_SPR[4].r},
 {id:'b5',n:'Fine dell’anlaciamento',d:'Sconfiggi Anlaucer e completa il gioco',c:'Storia',ic:()=>BOSS_SPR[5].r},
 {id:'intoccabile',n:'Intoccabile',d:'Completa un livello senza subire danni',c:'Abilità',ic:()=>ICON.shield},
 {id:'duello',n:'Duello perfetto',d:'Sconfiggi un boss senza subire danni',c:'Abilità',ic:()=>ICON.trophy},
 {id:'macchia',n:'Senza una macchia',d:'Completa il gioco senza perdere vite, partendo da una nuova partita',c:'Abilità',ic:()=>ICON.crown},
 {id:'acciaio',n:'Barone d’acciaio',d:'Completa il gioco senza subire nessun danno, partendo da una nuova partita',c:'Abilità',ic:()=>ICON.star},
 {id:'corsa',n:'Barone di corsa',d:'Completa un livello in meno di 2 minuti',c:'Abilità',ic:()=>ICON.clock},
 {id:'bastone',n:'Solo bastone',d:'Completa un livello senza mai saltare in testa ai nemici',c:'Abilità',ic:()=>ICON.cane},
 {id:'pacifista',n:'Pacifista',d:'Completa un livello sconfiggendo solo il boss',c:'Abilità',ic:()=>ICON.dove},
 {id:'primo',n:'Prima bastonata',d:'Sconfiggi il tuo primo nemico',c:'Combattimento',stat:'kills',goal:1,ic:()=>KINDS.goblin.fr[0]},
 {id:'luna',n:'Mezzaluna letale',d:'Sconfiggi 25 nemici con l’attacco in volo',c:'Combattimento',stat:'air',goal:25,ic:()=>ICON.moon},
 {id:'schiaccia',n:'Schiacciasassi',d:'Sconfiggi 50 nemici saltandogli in testa',c:'Combattimento',stat:'stomp',goal:50,ic:()=>BAR.jump[0]},
 {id:'flagello',n:'Flagello degli scagnozzi',d:'Sconfiggi 300 nemici in totale',c:'Combattimento',stat:'kills',goal:300,ic:()=>KINDS.imp.fr[0]},
 {id:'mittente',n:'Al mittente',d:'Distruggi 20 proiettili nemici col bastone',c:'Combattimento',stat:'proj',goal:20,ic:()=>ICON.orb},
 {id:'spicciolo',n:'Primo spicciolo',d:'Raccogli la prima moneta',c:'Collezione',stat:'coins',goal:1,ic:()=>COIN},
 {id:'tesoriere',n:'Tesoriere del barone',d:'Raccogli 500 monete in totale',c:'Collezione',stat:'coins',goal:500,ic:()=>ICON.sack},
 {id:'tasca',n:'Tasca piena',d:'Raccogli tutte le monete di un livello',c:'Collezione',ic:()=>ICON.chest},
 {id:'enciclopedia',n:'Enciclopedia del reame',d:'Sblocca tutti i personaggi della galleria',c:'Collezione',ic:()=>ICON.book},
 {id:'cuor',n:'Cuor di leone',d:'Arriva a 5 cuori',c:'Collezione',ic:()=>HEART},
 {id:'ohm',n:'Ohm',d:'Subisci 100 danni in totale',c:'Segreto',stat:'damage',goal:100,secret:1,ic:()=>ICON.broken},
 {id:'ostinato',n:'Ostinato',d:'Vai in game over 5 volte',c:'Segreto',stat:'gameovers',goal:5,secret:1,ic:()=>KINDS.skull.fr[0]}];
export const AST={u:{},s:{}};
try{const o=JSON.parse(localStorage.getItem('baruxAch')||'{}');Object.assign(AST.u,o.u||{});Object.assign(AST.s,o.s||{});}catch(e){}
function saveAch(){try{localStorage.setItem('baruxAch',JSON.stringify(AST));}catch(e){}}
export const cheatsOn=()=>CHEATS.lives||CHEATS.god||CHEATS.kill;
export const toasts=[];
export function unlock(id){if(cheatsOn()||AST.u[id])return;AST.u[id]=Date.now();saveAch();toasts.push({id,t:0});sfx('life');}
export function stat(k,n=1){if(cheatsOn())return;AST.s[k]=(AST.s[k]||0)+n;saveAch();for(const a of ACH)if(a.stat===k&&AST.s[k]>=a.goal)unlock(a.id);}
export function checkGallery(){if(ROSTER.every(r=>r.id==='barux'||SEEN.has(r.id)))unlock('enciclopedia');}
