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
  ],
  god: [
    { id: 'god_divine_edict', classId: 'god', name: '神裁萬象', description: '直接降下神罰，瞬滅眼前敵人。', source: 'base' },
    { id: 'god_heaven_split', classId: 'god', name: '天裂審判', description: '天界光槍貫穿萬物。', source: 'drop' },
    { id: 'god_abyss_silence', classId: 'god', name: '深淵靜滅', description: '令深淵萬象歸於寂靜。', source: 'drop' }
  ]
};

const EVOLUTION_SKILLS: Record<ClassId, SkillDefinition[]> = {
  warrior: [
    {
      id: 'warrior_colossus_wall',
      classId: 'warrior',
      name: '巨像城牆',
      description: '50 級進階技能。強化護盾並獲得反擊增傷。',
      source: 'evolution',
      evolutionRank: 1
    },
    {
      id: 'warrior_aegis_requiem',
      classId: 'warrior',
      name: '聖盾鎮魂歌',
      description: '100 級進階技能。大幅提升防禦並重擊敵人。',
      source: 'evolution',
      evolutionRank: 2
    },
    {
      id: 'warrior_titan_overlord',
      classId: 'warrior',
      name: '泰坦霸皇',
      description: '150 級進階技能。超高護盾與高倍率終結攻擊。',
      source: 'evolution',
      evolutionRank: 3
    }
  ],
  mage: [
    {
      id: 'mage_stellar_tide',
      classId: 'mage',
      name: '星潮崩落',
      description: '50 級進階技能。高倍率奧術潮汐並削弱護甲。',
      source: 'evolution',
      evolutionRank: 1
    },
    {
      id: 'mage_abyss_meteor',
      classId: 'mage',
      name: '深淵隕星',
      description: '100 級進階技能。造成巨量魔法傷害。',
      source: 'evolution',
      evolutionRank: 2
    },
    {
      id: 'mage_cosmic_judgement',
      classId: 'mage',
      name: '寰宇審判',
      description: '150 級進階技能。超高爆發並短暫壓制敵方攻擊。',
      source: 'evolution',
      evolutionRank: 3
    }
  ],
  assassin: [
    {
      id: 'assassin_lunar_ripper',
      classId: 'assassin',
      name: '月蝕裂界',
      description: '50 級進階技能。追加多段攻擊與更高爆擊倍率。',
      source: 'evolution',
      evolutionRank: 1
    },
    {
      id: 'assassin_void_execution',
      classId: 'assassin',
      name: '虛無處決',
      description: '100 級進階技能。高爆擊斬擊，終結殘血目標。',
      source: 'evolution',
      evolutionRank: 2
    },
    {
      id: 'assassin_eternal_night',
      classId: 'assassin',
      name: '永夜終幕',
      description: '150 級進階技能。多段高倍率連斬，爆擊收益極高。',
      source: 'evolution',
      evolutionRank: 3
    }
  ],
  god: []
};

const SPECIAL_EVENT_SKILLS: SkillDefinition[] = [
  { id: 'warrior_divine_luminara', classId: 'warrior', name: '曜星裁決', description: '女神祝福技：重擊並恢復護盾。', source: 'drop' },
  { id: 'warrior_astral_elysion', classId: 'warrior', name: '銀弦天罰', description: '星座祝福技：高爆發終結打擊。', source: 'drop' },
  { id: 'warrior_demon_pact', classId: 'warrior', name: '魔契血鎧', description: '惡魔契約技：護盾與傷害雙增幅。', source: 'drop' },
  { id: 'mage_divine_luminara', classId: 'mage', name: '曜星天渦', description: '女神祝福技：高倍率星光魔炮。', source: 'drop' },
  { id: 'mage_astral_elysion', classId: 'mage', name: '銀弦星河', description: '星座祝福技：多段天穹魔法。', source: 'drop' },
  { id: 'mage_demon_pact', classId: 'mage', name: '魔契深紅', description: '惡魔契約技：深紅魔炎爆發。', source: 'drop' },
  { id: 'assassin_divine_luminara', classId: 'assassin', name: '曜星幻斬', description: '女神祝福技：高速多段斬擊。', source: 'drop' },
  { id: 'assassin_astral_elysion', classId: 'assassin', name: '銀弦斷界', description: '星座祝福技：瞬連刺與處決。', source: 'drop' },
  { id: 'assassin_demon_pact', classId: 'assassin', name: '魔契夜葬', description: '惡魔契約技：禁忌連斬與高爆擊。', source: 'drop' },
  { id: 'god_divine_luminara', classId: 'god', name: '神律曙光', description: '神祇賜福後的聖光裁決。', source: 'drop' },
  { id: 'god_astral_elysion', classId: 'god', name: '星界神諭', description: '星座授權的超域審判。', source: 'drop' },
  { id: 'god_demon_pact', classId: 'god', name: '逆神魔契', description: '神與魔契合的終極禁術。', source: 'drop' }
];

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
  ],
  god: [{ rank: 0, title: '神' }]
};

const ALL_SKILLS = [...Object.values(BASE_SKILLS).flat(), ...Object.values(EVOLUTION_SKILLS).flat(), ...SPECIAL_EVENT_SKILLS];

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
