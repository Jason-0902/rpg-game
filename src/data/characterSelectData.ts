import { CharacterInfo } from '../types/characterSelect';

const base = import.meta.env.BASE_URL;
const cimg = (name: string) => `${base}img/characters/${name}.png`;

export const CHARACTER_LIST: CharacterInfo[] = [
  {
    id: 'aelin',
    cnName: '艾琳・艾爾文',
    enName: 'AELIN SILVERWIND',
    role: 'Warrior',
    roleZh: '戰士',
    image: cimg('warrior'),
    hp: 180,
    atk: 34,
    def: 22,
    crit: 12,
    skill: '聖焰突進與防壁重斬，兼具開戰抗壓與破甲能力。'
  },
  {
    id: 'liana',
    cnName: '莉亞娜・星詠',
    enName: 'LIANA STARGAZER',
    role: 'Mage',
    roleZh: '法師',
    image: cimg('mage'),
    hp: 126,
    atk: 48,
    def: 10,
    crit: 24,
    skill: '展開星環法陣，連續施法造成高段數魔法爆發。'
  },
  {
    id: 'kage',
    cnName: '影・夜隼',
    enName: 'KAGE NIGHTHAWK',
    role: 'Assassin',
    roleZh: '刺客',
    image: cimg('assassin'),
    hp: 142,
    atk: 40,
    def: 12,
    crit: 32,
    skill: '瞬步背刺並疊加處決印記，以高爆擊連段終結目標。'
  }
];
