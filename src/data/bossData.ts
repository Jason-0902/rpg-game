import { BossTemplate } from '../types/game';

export const BOSS_TEMPLATES: BossTemplate[] = [
  {
    name: 'Ashfang',
    title: 'Flame Warden',
    baseHp: 130,
    baseAtk: 20,
    baseDef: 6,
    baseCrit: 0.1,
    hpScale: 22,
    atkScale: 5,
    defScale: 2,
    critScale: 0.004,
    enrageThreshold: 0.45,
    enrageBonus: 0.2
  },
  {
    name: 'Dreadmire',
    title: 'Bog Tyrant',
    baseHp: 145,
    baseAtk: 18,
    baseDef: 9,
    baseCrit: 0.08,
    hpScale: 24,
    atkScale: 4,
    defScale: 2.6,
    critScale: 0.004,
    enrageThreshold: 0.35,
    enrageBonus: 0.25
  },
  {
    name: 'Cinderskull',
    title: 'Skull of Ember',
    baseHp: 120,
    baseAtk: 25,
    baseDef: 5,
    baseCrit: 0.12,
    hpScale: 20,
    atkScale: 6,
    defScale: 1.9,
    critScale: 0.005,
    enrageThreshold: 0.5,
    enrageBonus: 0.22
  },
  {
    name: 'Abyss Herald',
    title: 'Voice of the Rift',
    baseHp: 150,
    baseAtk: 19,
    baseDef: 8,
    baseCrit: 0.1,
    hpScale: 26,
    atkScale: 4,
    defScale: 2.4,
    critScale: 0.005,
    enrageThreshold: 0.4,
    enrageBonus: 0.26
  },
  {
    name: 'Storm Colossus',
    title: 'Titan of Thunder',
    baseHp: 165,
    baseAtk: 21,
    baseDef: 10,
    baseCrit: 0.09,
    hpScale: 28,
    atkScale: 5,
    defScale: 2.8,
    critScale: 0.004,
    enrageThreshold: 0.42,
    enrageBonus: 0.2
  },
  {
    name: 'Night Sovereign',
    title: 'King of Eclipse',
    baseHp: 175,
    baseAtk: 24,
    baseDef: 11,
    baseCrit: 0.13,
    hpScale: 30,
    atkScale: 5.4,
    defScale: 3,
    critScale: 0.006,
    enrageThreshold: 0.48,
    enrageBonus: 0.25
  }
];
