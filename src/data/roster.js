// Schede della galleria dei personaggi.
import { BAR } from '../graphics/barux.js';
import { BOSS_DEF, BOSS_SPR } from '../graphics/bosses.js';
import { KINDS } from '../graphics/enemies.js';
import { THEMES } from '../world/themes.js';
import { mk } from '../utils.js';

// Ser Rekter nella galleria: lo sprite del boss con la lancia, come appare in battaglia.
let rekterCard=null;
function rekterImg(){
  if(!rekterCard)rekterCard=mk(54,36,x=>{
    const f=(a,b,w,h,c)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
    x.drawImage(BOSS_SPR[3].r,2,4);
    f(30,17,22,4,'#1a1c28');f(31,18,20,2,'#c8ccd8');f(50,17,3,4,'#ffffff');f(28,16,4,6,'#7a8090'); // lancia
  });
  return rekterCard;
}

export const ROSTER=[
 {id:'barux',name:'Barone Barux',role:'Il protagonista',img:()=>BAR.idle[0],desc:'Nobile di Castelbarux dal cilindro più alto del reame. Fu anlaciato troppo e ora deve rimediare a colpi di bastone.'},
 {id:'goblin',name:'Goblin di strada',lv:0,desc:'Goblin di bassa lega al servizio dell’Esattore. Pattuglia i vicoli della città vecchia.'},
 {id:'thrower',name:'Goblin riscossore',lv:0,desc:'Goblin col berretto blu. Riscuote a distanza, lanciando monete a parabola.'},
 {id:'boss0',boss:0,desc:'Goblin avido che riscuote tasse mai votate da nessuno. A chi non paga, tira addosso le monete.'},
 {id:'bramble',name:'Rovo ambulante',lv:1,desc:'Cespuglio di spine con le gambe. Saltargli in testa è una pessima idea: meglio il bastone.'},
 {id:'witch',name:'Streghetta',lv:1,desc:'Apprendista di Gankàla. Vola sulla scopa e lancia sfere velenose.'},
 {id:'boss1',boss:1,desc:'Strega del Bosco Oscuro. Sparisce e riappare dove meno te lo aspetti, e fa spuntare rovi dal terreno.'},
 {id:'toadlet',name:'Rospetto',lv:2,desc:'Figlio di Pushatomìdir. Appena ti vede, ti salta incontro.'},
 {id:'mosquito',name:'Zanzarone',lv:2,desc:'Zanzara della palude grande quanto un gatto. Vola a zig zag tra le nebbie.'},
 {id:'boss2',boss:2,desc:'Rospo grande quanto una carrozza. Ogni suo atterraggio fa tremare la palude con onde d’urto.'},
 {id:'soldier',name:'Fante di Rekter',lv:3,desc:'Soldato corazzato. Se ti vede sulla sua strada, carica con la lancia. Servono due colpi.'},
 {id:'helmet',name:'Elmo infestato',lv:3,desc:'Un elmo che fluttua da solo nelle miniere. Duro di testa: servono due colpi.'},
 {id:'boss3',boss:3,desc:'Armatura vuota posseduta. Carica a testa bassa con la lancia e, quando sbatte contro un muro, fa crollare la miniera. A metà battaglia l’elmo si stacca e combatte da solo.'},
 {id:'bat',name:'Pipistrello',lv:4,desc:'Aspetta tra le campane e si tuffa su chi passa sotto.'},
 {id:'gargoyle',name:'Gargoyle',lv:4,desc:'Statua di pietra che ha deciso di sgranchirsi le gambe. Dura: due colpi.'},
 {id:'boss4',boss:4,desc:'Pipistrella gigante della torre. Strilla onde sonore e si getta in picchiata sulle prede.'},
 {id:'imp',name:'Diavoletto',lv:5,desc:'Evocato da Anlaucer. Piccolo, rosso e molto fastidioso.'},
 {id:'skull',name:'Teschio infuocato',lv:5,desc:'Teschio avvolto dalle fiamme che piomba sugli intrusi della fortezza.'},
 {id:'boss5',boss:5,desc:'Il demone nato dall’anlaciamento eccessivo del Barone. Palle di fuoco, diavoletti e voli radenti.'}];
for(const r of ROSTER){
  if(r.boss!=null){const d=BOSS_DEF[r.boss];r.name=d.name;r.role=(r.boss===5?'Boss finale':'Boss')+' · '+THEMES[r.boss].name;r.img=r.boss===3?rekterImg:()=>BOSS_SPR[r.boss].r;}
  else if(r.lv!=null){r.role='Scagnozzo · '+THEMES[r.lv].name;r.img=()=>KINDS[r.id].fr[0];}
}
