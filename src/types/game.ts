export type ClassId = 'warrior' | 'mage' | 'assassin';

export type BattlePhase =
  | 'classSelection'
  | 'battle'
  | 'upgrade'
  | 'victory'
  | 'defeat';

export type BattleActionId = 'attack' | 'guard' | 'skill' | 'heal';

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

export interface Player extends StatBlock, RuntimeCombatState {
  classId: ClassId;
  exp: number;
  expToNext: number;
  runes: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
  defeatedBosses: number;
}

export interface Boss extends StatBlock, RuntimeCombatState {
  id: string;
  emoji: string;
  name: string;
  title: string;
  stage: number;
  enrageThreshold: number;
  enrageBonus: number;
  enraged: boolean;
  dropRunes: number;
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

export interface BattleSnapshot {
  player: Player;
  boss: Boss;
  logs: BattleLogEntry[];
  turn: number;
  phase: BattlePhase;
  level: number;
}

export interface BattleContext {
  player: Player;
  boss: Boss;
  turn: number;
  rngSeed?: number;
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
  offeredUpgrades: UpgradeOptionMetadata[];
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

export interface ActionButtonConfig {
  id: BattleActionId;
  label: string;
  description: string;
  cooldownHint?: string;
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

export interface UiToast {
  id: string;
  title: string;
  message: string;
  level: 'info' | 'success' | 'warning';
}

export interface RunSummary {
  highestLevel: number;
  bossesDefeated: number;
  totalDamageDealt: number;
  totalDamageTaken: number;
  classId: ClassId;
  completedAt: string;
}

export type ActionAvailability = {
  attack: boolean;
  guard: boolean;
  skill: boolean;
  heal: boolean;
};

export const STORAGE_KEYS = {
  gameState: 'rpg_boss_battle_state_v1',
  runSummary: 'rpg_boss_battle_last_run'
} as const;

