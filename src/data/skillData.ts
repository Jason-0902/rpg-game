import { ClassId, SkillDefinition } from '../types/game';

interface EvolutionTrack {
  rank: number;
  title: string;
}

const BASE_SKILLS: Record<ClassId, SkillDefinition[]> = {
  warrior: [
    { id: 'warrior_iron_bastion', classId: 'warrior', name: '鋼鐵堡壘', description: '獲得大量護盾並提高防禦。', source: 'base' },
    { id: 'warrior_crush', classId: 'warrior', name: '破甲重擊', description: '造成高傷害並削弱敵方防禦。', source: 'drop' },
    { id: 'warrior_counter', classId: 'warrior', name: '反擊架勢', description: '本回合提升護盾，下回合追加反擊。', source: 'drop' }
  ],
  mage: [
    { id: 'mage_arcane_nova', classId: 'mage', name: '奧術新星', description: '高爆發魔法傷害，並短暫削防。', source: 'base' },
    { id: 'mage_frost_prison', classId: 'mage', name: '寒霜禁錮', description: '造成傷害並降低敵方攻擊。', source: 'drop' },
    { id: 'mage_chain_burst', classId: 'mage', name: '連鎖脈衝', description: '連續施法造成多段傷害。', source: 'drop' }
  ],
  assassin: [
    { id: 'assassin_shadow_flurry', classId: 'assassin', name: '暗影連斬', description: '多段突刺，爆擊率額外提升。', source: 'base' },
    { id: 'assassin_bleed_mark', classId: 'assassin', name: '裂傷印記', description: '附加流血與爆擊追擊。', source: 'drop' },
    { id: 'assassin_ghost_step', classId: 'assassin', name: '鬼步', description: '提升爆擊與閃避節奏。', source: 'drop' }
  ]
};

const EVOLUTION_SKILLS: Record<ClassId, SkillDefinition[]> = {
  warrior: [
    {
      id: 'warrior_colossus_wall',
      classId: 'warrior',
      name: '巨像城牆',
      description: '100 級進階技能。強化護盾並獲得反擊增傷。',
      source: 'evolution',
      evolutionRank: 1
    },
    {
      id: 'warrior_aegis_requiem',
      classId: 'warrior',
      name: '聖盾鎮魂歌',
      description: '200 級進階技能。大幅提升防禦並重擊敵人。',
      source: 'evolution',
      evolutionRank: 2
    },
    {
      id: 'warrior_titan_overlord',
      classId: 'warrior',
      name: '泰坦霸皇',
      description: '300 級進階技能。超高護盾與高倍率終結攻擊。',
      source: 'evolution',
      evolutionRank: 3
    }
  ],
  mage: [
    {
      id: 'mage_stellar_tide',
      classId: 'mage',
      name: '星潮崩落',
      description: '100 級進階技能。高倍率奧術潮汐並削弱護甲。',
      source: 'evolution',
      evolutionRank: 1
    },
    {
      id: 'mage_abyss_meteor',
      classId: 'mage',
      name: '深淵隕星',
      description: '200 級進階技能。造成巨量魔法傷害。',
      source: 'evolution',
      evolutionRank: 2
    },
    {
      id: 'mage_cosmic_judgement',
      classId: 'mage',
      name: '寰宇審判',
      description: '300 級進階技能。超高爆發並短暫壓制敵方攻擊。',
      source: 'evolution',
      evolutionRank: 3
    }
  ],
  assassin: [
    {
      id: 'assassin_lunar_ripper',
      classId: 'assassin',
      name: '月蝕裂界',
      description: '100 級進階技能。追加多段攻擊與更高爆擊倍率。',
      source: 'evolution',
      evolutionRank: 1
    },
    {
      id: 'assassin_void_execution',
      classId: 'assassin',
      name: '虛無處決',
      description: '200 級進階技能。高爆擊斬擊，終結殘血目標。',
      source: 'evolution',
      evolutionRank: 2
    },
    {
      id: 'assassin_eternal_night',
      classId: 'assassin',
      name: '永夜終幕',
      description: '300 級進階技能。多段高倍率連斬，爆擊收益極高。',
      source: 'evolution',
      evolutionRank: 3
    }
  ]
};

const EVOLUTION_TITLES: Record<ClassId, EvolutionTrack[]> = {
  warrior: [
    { rank: 0, title: '戰士' },
    { rank: 1, title: '聖殿守衛' },
    { rank: 2, title: '蒼穹戰將' },
    { rank: 3, title: '不滅泰坦' },
    { rank: 4, title: '神域戰神' }
  ],
  mage: [
    { rank: 0, title: '法師' },
    { rank: 1, title: '星辰術士' },
    { rank: 2, title: '虛空賢者' },
    { rank: 3, title: '天穹魔導王' },
    { rank: 4, title: '根源大法神' }
  ],
  assassin: [
    { rank: 0, title: '刺客' },
    { rank: 1, title: '影刃行者' },
    { rank: 2, title: '夜幕裁決者' },
    { rank: 3, title: '深淵終結者' },
    { rank: 4, title: '永夜冥皇' }
  ]
};

const ALL_SKILLS = [...Object.values(BASE_SKILLS).flat(), ...Object.values(EVOLUTION_SKILLS).flat()];

export const getBaseSkillId = (classId: ClassId): string => BASE_SKILLS[classId][0].id;

export const getSkillById = (id: string): SkillDefinition | null => {
  return ALL_SKILLS.find((s) => s.id === id) ?? null;
};

export const getAllClassSkills = (classId: ClassId): SkillDefinition[] => {
  return [...BASE_SKILLS[classId], ...EVOLUTION_SKILLS[classId]];
};

export const getClassTitleByRank = (classId: ClassId, rank: number): string => {
  const track = EVOLUTION_TITLES[classId];
  const capped = Math.max(0, Math.min(rank, track.length - 1));
  return track[capped].title;
};

export const getEvolutionSkillForRank = (classId: ClassId, rank: number): SkillDefinition | null => {
  return EVOLUTION_SKILLS[classId].find((s) => s.evolutionRank === rank) ?? null;
};

export const rollSkillDrop = (classId: ClassId, owned: string[]): SkillDefinition | null => {
  const pool = BASE_SKILLS[classId].filter((s) => s.source === 'drop' && !owned.includes(s.id));
  if (pool.length === 0) return null;
  if (Math.random() > 0.35) return null;
  return pool[Math.floor(Math.random() * pool.length)];
};

