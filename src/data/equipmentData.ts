import { generateEquipmentImage } from '../logic/imageGen';
import { EquipmentItem, EquipmentRarity, EquipmentSlot } from '../types/game';

const slotNames: Record<EquipmentSlot, string> = {
  head: '頭盔',
  gloves: '手套',
  weapon: '武器',
  shield: '盾牌',
  necklace: '項鍊',
  shoes: '鞋子',
  armor: '護甲',
  legs: '腿甲'
};

const rarityZh: Record<EquipmentRarity, string> = {
  normal: '一般',
  fine: '精良',
  advanced: '高等',
  legendary: '傳說',
  mythic: '神話'
};

const rarityMultiplier: Record<EquipmentRarity, number> = {
  normal: 1,
  fine: 1.28,
  advanced: 1.72,
  legendary: 2.35,
  mythic: 3.25
};

const rarityOrder: EquipmentRarity[] = ['normal', 'fine', 'advanced', 'legendary', 'mythic'];

const weaponNamePool: Record<EquipmentRarity, string[]> = {
  normal: ['鐵風直刃', '獵狼短刀', '赤紋戰槍', '霜鋼手斧', '荒原重劍'],
  fine: ['蒼雷裂牙', '影鴉穿雲', '寒星斷岳', '風嵐斬夜', '白焰逐日'],
  advanced: ['黑曜天誓', '星塵審判', '燼羽龍嘯', '渦雷魔槍', '月魄天裁'],
  legendary: ['滅界神鋒', '寂滅蒼穹', '深淵王權', '曜炎天命', '幽煌聖戟'],
  mythic: ['終焉天啟', '虛空神臨', '無限審判者', '星海主宰之刃', '永夜創世槍']
};

const randomFrom = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const rollLevelByStage = (stage: number) => {
  const base = Math.max(1, Math.floor(stage * 0.42));
  const spread = Math.max(2, Math.floor(stage * 0.15));
  return base + Math.floor(Math.random() * spread);
};

const stageRarityWeights = (stage: number): Record<EquipmentRarity, number> => {
  const progress = Math.min(1.5, stage / 220);
  const normal = Math.max(0.08, 0.58 - progress * 0.35);
  const fine = Math.max(0.12, 0.28 + progress * 0.08);
  const advanced = 0.1 + progress * 0.18;
  const legendary = Math.max(0.02, -0.02 + progress * 0.16);
  const mythic = Math.max(0.01, -0.03 + progress * 0.12);

  return { normal, fine, advanced, legendary, mythic };
};

const rollRarity = (stage: number): EquipmentRarity => {
  const weights = stageRarityWeights(stage);
  const total = Object.values(weights).reduce((sum, n) => sum + n, 0);
  let ticket = Math.random() * total;

  for (const rarity of rarityOrder) {
    ticket -= weights[rarity];
    if (ticket <= 0) return rarity;
  }

  return 'normal';
};

const createItemName = (slot: EquipmentSlot, rarity: EquipmentRarity, level: number): string => {
  if (slot === 'weapon') {
    return `${rarityZh[rarity]}?${randomFrom(weaponNamePool[rarity])} Lv.${level}`;
  }

  return `${rarityZh[rarity]}?${slotNames[slot]} Lv.${level}`;
};

export const createRandomEquipment = (stage: number): EquipmentItem => {
  const slots: EquipmentSlot[] = ['head', 'gloves', 'weapon', 'shield', 'necklace', 'shoes', 'armor', 'legs'];
  const slot = randomFrom(slots);
  const level = rollLevelByStage(stage);
  const rarity = rollRarity(stage);
  const rarityMult = rarityMultiplier[rarity];

  const id = `eq-${slot}-${stage}-${Math.random().toString(36).slice(2, 8)}`;
  const item: EquipmentItem = {
    id,
    slot,
    level,
    rarity,
    image: generateEquipmentImage(slot, level, rarity),
    name: createItemName(slot, rarity, level),
    price: Math.round((45 + stage * 5 + level * 7) * rarityMult),
    bonuses: {}
  };

  if (slot === 'weapon') item.bonuses.atk = Math.round((12 + level * 2.8) * rarityMult);
  if (slot === 'shield') item.bonuses.def = Math.round((10 + level * 2.6) * rarityMult);
  if (slot === 'head' || slot === 'armor' || slot === 'legs') item.bonuses.maxHp = Math.round((40 + level * 9.2) * rarityMult);
  if (slot === 'gloves' || slot === 'necklace') {
    item.bonuses.crit = Number((0.012 + level * 0.0007 * rarityMult).toFixed(3));
    item.bonuses.atk = Math.round((6 + level * 1.8) * rarityMult);
  }
  if (slot === 'shoes') {
    item.bonuses.def = Math.round((7 + level * 1.6) * rarityMult);
    item.bonuses.crit = Number((0.008 + level * 0.0005 * rarityMult).toFixed(3));
  }

  return item;
};

export const createShopOffers = (stage: number): EquipmentItem[] => {
  return [createRandomEquipment(stage), createRandomEquipment(stage + 2), createRandomEquipment(stage + 4)];
};

