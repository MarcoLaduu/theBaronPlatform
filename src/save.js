// Salvataggi nel browser: livelli sbloccati, personaggi scoperti, trucchi.
export function loadSave(){try{return Math.min(5,+localStorage.getItem('baruxLvl')||0);}catch(e){return 0;}}
export let SEEN=new Set();try{SEEN=new Set(JSON.parse(localStorage.getItem('baruxSeen')||'[]'));}catch(e){}
export function markSeen(id){if(SEEN.has(id))return;SEEN.add(id);try{localStorage.setItem('baruxSeen',JSON.stringify([...SEEN]));}catch(e){}}
export function save(n){try{if(n>loadSave())localStorage.setItem('baruxLvl',String(Math.min(5,n)));}catch(e){}}

export const CHEATS={lives:false,god:false,kill:false};
try{Object.assign(CHEATS,JSON.parse(localStorage.getItem('baruxCheats')||'{}'));}catch(e){}
export function saveCheats(){try{localStorage.setItem('baruxCheats',JSON.stringify(CHEATS));}catch(e){}}
export const startLives=()=>CHEATS.lives?99:3;
export const CHEAT_LIST=[
 {k:'lives',label:'99 vite',desc:'Ogni partita e ogni livello iniziano con 99 vite.'},
 {k:'god',label:'Invincibilità',desc:'Nessun danno. Se cadi in una fossa, torni a terra.'},
 {k:'kill',label:'Uccisione istantanea',desc:'Nemici e boss vengono sconfitti al primo colpo.'}];
