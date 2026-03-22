import { generateEquipmentImage } from '../logic/imageGen';
import { EquipmentItem, EquipmentSlot } from '../types/game';

const slotNames: Record<EquipmentSlot, string> = {
  head: '頭盔',
  gloves: '手套',
  weapon: '武器',
  shield: '盾牌',
  necklace: '項鍊',
  shoes: '鞋子',
  armor: '衣服',
  legs: '護腿'
};

const randomFrom = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const rollLevelByStage = (stage: number) => {
  const base = Math.max(1, Math.floor(stage / 4));
  const spread = Math.max(1, Math.floor(stage / 10) + 1);
  return base + Math.floor(Math.random() * spread);
};

const rollRarity = (stage: number): EquipmentItem['rarity'] => {
  const r = Math.random();
  const epicGate = 0.03 + Math.min(0.27, stage * 0.0035);
  const rareGate = 0.28 + Math.min(0.42, stage * 0.0045);
  if (r < epicGate) return 'epic';
  if (r < rareGate) return 'rare';
  return 'common';
};

export const createRandomEquipment = (stage: number): EquipmentItem => {
  const slots: EquipmentSlot[] = ['head', 'gloves', 'weapon', 'shield', 'necklace', 'shoes', 'armor', 'legs'];
  const slot = randomFrom(slots);
  const level = rollLevelByStage(stage);
  const rarity = rollRarity(stage);
  const rarityMult = rarity === 'epic' ? 2.2 : rarity === 'rare' ? 1.55 : 1;
  const growth = 1 + level * 0.2;

  const id = `eq-${slot}-${stage}-${Math.random().toString(36).slice(2, 8)}`;

  const item: EquipmentItem = {
    id,
    slot,
    level,
    rarity,
    image: generateEquipmentImage(slot, level, rarity),
    name: `${slotNames[slot]}・Lv${level}`,
    price: Math.round((20 + level * 8 + stage * 2) * rarityMult),
    bonuses: {}
  };

  if (slot === 'weapon') item.bonuses.atk = Math.round((8 + level * 2.2) * rarityMult);
  if (slot === 'shield') item.bonuses.def = Math.round((10 + level * 2.8) * rarityMult);
  if (slot === 'head' || slot === 'armor' || slot === 'legs') item.bonuses.maxHp = Math.round((24 + level * 8) * rarityMult);
  if (slot === 'gloves' || slot === 'necklace') {
    item.bonuses.crit = Number((0.01 * growth * rarityMult).toFixed(3));
    item.bonuses.atk = Math.round((4 + level * 1.4) * rarityMult);
  }
  if (slot === 'shoes') {
    item.bonuses.def = Math.round((5 + level * 1.8) * rarityMult);
    item.bonuses.crit = Number((0.006 * growth * rarityMult).toFixed(3));
  }

  return item;
};

export const createShopOffers = (stage: number): EquipmentItem[] => [
  createRandomEquipment(stage),
  createRandomEquipment(stage + 1),
  createRandomEquipment(stage + 2)
];
