import { ClassId, SkillDefinition } from '../types/game';

export const CLASS_SKILLS: Record<ClassId, SkillDefinition[]> = {
  warrior: [
    { id: 'warrior_iron_bastion', classId: 'warrior', name: '鋼鐵堡壘', description: '高護盾與防禦強化。' },
    { id: 'warrior_crush', classId: 'warrior', name: '破甲重擊', description: '額外造成傷害並削弱首領防禦。' },
    { id: 'warrior_counter', classId: 'warrior', name: '反擊架勢', description: '施放後獲得額外護盾與反擊傷害。' }
  ],
  mage: [
    { id: 'mage_arcane_nova', classId: 'mage', name: '奧術新星', description: '高爆發並削弱護甲。' },
    { id: 'mage_frost_prison', classId: 'mage', name: '寒霜禁錮', description: '降低敵方攻擊並造成傷害。' },
    { id: 'mage_chain_burst', classId: 'mage', name: '連鎖脈衝', description: '追加多段奧術傷害。' }
  ],
  assassin: [
    { id: 'assassin_shadow_flurry', classId: 'assassin', name: '暗影連斬', description: '多段突刺，容易爆擊。' },
    { id: 'assassin_bleed_mark', classId: 'assassin', name: '裂傷印記', description: '追加流血傷害。' },
    { id: 'assassin_ghost_step', classId: 'assassin', name: '鬼步', description: '提升爆擊與迴避節奏。' }
  ]
};

export const getBaseSkillId = (classId: ClassId): string => CLASS_SKILLS[classId][0].id;

export const getSkillById = (id: string): SkillDefinition | null => {
  const all = Object.values(CLASS_SKILLS).flat();
  return all.find((s) => s.id === id) ?? null;
};

export const rollSkillDrop = (classId: ClassId, owned: string[]): SkillDefinition | null => {
  const pool = CLASS_SKILLS[classId].filter((s) => !owned.includes(s.id));
  if (pool.length === 0) return null;
  if (Math.random() > 0.38) return null;
  return pool[Math.floor(Math.random() * pool.length)];
};
