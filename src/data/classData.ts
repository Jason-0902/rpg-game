import { ClassTemplate } from '../types/game';

const base = import.meta.env.BASE_URL;
const cimg = (name: 'warrior' | 'mage' | 'assassin') => `${base}img/characters/${name}.png`;

export const CLASS_TEMPLATES: Record<ClassTemplate['id'], ClassTemplate> = {
  warrior: {
    id: 'warrior',
    name: '戰士',
    short: '戰',
    description: '前線坦克，血量與防禦最高，能在長期戰鬥中穩定輸出。',
    passive: '守護本能：防禦生效倍率提高。',
    skillName: '鋼鐵堡壘',
    skillDescription: '獲得高額護盾，下一次受到傷害額外降低。',
    avatar: cimg('warrior'),
    cardTheme: 'hero-card-warrior',
    base: {
      hp: 160,
      atk: 24,
      def: 16,
      crit: 0.12
    },
    growth: {
      hp: 22,
      atk: 4,
      def: 3,
      crit: 0.006
    }
  },
  mage: {
    id: 'mage',
    name: '法師',
    short: '法',
    description: '法術爆發職業，攻擊與技能倍率極高但防禦薄弱。',
    passive: '元素精通：爆擊時追加法術殘響。',
    skillName: '奧術新星',
    skillDescription: '對首領造成高傷害並短暫降低其防禦。',
    avatar: cimg('mage'),
    cardTheme: 'hero-card-mage',
    base: {
      hp: 110,
      atk: 36,
      def: 8,
      crit: 0.2
    },
    growth: {
      hp: 14,
      atk: 7,
      def: 1,
      crit: 0.01
    }
  },
  assassin: {
    id: 'assassin',
    name: '刺客',
    short: '刺',
    description: '高速斬殺，爆擊率高，透過連擊與瞬間爆發收頭。',
    passive: '致命節奏：連續攻擊會提升爆擊率。',
    skillName: '暗影連斬',
    skillDescription: '連續刺擊，會根據爆擊率獲得額外段數。',
    avatar: cimg('assassin'),
    cardTheme: 'hero-card-assassin',
    base: {
      hp: 125,
      atk: 30,
      def: 10,
      crit: 0.28
    },
    growth: {
      hp: 16,
      atk: 5,
      def: 1.8,
      crit: 0.013
    }
  }
};
