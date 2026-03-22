import { CharacterInfo } from '../types/characterSelect';

export const CHARACTER_LIST: CharacterInfo[] = [
  {
    name: 'Astra Vell',
    role: 'Warrior',
    image: '/img/characters/warrior.png',
    hp: 180,
    atk: 34,
    def: 22,
    crit: 12,
    skill: 'Solar Guard: 展開聖焰護盾後重斬，短時間大幅提升承傷能力。'
  },
  {
    name: 'Lyra Noelle',
    role: 'Mage',
    image: '/img/characters/mage.png',
    hp: 126,
    atk: 48,
    def: 10,
    crit: 24,
    skill: 'Starfall Array: 召喚星軌法陣，造成多段高爆發魔法傷害。'
  },
  {
    name: 'Nyx Raven',
    role: 'Assassin',
    image: '/img/characters/assassin.png',
    hp: 142,
    atk: 40,
    def: 12,
    crit: 32,
    skill: 'Night Execution: 瞬步背刺並疊加處決印記，爆發連段收割。'
  }
];
