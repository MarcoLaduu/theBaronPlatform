// Stato condiviso della partita: tutti i moduli leggono e scrivono qui.
export const G={
  state:'title',lvlIndex:0,lvl:null,tiles:null,bg:null,P:null,
  ents:[],projs:[],parts:[],boss:null,fight:false,portal:null,atkBox:null,
  pauseSel:0,selL:0,selG:0,cheatSel:0,cheatsFrom:'title',selA:0,menuSel:0,titleX:0,
  levelRun:{damaged:false,stomped:false,kills:0,frames:0,coins:0,coinTotal:0,bossHit:false},
  gameRun:{fromStart:false,deaths:0,damaged:false},
  oneUpT:0,lvlChoice:null,helpFrom:'play',
  lives:3,coins:0,levelStartCoins:0,frame:0,stT:0,shake:0,checkpoint:null,
};
export const cam={x:0,y:0};
