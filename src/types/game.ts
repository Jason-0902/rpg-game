export type ClassId = 'warrior' | 'mage' | 'assassin';

export type BattlePhase =
  | 'classSelection'
  | 'battle'
  | 'reward'
  | 'shop'
  | 'event'
  | 'defeat';

export type BattleActionId = 'attack' | 'guard' | 'skill' | 'heal';

export type EquipmentSlot = 'head' | 'gloves' | 'weapon' | 'shield' | 'necklace' | 'shoes' | 'armor' | 'legs';

export type PotionTier = 'minor' | 'standard' | 'major' | 'supreme';

export type PotionInventory = Record<PotionTier, number>;

export interface StatBlock {
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  crit: number;
  level: number;
}

export interface RuntimeCombatState {
  hp: number;
  shield: number;
  critBuff: number;
  atkBuff: number;
  defBuff: number;
  isGuarding: boolean;
  turnsGuarding: number;
  skillCooldown: number;
  combo: number;
}

export interface SkillDefinition {
  id: string;
  classId: ClassId;
  name: string;
  description: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: 'common' | 'rare' | 'epic';
  level: number;
  image: string;
  price: number;
  bonuses: {
    maxHp?: number;
    atk?: number;
    def?: number;
    crit?: number;
  };
}

export interface EventCard {
  id: string;
  title: string;
  description: string;
  polarity: 'positive' | 'negative';
}

export interface RewardBundle {
  money: number;
  potionTier: PotionTier | null;
  potionCount: number;
  equipment?: EquipmentItem | null;
  skill?: SkillDefinition | null;
}

export interface Player extends StatBlock, RuntimeCombatState {
  classId: ClassId;
  exp: number;
  expToNext: number;
  gold: number;
  potions: PotionInventory;
  totalDamageDealt: number;
  totalDamageTaken: number;
  defeatedBosses: number;
  unlockedSkillIds: string[];
  activeSkillId: string;
  equipped: Record<EquipmentSlot, EquipmentItem | null>;
  inventoryEquipment: EquipmentItem[];
}

export interface Boss extends StatBlock, RuntimeCombatState {
  id: string;
  emoji: string;
  name: string;
  title: string;
  stage: number;
  portrait: string;
  enrageThreshold: number;
  enrageBonus: number;
  enraged: boolean;
  dropGold: number;
}

export interface BattleLogEntry {
  id: string;
  turn: number;
  actor: 'system' | 'player' | 'boss';
  text: string;
  type:
    | 'info'
    | 'damage'
    | 'heal'
    | 'critical'
    | 'warning'
    | 'buff'
    | 'debuff'
    | 'reward';
  timestamp: number;
}


export interface UpgradeOption {
  id: string;
  title: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic';
  icon: string;
  apply: (player: Player) => Player;
}

export interface UpgradeOptionMetadata {
  id: string;
  title: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic';
  icon: string;
}

export interface UpgradeCatalogItem {
  id: string;
  title: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic';
  icon: string;
  apply: (player: Player) => Player;
  tags: string[];
}
export interface BattleSnapshot {
  player: Player;
  boss: Boss;
  logs: BattleLogEntry[];
  turn: number;
  phase: BattlePhase;
  level: number;
  reward: RewardBundle | null;
  shopOffers: EquipmentItem[];
  travelEvent: EventCard | null;
}

export interface DamageResult {
  finalDamage: number;
  isCritical: boolean;
  rolledVariance: number;
  rawDamage: number;
  reducedByDefense: number;
}

export interface ActionOutcome {
  player: Player;
  boss: Boss;
  logs: BattleLogEntry[];
  phase: BattlePhase;
  turn: number;
}

export interface ClassTemplate {
  id: ClassId;
  name: string;
  short: string;
  description: string;
  passive: string;
  skillName: string;
  skillDescription: string;
  avatar: string;
  cardTheme: string;
  base: {
    hp: number;
    atk: number;
    def: number;
    crit: number;
  };
  growth: {
    hp: number;
    atk: number;
    def: number;
    crit: number;
  };
}

export interface BossTemplate {
  emoji: string;
  name: string;
  title: string;
  baseHp: number;
  baseAtk: number;
  baseDef: number;
  baseCrit: number;
  hpScale: number;
  atkScale: number;
  defScale: number;
  critScale: number;
  enrageThreshold: number;
  enrageBonus: number;
}

export interface PersistedGameState {
  version: number;
  updatedAt: string;
  seed: number;
  snapshot: BattleSnapshot;
}

export interface BossIntent {
  id: 'strike' | 'heavy' | 'focus' | 'drain';
  label: string;
  description: string;
}

export interface CombatNumbers {
  attackRollMin: number;
  attackRollMax: number;
  critMultiplier: number;
  guardReduction: number;
  minimumDamage: number;
}

export interface RunSummary {
  highestLevel: number;
  bossesDefeated: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
  classId: ClassId;
  completedAt: string;
}

export const STORAGE_KEYS = {
  gameState: 'rpg_boss_battle_state_v3',
  runSummary: 'rpg_boss_battle_last_run_v3'
} as const;

