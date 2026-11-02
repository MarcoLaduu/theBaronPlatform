// Sprite di monete e cuori.
import { sprite } from '../utils.js';

export const COIN=sprite(["..kkkk..",".kgggGk.","kgllggGk","kglgggGk","kgggggGk","kgggGGGk",".kGGGGk.","..kkkk.."],{k:'#5a3a08',g:'#f0c040',G:'#b8861a',l:'#fff2b0'});
const HEART_ROWS=[".kk.kk.","krrkrrk","krlrrrk","krrrrrk",".krrrk.","..krk..","...k..."];
export const HEART=sprite(HEART_ROWS,{k:'#3a0a10',r:'#e03040',l:'#ff9aa8'});
export const HEART_E=sprite(HEART_ROWS,{k:'#1a1014',r:'#4a3a40',l:'#5a4a50'});
