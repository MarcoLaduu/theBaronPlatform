// Salvataggi nel browser: livelli sbloccati, personaggi scoperti, trucchi.
// true solo con "npm run dev": in produzione il trucco "Sblocca tutto" non esiste.
export const IS_DEV=import.meta.env.DEV;
const realSave=()=>{try{return Math.min(5,+localStorage.getItem('baruxLvl')||0);}catch(e){return 0;}};
export const devUnlock=()=>IS_DEV&&!!CHEATS.dev;
export function loadSave(){return devUnlock()?5:realSave();}
export let SEEN=new Set();try{SEEN=new Set(JSON.parse(localStorage.getItem('baruxSeen')||'[]'));}catch(e){}
export function markSeen(id){if(SEEN.has(id))return;SEEN.add(id);try{localStorage.setItem('baruxSeen',JSON.stringify([...SEEN]));}catch(e){}}
export function save(n){try{if(n>realSave())localStorage.setItem('baruxLvl',String(Math.min(5,n)));}catch(e){}}

export const CHEATS={lives:false,god:false,kill:false};
try{Object.assign(CHEATS,JSON.parse(localStorage.getItem('baruxCheats')||'{}'));}catch(e){}
export function saveCheats(){try{localStorage.setItem('baruxCheats',JSON.stringify(CHEATS));}catch(e){}}
export const isSeen=id=>devUnlock()||SEEN.has(id);
export const startLives=()=>CHEATS.lives?99:3;
export const CHEAT_LIST=[
 {k:'lives',label:'99 vite',desc:'Ogni partita e ogni livello iniziano con 99 vite.'},
 {k:'god',label:'Invincibilità',desc:'Nessun danno. Se cadi in una fossa, torni a terra.'},
 {k:'kill',label:'Uccisione istantanea',desc:'Nemici e boss vengono sconfitti al primo colpo.'}];
if(IS_DEV)CHEAT_LIST.push({k:'dev',label:'Sblocca tutto (solo in locale)',desc:'Tutto visibile; i salvataggi veri restano intatti.'});
