import { EquipmentItem, EquipmentSlot } from '../types/game';

const slotNames: Record<EquipmentSlot, string> = {
  head: '頭',
  gloves: '手套',
  weapon: '武器',
  shield: '盾牌',
  necklace: '項鍊',
  shoes: '鞋子',
  armor: '衣服',
  legs: '腿'
};

const randomFrom = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const bonus = (stage: number) => {
  const base = Math.max(1, Math.floor(stage / 5));
  return {
    hp: 8 + base * 4,
    atk: 2 + Math.floor(base / 2),
    def: 2 + Math.floor(base / 2),
    crit: 0.01 + base * 0.003
  };
};

export const createRandomEquipment = (stage: number): EquipmentItem => {
  const slots: EquipmentSlot[] = ['head', 'gloves', 'weapon', 'shield', 'necklace', 'shoes', 'armor', 'legs'];
  const slot = randomFrom(slots);
  const b = bonus(stage);
  const rarityRoll = Math.random();
  const rarity = rarityRoll > 0.9 ? 'epic' : rarityRoll > 0.62 ? 'rare' : 'common';
  const mult = rarity === 'epic' ? 2 : rarity === 'rare' ? 1.45 : 1;
  const id = `eq-${slot}-${stage}-${Math.random().toString(36).slice(2, 7)}`;

  const item: EquipmentItem = {
    id,
    slot,
    rarity,
    name: `${slotNames[slot]}・${rarity === 'epic' ? '傳說' : rarity === 'rare' ? '精鍊' : '旅者'}`,
    price: Math.round((25 + stage * 4) * mult),
    bonuses: {}
  };

  if (slot === 'weapon') item.bonuses.atk = Math.round(b.atk * mult + 2);
  if (slot === 'shield') item.bonuses.def = Math.round(b.def * mult + 2);
  if (slot === 'head' || slot === 'armor' || slot === 'legs') item.bonuses.maxHp = Math.round(b.hp * mult);
  if (slot === 'gloves' || slot === 'necklace') {
    item.bonuses.crit = Number((b.crit * mult).toFixed(3));
    item.bonuses.atk = Math.round((b.atk * 0.7) * mult);
  }
  if (slot === 'shoes') {
    item.bonuses.def = Math.round((b.def * 0.65) * mult);
    item.bonuses.crit = Number((b.crit * 0.6 * mult).toFixed(3));
  }

  return item;
};

export const createShopOffers = (stage: number): EquipmentItem[] => [
  createRandomEquipment(stage),
  createRandomEquipment(stage + 1),
  createRandomEquipment(stage + 2)
];
