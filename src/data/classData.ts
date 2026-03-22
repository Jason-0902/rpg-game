import { ClassTemplate } from '../types/game';

export const CLASS_TEMPLATES: Record<ClassTemplate['id'], ClassTemplate> = {
  warrior: {
    id: 'warrior',
    name: 'Warrior',
    short: 'WR',
    description: '前線坦克，血量與防禦最高，能在長期戰鬥中穩定輸出。',
    passive: '守護本能：防禦生效倍率提高。',
    skillName: 'Iron Bastion',
    skillDescription: '獲得高額護盾，下一次受到傷害額外降低。',
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
    name: 'Mage',
    short: 'MG',
    description: '法術爆發職業，攻擊與技能倍率極高但防禦薄弱。',
    passive: '元素精通：爆擊時追加法術殘響。',
    skillName: 'Arcane Nova',
    skillDescription: '對 Boss 造成高傷害並短暫降低其防禦。',
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
    name: 'Assassin',
    short: 'AS',
    description: '高速斬殺，爆擊率高，透過連擊與瞬間爆發收頭。',
    passive: '致命節奏：連續攻擊會提升爆擊率。',
    skillName: 'Shadow Flurry',
    skillDescription: '連續刺擊，會根據爆擊率獲得額外段數。',
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
