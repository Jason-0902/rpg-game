import { CLASS_TEMPLATES } from '../data/classData';
import { getBaseSkillId, getClassTitleByRank } from '../data/skillData';
import { generateMonsterPortrait } from './imageGen';
import {
  ActionOutcome,
  Alignment,
  BattleActionId,
  BattleLogEntry,
  Boss,
  BossIntent,
  ClassId,
  CombatNumbers,
  DamageResult,
  EquipmentItem,
  EquipmentSlot,
  Player,
  PotionTier
} from '../types/game';

const COMBAT_NUMBERS: CombatNumbers = {
  attackRollMin: 0.9,
  attackRollMax: 1.14,
  critMultiplier: 1.75,
  guardReduction: 0.45,
  minimumDamage: 1
};

interface EnemyTemplate {
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

const NEWBIE_MONSTERS: EnemyTemplate[] = [
  {
    emoji: '??',
    name: '綠史萊姆',
    title: '新手村黏液怪',
    baseHp: 26,
    baseAtk: 9,
    baseDef: 3,
    baseCrit: 0.06,
    hpScale: 0.4,
    atkScale: 0.3,
    defScale: 0.1,
    critScale: 0.0004,
    enrageThreshold: 0.28,
    enrageBonus: 0.08
  },
  {
    emoji: '???',
    name: '洞窟哥布林',
    title: '新手村掠奪者',
    baseHp: 34,
    baseAtk: 11,
    baseDef: 4,
    baseCrit: 0.08,
    hpScale: 0.45,
    atkScale: 0.34,
    defScale: 0.13,
    critScale: 0.0005,
    enrageThreshold: 0.34,
    enrageBonus: 0.1
  },
  {
    emoji: '??',
    name: '荒野幼狼',
    title: '新手村野獸',
    baseHp: 30,
    baseAtk: 12,
    baseDef: 3,
    baseCrit: 0.09,
    hpScale: 0.42,
    atkScale: 0.35,
    defScale: 0.1,
    critScale: 0.0005,
    enrageThreshold: 0.36,
    enrageBonus: 0.12
  },
  {
    emoji: '??',
    name: '暗穴蝙蝠',
    title: '新手村低階魔物',
    baseHp: 24,
    baseAtk: 13,
    baseDef: 2,
    baseCrit: 0.1,
    hpScale: 0.35,
    atkScale: 0.36,
    defScale: 0.09,
    critScale: 0.0006,
    enrageThreshold: 0.3,
    enrageBonus: 0.1
  }
];

const MID_MONSTERS: EnemyTemplate[] = [
  {
    emoji: '??',
    name: '熔爪惡狼',
    title: '火山獵殺者',
    baseHp: 120,
    baseAtk: 22,
    baseDef: 8,
    baseCrit: 0.11,
    hpScale: 15,
    atkScale: 3.4,
    defScale: 1.2,
    critScale: 0.0032,
    enrageThreshold: 0.42,
    enrageBonus: 0.2
  },
  {
    emoji: '??',
    name: '墓地怨骸',
    title: '亡靈監工',
    baseHp: 136,
    baseAtk: 20,
    baseDef: 9,
    baseCrit: 0.1,
    hpScale: 16,
    atkScale: 3.1,
    defScale: 1.5,
    critScale: 0.003,
    enrageThreshold: 0.37,
    enrageBonus: 0.22
  },
  {
    emoji: '?',
    name: '雷鳴守衛',
    title: '失控機械',
    baseHp: 144,
    baseAtk: 21,
    baseDef: 10,
    baseCrit: 0.1,
    hpScale: 17,
    atkScale: 3.2,
    defScale: 1.5,
    critScale: 0.0028,
    enrageThreshold: 0.4,
    enrageBonus: 0.2
  },
  {
    emoji: '??',
    name: '夜蝕祭司',
    title: '黑月信徒',
    baseHp: 130,
    baseAtk: 23,
    baseDef: 7,
    baseCrit: 0.13,
    hpScale: 15,
    atkScale: 3.5,
    defScale: 1.15,
    critScale: 0.0034,
    enrageThreshold: 0.45,
    enrageBonus: 0.24
  }
];

const ABYSS_MONSTERS: EnemyTemplate[] = [
  {
    emoji: '???',
    name: '深淵噬魂者',
    title: '裂界吞噬種',
    baseHp: 280,
    baseAtk: 56,
    baseDef: 24,
    baseCrit: 0.2,
    hpScale: 32,
    atkScale: 6,
    defScale: 2.8,
    critScale: 0.006,
    enrageThreshold: 0.5,
    enrageBonus: 0.34
  },
  {
    emoji: '???',
    name: '虛空監視者',
    title: '深淵眼眸',
    baseHp: 300,
    baseAtk: 53,
    baseDef: 28,
    baseCrit: 0.18,
    hpScale: 34,
    atkScale: 5.8,
    defScale: 3,
    critScale: 0.0056,
    enrageThreshold: 0.46,
    enrageBonus: 0.32
  },
  {
    emoji: '??',
    name: '猩紅判官',
    title: '深淵執刑者',
    baseHp: 268,
    baseAtk: 61,
    baseDef: 23,
    baseCrit: 0.22,
    hpScale: 31,
    atkScale: 6.2,
    defScale: 2.6,
    critScale: 0.0064,
    enrageThreshold: 0.48,
    enrageBonus: 0.36
  }
];

const HEAVEN_MONSTERS: EnemyTemplate[] = [
  {
    emoji: '??',
    name: '天穹審判者',
    title: '天界刑律官',
    baseHp: 420,
    baseAtk: 78,
    baseDef: 34,
    baseCrit: 0.25,
    hpScale: 42,
    atkScale: 7.4,
    defScale: 3.5,
    critScale: 0.0068,
    enrageThreshold: 0.5,
    enrageBonus: 0.38
  },
  {
    emoji: '??',
    name: '聖曜羽騎',
    title: '天界巡狩者',
    baseHp: 400,
    baseAtk: 82,
    baseDef: 30,
    baseCrit: 0.28,
    hpScale: 40,
    atkScale: 7.8,
    defScale: 3.2,
    critScale: 0.0072,
    enrageThreshold: 0.52,
    enrageBonus: 0.4
  },
  {
    emoji: '??',
    name: '星環主教',
    title: '天界占星官',
    baseHp: 450,
    baseAtk: 74,
    baseDef: 36,
    baseCrit: 0.26,
    hpScale: 44,
    atkScale: 7,
    defScale: 3.7,
    critScale: 0.0066,
    enrageThreshold: 0.47,
    enrageBonus: 0.38
  }
];

const HUMAN_ENEMIES: EnemyTemplate[] = [
  {
    emoji: '???',
    name: '羅因聖堂騎士',
    title: '王都防衛軍',
    baseHp: 210,
    baseAtk: 44,
    baseDef: 24,
    baseCrit: 0.16,
    hpScale: 24,
    atkScale: 4.6,
    defScale: 2.4,
    critScale: 0.0046,
    enrageThreshold: 0.4,
    enrageBonus: 0.25
  },
  {
    emoji: '??',
    name: '薇爾聖劍使',
    title: '聖殿討伐者',
    baseHp: 190,
    baseAtk: 52,
    baseDef: 18,
    baseCrit: 0.18,
    hpScale: 23,
    atkScale: 5,
    defScale: 2,
    critScale: 0.0048,
    enrageThreshold: 0.46,
    enrageBonus: 0.28
  },
  {
    emoji: '?',
    name: '希爾維亞聖女',
    title: '神恩行者',
    baseHp: 198,
    baseAtk: 48,
    baseDef: 20,
    baseCrit: 0.2,
    hpScale: 25,
    atkScale: 4.8,
    defScale: 2.2,
    critScale: 0.005,
    enrageThreshold: 0.44,
    enrageBonus: 0.29
  },
  {
    emoji: '???',
    name: '艾德里克勇者',
    title: '冠位討魔者',
    baseHp: 220,
    baseAtk: 56,
    baseDef: 22,
    baseCrit: 0.2,
    hpScale: 27,
    atkScale: 5.2,
    defScale: 2.3,
    critScale: 0.0052,
    enrageThreshold: 0.48,
    enrageBonus: 0.3
  }
];

const rng = () => Math.random();
const rollInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const emptyEquipment = (): Record<EquipmentSlot, EquipmentItem | null> => ({
  head: null,
  gloves: null,
  weapon: null,
  shield: null,
  necklace: null,
  shoes: null,
  armor: null,
  legs: null
});

const getMonsterPoolByLevel = (level: number): EnemyTemplate[] => {
  if (level <= 50) return NEWBIE_MONSTERS;
  if (level > 1000) return HEAVEN_MONSTERS;
  if (level > 500) return ABYSS_MONSTERS;

  if (level > 350) return [...MID_MONSTERS, ...ABYSS_MONSTERS];
  if (level > 150) return [...MID_MONSTERS, ...NEWBIE_MONSTERS];
  return MID_MONSTERS;
};

const pickEnemyTemplate = (level: number, alignment: Alignment): { template: EnemyTemplate; faction: Boss['faction'] } => {
  if (alignment === 'demon') {
    return {
      template: HUMAN_ENEMIES[rollInt(0, HUMAN_ENEMIES.length - 1)],
      faction: 'human'
    };
  }

  const pool = getMonsterPoolByLevel(level);
  return {
    template: pool[rollInt(0, pool.length - 1)],
    faction: 'monster'
  };
};

export const createLog = (
  actor: BattleLogEntry['actor'],
  text: string,
  type: BattleLogEntry['type'],
  turn: number
): BattleLogEntry => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  actor,
  text,
  type,
  turn,
  timestamp: Date.now()
});

export const getBestPotionTier = (player: Player): PotionTier | null => {
  if (player.potions.supreme > 0) return 'supreme';
  if (player.potions.major > 0) return 'major';
  if (player.potions.standard > 0) return 'standard';
  if (player.potions.minor > 0) return 'minor';
  return null;
};

export const getDebuffedStats = (player: Player) => {
  if (!player.temporaryDebuff) {
    return { atk: player.atk, def: player.def, crit: player.crit };
  }

  return {
    atk: Math.max(1, player.atk - player.temporaryDebuff.atkPenalty),
    def: Math.max(0, player.def - player.temporaryDebuff.defPenalty),
    crit: Math.max(0.01, player.crit - player.temporaryDebuff.critPenalty)
  };
};

export const createPlayerFromClass = (classId: ClassId): Player => {
  const template = CLASS_TEMPLATES[classId];
  const baseSkill = getBaseSkillId(classId);

  return {
    classId,
    classRank: 0,
    classTitle: getClassTitleByRank(classId, 0),
    hp: template.base.hp,
    maxHp: template.base.hp,
    atk: template.base.atk,
    def: template.base.def,
    crit: template.base.crit,
    level: 1,
    shield: 0,
    critBuff: 0,
    atkBuff: 0,
    defBuff: 0,
    isGuarding: false,
    turnsGuarding: 0,
    skillCooldown: 0,
    combo: 0,
    exp: 0,
    expToNext: 100,
    gold: 0,
    potions: {
      minor: 2,
      standard: 1,
      major: 0,
      supreme: 0
    },
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    defeatedBosses: 0,
    unlockedSkillIds: [baseSkill],
    activeSkillId: baseSkill,
    equipped: emptyEquipment(),
    inventoryEquipment: [],
    alignment: 'human',
    temporaryDebuff: null
  };
};

const calcBossScale = (level: number, isBoss: boolean) => {
  const chapter = Math.max(1, Math.floor(level / 50));
  const normalScale = 1 + (level - 1) * 0.088;

  if (!isBoss) return normalScale;

  const modeBonus = level > 1000 ? 1.55 : level > 500 ? 1.32 : 1;
  return normalScale * (1.72 + chapter * 0.16) * modeBonus;
};

export const createBossForLevel = (level: number, alignment: Alignment = 'human'): Boss => {
  const isBoss = level % 50 === 0;
  const { template, faction } = pickEnemyTemplate(level, alignment);
  const scale = calcBossScale(level, isBoss);

  let maxHp = Math.round((template.baseHp + template.hpScale * (level - 1)) * scale);
  let atk = Math.round((template.baseAtk + template.atkScale * (level - 1)) * (0.86 + scale * 0.08));

  if (!isBoss && level <= 50) {
    maxHp = Math.min(maxHp, 50);
    atk = Math.min(atk, 50);
  }

  const def = Math.round((template.baseDef + template.defScale * (level - 1)) * (0.84 + scale * 0.06));
  const crit = clamp(template.baseCrit + template.critScale * (level - 1), 0.04, 2.6);
  const chapter = Math.max(1, Math.floor(level / 50));

  const modeTag = level > 1000 ? '天界' : level > 500 ? '深淵' : '地表';
  const bossPrefix = faction === 'human' ? '討伐隊長' : '領主型';

  return {
    id: `boss-${level}-${Math.random().toString(36).slice(2, 8)}`,
    emoji: isBoss ? (faction === 'human' ? '??' : '??') : template.emoji,
    name: isBoss ? `${template.name}?${bossPrefix}` : template.name,
    title: isBoss ? `${modeTag}第 ${chapter} 章首領` : template.title,
    stage: level,
    isBoss,
    portrait: generateMonsterPortrait(template.name, isBoss ? (faction === 'human' ? '??' : '??') : template.emoji, level),
    hp: maxHp,
    maxHp,
    atk,
    def,
    crit,
    level,
    shield: 0,
    critBuff: 0,
    atkBuff: 0,
    defBuff: 0,
    isGuarding: false,
    turnsGuarding: 0,
    skillCooldown: 0,
    combo: 0,
    enrageThreshold: isBoss ? Math.max(0.42, template.enrageThreshold) : template.enrageThreshold,
    enrageBonus: isBoss ? template.enrageBonus + 0.18 : template.enrageBonus,
    enraged: false,
    dropGold: Math.round((38 + level * 9 + rollInt(0, 18)) * (isBoss ? 2.6 : 1)),
    faction
  };
};

export const calculateDamage = (
  attackerAtk: number,
  defenderDef: number,
  critChance: number,
  bonusMultiplier = 1
): DamageResult => {
  const rolledVariance = COMBAT_NUMBERS.attackRollMin + rng() * (COMBAT_NUMBERS.attackRollMax - COMBAT_NUMBERS.attackRollMin);
  const rawDamage = attackerAtk * rolledVariance * bonusMultiplier;
  const reducedByDefense = defenderDef * (0.64 + rng() * 0.22);
  let finalDamage = Math.max(COMBAT_NUMBERS.minimumDamage, Math.round(rawDamage - reducedByDefense));

  const chanceToCrit = clamp(critChance, 0, 1);
  const isCritical = rng() <= chanceToCrit;

  if (isCritical) {
    const overflowCritMult = critChance > 1 ? critChance : 1;
    finalDamage = Math.round(finalDamage * COMBAT_NUMBERS.critMultiplier * overflowCritMult);
  }

  return {
    finalDamage,
    isCritical,
    rolledVariance,
    rawDamage,
    reducedByDefense
  };
};

const applyShieldedDamage = (targetHp: number, shield: number, incomingDamage: number) => {
  const shieldDamage = Math.min(shield, incomingDamage);
  const remainingDamage = incomingDamage - shieldDamage;
  const nextHp = Math.max(0, targetHp - remainingDamage);
  const nextShield = Math.max(0, shield - shieldDamage);

  return {
    nextHp,
    nextShield,
    appliedDamage: remainingDamage,
    blockedByShield: shieldDamage
  };
};

const applyEndTurnDecay = <T extends Player | Boss>(entity: T): T => {
  const next = { ...entity };
  next.isGuarding = false;
  next.turnsGuarding = 0;
  next.critBuff = Math.max(0, next.critBuff - 0.03);
  next.atkBuff = Math.max(0, next.atkBuff - 1);
  next.defBuff = Math.max(0, next.defBuff - 1);
  if (next.skillCooldown > 0) next.skillCooldown -= 1;
  return next;
};

const tickTemporaryDebuff = (player: Player, logs: BattleLogEntry[], turn: number): Player => {
  if (!player.temporaryDebuff) return player;

  const remainingTurns = player.temporaryDebuff.remainingTurns - 1;
  if (remainingTurns <= 0) {
    logs.push(createLog('system', `負面效果「${player.temporaryDebuff.name}」已失效。`, 'info', turn));
    return { ...player, temporaryDebuff: null };
  }

  return {
    ...player,
    temporaryDebuff: {
      ...player.temporaryDebuff,
      remainingTurns
    }
  };
};

const resolveBossEnrage = (boss: Boss, logs: BattleLogEntry[], turn: number): Boss => {
  if (boss.enraged) return boss;
  if (boss.hp <= boss.maxHp * boss.enrageThreshold) {
    const enragedBoss = {
      ...boss,
      enraged: true,
      atkBuff: boss.atkBuff + Math.round(boss.atk * boss.enrageBonus * 0.35),
      critBuff: boss.critBuff + boss.enrageBonus * 0.4
    };
    logs.push(createLog('system', `${boss.emoji} ${boss.name} 進入狂暴狀態！`, 'warning', turn));
    return enragedBoss;
  }
  return boss;
};

export const getBossIntent = (boss: Boss, turn: number): BossIntent => {
  const hpRatio = boss.hp / boss.maxHp;

  if (hpRatio < 0.35 && turn % 3 === 0) {
    return { id: 'drain', label: '靈魂汲取', description: '吸取生命並回復血量' };
  }
  if (boss.enraged && turn % 2 === 0) {
    return { id: 'heavy', label: '毀滅重砸', description: '高倍率重擊' };
  }
  if (turn % 4 === 0) {
    return { id: 'focus', label: '黑暗蓄力', description: '提升下回合爆擊與攻擊' };
  }
  return { id: 'strike', label: '兇暴打擊', description: '一般攻擊' };
};

const handlePlayerAttack = (player: Player, boss: Boss, turn: number): ActionOutcome => {
  const stats = getDebuffedStats(player);
  const nextPlayer = { ...player, combo: player.combo + 1, isGuarding: false };
  const critBonus = nextPlayer.classId === 'assassin' ? Math.min(0.25, nextPlayer.combo * 0.02) : 0;

  const dmg = calculateDamage(stats.atk + nextPlayer.atkBuff, boss.def + boss.defBuff, stats.crit + nextPlayer.critBuff + critBonus);

  const shieldResult = applyShieldedDamage(boss.hp, boss.shield, dmg.finalDamage);
  const nextBoss = { ...boss, hp: shieldResult.nextHp, shield: shieldResult.nextShield };

  const logs: BattleLogEntry[] = [];
  logs.push(
    createLog(
      'player',
      dmg.isCritical ? `爆擊！你造成 ${shieldResult.appliedDamage} 點傷害。` : `你造成 ${shieldResult.appliedDamage} 點傷害。`,
      dmg.isCritical ? 'critical' : 'damage',
      turn
    )
  );

  if (shieldResult.blockedByShield > 0) {
    logs.push(createLog('system', `怪物護盾抵擋了 ${shieldResult.blockedByShield} 點傷害。`, 'info', turn));
  }

  return {
    player: { ...nextPlayer, totalDamageDealt: nextPlayer.totalDamageDealt + shieldResult.appliedDamage },
    boss: nextBoss,
    logs,
    phase: nextBoss.hp <= 0 ? 'reward' : 'battle',
    turn
  };
};

const handlePlayerGuard = (player: Player, boss: Boss, turn: number): ActionOutcome => {
  const stats = getDebuffedStats(player);
  const shieldGain = Math.round(stats.def * (player.classId === 'warrior' ? 1.65 : 1.15) + 10);
  const nextPlayer = {
    ...player,
    isGuarding: true,
    turnsGuarding: 1,
    shield: player.shield + shieldGain,
    combo: 0
  };

  return {
    player: nextPlayer,
    boss,
    logs: [createLog('player', `你進入防禦姿態，獲得 ${shieldGain} 點護盾。`, 'buff', turn)],
    phase: 'battle',
    turn
  };
};

const consumePotionAndHeal = (player: Player): { player: Player; healed: number; tier: PotionTier | null } => {
  const tier = getBestPotionTier(player);
  if (!tier) return { player, healed: 0, tier: null };

  let heal = 0;
  if (tier === 'minor') heal = Math.round(player.maxHp * 0.25);
  if (tier === 'standard') heal = Math.round(player.maxHp * 0.5);
  if (tier === 'major') heal = Math.round(player.maxHp * 0.75);
  if (tier === 'supreme') heal = player.maxHp;

  const nextHp = Math.min(player.maxHp, player.hp + heal);

  return {
    player: {
      ...player,
      hp: nextHp,
      combo: 0,
      potions: {
        ...player.potions,
        [tier]: Math.max(0, player.potions[tier] - 1)
      }
    },
    healed: nextHp - player.hp,
    tier
  };
};

const handlePlayerHealByItem = (player: Player, boss: Boss, turn: number): ActionOutcome => {
  const result = consumePotionAndHeal(player);
  if (!result.tier) {
    return {
      player,
      boss,
      logs: [createLog('system', '沒有可用藥水。', 'warning', turn)],
      phase: 'battle',
      turn
    };
  }

  return {
    player: result.player,
    boss,
    logs: [createLog('player', `使用${result.tier}藥水，恢復 ${result.healed} 點生命。`, 'heal', turn)],
    phase: 'battle',
    turn
  };
};

const handlePlayerSkill = (player: Player, boss: Boss, turn: number): ActionOutcome => {
  const logs: BattleLogEntry[] = [];
  const stats = getDebuffedStats(player);
  let nextPlayer = { ...player, combo: 0, skillCooldown: 3 };
  let nextBoss = { ...boss };
  const skillId = player.activeSkillId;

  if (skillId.endsWith('_divine_luminara') || skillId.endsWith('_astral_elysion') || skillId.endsWith('_demon_pact')) {
    const themeBonus = skillId.endsWith('_demon_pact') ? 1.95 : skillId.endsWith('_astral_elysion') ? 1.78 : 1.66;
    const bonusCrit = skillId.endsWith('_demon_pact') ? 0.2 : 0.14;
    const dmg = calculateDamage(stats.atk + 34, Math.max(0, boss.def + boss.defBuff - 10), stats.crit + bonusCrit, themeBonus);
    const r = applyShieldedDamage(nextBoss.hp, nextBoss.shield, dmg.finalDamage);
    nextBoss.hp = r.nextHp;
    nextBoss.shield = r.nextShield;
    nextPlayer.totalDamageDealt += r.appliedDamage;
    nextPlayer.shield += Math.round(stats.def * 0.55);
    logs.push(createLog('player', `神契/魔契技能爆發，造成 ${r.appliedDamage} 傷害。`, 'critical', turn));
    return {
      player: nextPlayer,
      boss: nextBoss,
      logs,
      phase: nextBoss.hp <= 0 ? 'reward' : 'battle',
      turn
    };
  }

  if (skillId.startsWith('god_')) {
    const r = applyShieldedDamage(nextBoss.hp, nextBoss.shield, nextBoss.maxHp * 10);
    nextBoss.hp = r.nextHp;
    nextBoss.shield = r.nextShield;
    nextPlayer.totalDamageDealt += r.appliedDamage;
    logs.push(createLog('player', `神權降臨：${nextBoss.name} 直接湮滅。`, 'critical', turn));
    return {
      player: nextPlayer,
      boss: nextBoss,
      logs,
      phase: nextBoss.hp <= 0 ? 'reward' : 'battle',
      turn
    };
  }

  if (skillId.startsWith('warrior_')) {
    if (skillId === 'warrior_crush') {
      const dmg = calculateDamage(stats.atk + 16, Math.max(0, boss.def + boss.defBuff - 8), stats.crit + 0.06, 1.45);
      const r = applyShieldedDamage(nextBoss.hp, nextBoss.shield, dmg.finalDamage);
      nextBoss.hp = r.nextHp;
      nextBoss.shield = r.nextShield;
      nextBoss.defBuff -= 4;
      nextPlayer.totalDamageDealt += r.appliedDamage;
      logs.push(createLog('player', `破甲重擊造成 ${r.appliedDamage} 點傷害，敵方防禦下降。`, 'critical', turn));
    } else if (skillId === 'warrior_counter') {
      const shieldGain = Math.round(stats.def * 2.4 + 18);
      const counter = Math.round((stats.atk + stats.def) * 0.72);
      const r = applyShieldedDamage(nextBoss.hp, nextBoss.shield, counter);
      nextBoss.hp = r.nextHp;
      nextBoss.shield = r.nextShield;
      nextPlayer.shield += shieldGain;
      nextPlayer.defBuff += 4;
      nextPlayer.totalDamageDealt += r.appliedDamage;
      logs.push(createLog('player', `反擊架勢：獲得 ${shieldGain} 護盾並反擊 ${r.appliedDamage} 傷害。`, 'buff', turn));
    } else if (skillId === 'warrior_colossus_wall' || skillId === 'warrior_aegis_requiem' || skillId === 'warrior_titan_overlord') {
      const bonus = skillId === 'warrior_colossus_wall' ? 1 : skillId === 'warrior_aegis_requiem' ? 1.3 : 1.65;
      const shieldGain = Math.round(stats.def * (2.8 * bonus) + 28);
      const dmg = calculateDamage(stats.atk + 10 * bonus, Math.max(0, boss.def + boss.defBuff - 6), stats.crit + 0.08, 1.18 + 0.2 * bonus);
      const r = applyShieldedDamage(nextBoss.hp, nextBoss.shield, dmg.finalDamage);
      nextBoss.hp = r.nextHp;
      nextBoss.shield = r.nextShield;
      nextPlayer.shield += shieldGain;
      nextPlayer.defBuff += Math.round(4 + 2 * bonus);
      nextPlayer.totalDamageDealt += r.appliedDamage;
      logs.push(createLog('player', `進階戰技發動：護盾 +${shieldGain}，造成 ${r.appliedDamage} 傷害。`, 'critical', turn));
    } else {
      const shieldGain = Math.round(stats.def * 2.05 + 15);
      nextPlayer.shield += shieldGain;
      nextPlayer.defBuff += 4;
      logs.push(createLog('player', `鋼鐵堡壘：獲得 ${shieldGain} 護盾。`, 'buff', turn));
    }
  } else if (skillId.startsWith('mage_')) {
    if (skillId === 'mage_frost_prison') {
      const dmg = calculateDamage(stats.atk + 12, Math.max(0, boss.def + boss.defBuff - 4), stats.crit + 0.06, 1.25);
      const r = applyShieldedDamage(nextBoss.hp, nextBoss.shield, dmg.finalDamage);
      nextBoss.hp = r.nextHp;
      nextBoss.shield = r.nextShield;
      nextBoss.atkBuff -= 6;
      nextPlayer.totalDamageDealt += r.appliedDamage;
      logs.push(createLog('player', `寒霜禁錮造成 ${r.appliedDamage} 傷害，敵方攻擊下降。`, 'buff', turn));
    } else if (skillId === 'mage_chain_burst') {
      let total = 0;
      for (let i = 0; i < 3; i += 1) {
        const dmg = calculateDamage(stats.atk + 8, Math.max(0, boss.def + boss.defBuff - 3), stats.crit + 0.04 + i * 0.02, 0.9);
        const r = applyShieldedDamage(nextBoss.hp, nextBoss.shield, dmg.finalDamage);
        nextBoss.hp = r.nextHp;
        nextBoss.shield = r.nextShield;
        total += r.appliedDamage;
      }
      nextPlayer.totalDamageDealt += total;
      logs.push(createLog('player', `連鎖脈衝總計 ${total} 傷害。`, 'critical', turn));
    } else if (skillId === 'mage_stellar_tide' || skillId === 'mage_abyss_meteor' || skillId === 'mage_cosmic_judgement') {
      const bonus = skillId === 'mage_stellar_tide' ? 1.08 : skillId === 'mage_abyss_meteor' ? 1.35 : 1.65;
      const dmg = calculateDamage(stats.atk + 20 * bonus, Math.max(0, boss.def + boss.defBuff - 7), stats.crit + 0.12, 1.55 + 0.22 * bonus);
      const r = applyShieldedDamage(nextBoss.hp, nextBoss.shield, dmg.finalDamage);
      nextBoss.hp = r.nextHp;
      nextBoss.shield = r.nextShield;
      nextBoss.defBuff -= Math.round(3 * bonus);
      nextPlayer.totalDamageDealt += r.appliedDamage;
      logs.push(createLog('player', `進階魔法命中 ${r.appliedDamage} 傷害。`, 'critical', turn));
    } else {
      const dmg = calculateDamage(stats.atk + 14, Math.max(0, boss.def + boss.defBuff - 4), stats.crit + 0.08, 1.5);
      const r = applyShieldedDamage(nextBoss.hp, nextBoss.shield, dmg.finalDamage);
      nextBoss.hp = r.nextHp;
      nextBoss.shield = r.nextShield;
      nextPlayer.totalDamageDealt += r.appliedDamage;
      logs.push(createLog('player', `奧術新星造成 ${r.appliedDamage} 點傷害。`, dmg.isCritical ? 'critical' : 'damage', turn));
    }
  } else {
    if (skillId === 'assassin_bleed_mark') {
      const first = calculateDamage(stats.atk + 10, boss.def + boss.defBuff, stats.crit + 0.08, 1.05);
      const second = calculateDamage(stats.atk + 8, Math.max(0, boss.def + boss.defBuff - 2), stats.crit + 0.12, 0.95);
      const r1 = applyShieldedDamage(nextBoss.hp, nextBoss.shield, first.finalDamage);
      nextBoss.hp = r1.nextHp;
      nextBoss.shield = r1.nextShield;
      const r2 = applyShieldedDamage(nextBoss.hp, nextBoss.shield, second.finalDamage);
      nextBoss.hp = r2.nextHp;
      nextBoss.shield = r2.nextShield;
      const total = r1.appliedDamage + r2.appliedDamage + Math.round(stats.atk * 0.5);
      const bleed = applyShieldedDamage(nextBoss.hp, nextBoss.shield, Math.round(stats.atk * 0.5));
      nextBoss.hp = bleed.nextHp;
      nextBoss.shield = bleed.nextShield;
      nextPlayer.totalDamageDealt += total;
      logs.push(createLog('player', `裂傷印記連擊造成 ${total} 傷害。`, 'critical', turn));
    } else if (skillId === 'assassin_ghost_step') {
      nextPlayer.critBuff += 0.22;
      nextPlayer.atkBuff += Math.round(stats.atk * 0.18);
      const dmg = calculateDamage(stats.atk + 6, boss.def + boss.defBuff, stats.crit + 0.16, 1.02);
      const r = applyShieldedDamage(nextBoss.hp, nextBoss.shield, dmg.finalDamage);
      nextBoss.hp = r.nextHp;
      nextBoss.shield = r.nextShield;
      nextPlayer.totalDamageDealt += r.appliedDamage;
      logs.push(createLog('player', `鬼步發動：強化爆擊並造成 ${r.appliedDamage} 傷害。`, 'buff', turn));
    } else if (
      skillId === 'assassin_lunar_ripper' ||
      skillId === 'assassin_void_execution' ||
      skillId === 'assassin_eternal_night'
    ) {
      const bonus = skillId === 'assassin_lunar_ripper' ? 1 : skillId === 'assassin_void_execution' ? 1.35 : 1.75;
      const hits = skillId === 'assassin_eternal_night' ? 5 : 4;
      let total = 0;
      for (let i = 0; i < hits; i += 1) {
        const dmg = calculateDamage(stats.atk + 7 * bonus, Math.max(0, boss.def + boss.defBuff - 1), stats.crit + 0.12 + i * 0.03, 0.84 + bonus * 0.1);
        const r = applyShieldedDamage(nextBoss.hp, nextBoss.shield, dmg.finalDamage);
        nextBoss.hp = r.nextHp;
        nextBoss.shield = r.nextShield;
        total += r.appliedDamage;
      }
      nextPlayer.totalDamageDealt += total;
      logs.push(createLog('player', `進階暗殺連擊總計 ${total} 傷害。`, 'critical', turn));
    } else {
      let total = 0;
      for (let i = 0; i < 3; i += 1) {
        const dmg = calculateDamage(stats.atk + 6, boss.def + boss.defBuff, stats.crit + 0.05 + i * 0.02, 0.88);
        const r = applyShieldedDamage(nextBoss.hp, nextBoss.shield, dmg.finalDamage);
        nextBoss.hp = r.nextHp;
        nextBoss.shield = r.nextShield;
        total += r.appliedDamage;
      }
      nextPlayer.totalDamageDealt += total;
      logs.push(createLog('player', `暗影連擊總計 ${total} 傷害。`, 'critical', turn));
    }
  }

  return {
    player: nextPlayer,
    boss: nextBoss,
    logs,
    phase: nextBoss.hp <= 0 ? 'reward' : 'battle',
    turn
  };
};

const runBossAction = (player: Player, boss: Boss, turn: number): ActionOutcome => {
  const logs: BattleLogEntry[] = [];
  const intent = getBossIntent(boss, turn);
  let nextBoss = { ...boss };
  let nextPlayer = { ...player };
  const stats = getDebuffedStats(nextPlayer);

  if (intent.id === 'focus') {
    const atkBoost = Math.max(3, Math.round(boss.atk * 0.16));
    nextBoss.atkBuff += atkBoost;
    nextBoss.critBuff += 0.08;
    logs.push(createLog('boss', `${boss.emoji} ${boss.name} 正在蓄力（攻擊 +${atkBoost}）`, 'buff', turn));
    return { player: nextPlayer, boss: nextBoss, logs, phase: 'battle', turn: turn + 1 };
  }

  const multi = intent.id === 'heavy' ? 1.45 : intent.id === 'drain' ? 0.95 : 1;
  const critBonus = intent.id === 'heavy' ? 0.04 : 0;
  const damage = calculateDamage(nextBoss.atk + nextBoss.atkBuff, stats.def + nextPlayer.defBuff, nextBoss.crit + nextBoss.critBuff + critBonus, multi);

  let reducedDamage = damage.finalDamage;
  if (nextPlayer.isGuarding) {
    reducedDamage = Math.max(1, Math.round(reducedDamage * (1 - COMBAT_NUMBERS.guardReduction)));
  }

  const shieldResult = applyShieldedDamage(nextPlayer.hp, nextPlayer.shield, reducedDamage);
  nextPlayer.hp = shieldResult.nextHp;
  nextPlayer.shield = shieldResult.nextShield;
  nextPlayer.totalDamageTaken += shieldResult.appliedDamage;

  logs.push(createLog('boss', `${boss.emoji} ${boss.name} 造成 ${shieldResult.appliedDamage} 傷害。`, damage.isCritical ? 'warning' : 'damage', turn));

  if (intent.id === 'drain' && shieldResult.appliedDamage > 0) {
    const heal = Math.round(shieldResult.appliedDamage * 0.35);
    nextBoss.hp = Math.min(nextBoss.maxHp, nextBoss.hp + heal);
    logs.push(createLog('boss', `${boss.emoji} ${boss.name} 汲取生命回復 ${heal}。`, 'heal', turn));
  }

  return {
    player: nextPlayer,
    boss: nextBoss,
    logs,
    phase: nextPlayer.hp <= 0 ? 'defeat' : 'battle',
    turn: turn + 1
  };
};

const normalizeAfterTurn = (player: Player, boss: Boss): { player: Player; boss: Boss } => ({
  player: applyEndTurnDecay(player),
  boss: applyEndTurnDecay(boss)
});

export const performTurn = (action: BattleActionId, player: Player, boss: Boss, turn: number): ActionOutcome => {
  let currentPlayer = { ...player };
  let currentBoss = { ...boss };
  let logs: BattleLogEntry[] = [];

  if (action === 'attack') {
    const outcome = handlePlayerAttack(currentPlayer, currentBoss, turn);
    currentPlayer = outcome.player;
    currentBoss = outcome.boss;
    logs = logs.concat(outcome.logs);
  }

  if (action === 'guard') {
    const outcome = handlePlayerGuard(currentPlayer, currentBoss, turn);
    currentPlayer = outcome.player;
    currentBoss = outcome.boss;
    logs = logs.concat(outcome.logs);
  }

  if (action === 'skill') {
    const outcome = handlePlayerSkill(currentPlayer, currentBoss, turn);
    currentPlayer = outcome.player;
    currentBoss = outcome.boss;
    logs = logs.concat(outcome.logs);
  }

  if (action === 'heal') {
    const outcome = handlePlayerHealByItem(currentPlayer, currentBoss, turn);
    currentPlayer = outcome.player;
    currentBoss = outcome.boss;
    logs = logs.concat(outcome.logs);
  }

  currentBoss = resolveBossEnrage(currentBoss, logs, turn);

  if (currentBoss.hp <= 0) {
    currentPlayer = tickTemporaryDebuff(currentPlayer, logs, turn);
    logs.push(createLog('system', `${currentBoss.emoji} ${currentBoss.name} 被擊敗。`, 'reward', turn));
    return { player: currentPlayer, boss: currentBoss, logs, phase: 'reward', turn };
  }

  const bossOutcome = runBossAction(currentPlayer, currentBoss, turn);
  currentPlayer = bossOutcome.player;
  currentBoss = bossOutcome.boss;
  logs = logs.concat(bossOutcome.logs);

  if (currentPlayer.hp <= 0) {
    currentPlayer = tickTemporaryDebuff(currentPlayer, logs, bossOutcome.turn);
    logs.push(createLog('system', '你被擊敗，旅程終止。', 'warning', turn));
    return { player: currentPlayer, boss: currentBoss, logs, phase: 'defeat', turn: bossOutcome.turn };
  }

  const normalized = normalizeAfterTurn(currentPlayer, currentBoss);
  const nextPlayer = tickTemporaryDebuff(normalized.player, logs, bossOutcome.turn);
  return { player: nextPlayer, boss: normalized.boss, logs, phase: 'battle', turn: bossOutcome.turn };
};

export const applyVictoryRewards = (player: Player, boss: Boss): Player => {
  const chapterBonus = Math.floor(boss.stage / 50) * 24;
  const expGain = Math.round(24 + boss.stage * 9 + boss.maxHp * 0.045 + boss.atk * 0.35 + (boss.isBoss ? 120 + chapterBonus : 0));

  let nextPlayer = {
    ...player,
    exp: player.exp + expGain,
    gold: player.gold + boss.dropGold,
    defeatedBosses: player.defeatedBosses + 1,
    combo: 0,
    isGuarding: false,
    shield: Math.round(player.shield * 0.5)
  };

  while (nextPlayer.exp >= nextPlayer.expToNext) {
    nextPlayer.exp -= nextPlayer.expToNext;
    nextPlayer.level += 1;
    nextPlayer.expToNext = Math.round(nextPlayer.expToNext * 1.2 + 24);

    const growth = CLASS_TEMPLATES[nextPlayer.classId].growth;
    const maxHp = nextPlayer.maxHp + growth.hp;

    nextPlayer = {
      ...nextPlayer,
      maxHp,
      hp: Math.min(maxHp, nextPlayer.hp + Math.round(growth.hp * 0.4)),
      atk: nextPlayer.atk + growth.atk,
      def: nextPlayer.def + growth.def,
      crit: nextPlayer.crit + growth.crit
    };
  }

  return nextPlayer;
};

export const resetForNextBoss = (player: Player): Player => ({
  ...player,
  shield: 0,
  critBuff: 0,
  atkBuff: 0,
  defBuff: 0,
  isGuarding: false,
  turnsGuarding: 0,
  skillCooldown: Math.max(0, player.skillCooldown - 1),
  combo: 0
});

export const getActionDisabledReason = (action: BattleActionId, player: Player): string | null => {
  if (action === 'skill' && player.skillCooldown > 0) {
    return `技能冷卻中：${player.skillCooldown}`;
  }
  return null;
};

export const getSkillDamagePreview = (player: Player, skillId: string): string => {
  const stats = getDebuffedStats(player);
  const base = Math.max(1, stats.atk + player.atkBuff);

  const estimate = (multiplier: number, flat = 0) => {
    const low = Math.max(1, Math.round((base + flat) * multiplier * 0.9));
    const high = Math.max(1, Math.round((base + flat) * multiplier * 1.15));
    return `${low} - ${high}`;
  };

  if (skillId === 'warrior_iron_bastion') return `傷害：0（護盾型）`;
  if (skillId === 'warrior_counter') return `傷害：約 ${estimate(0.72, stats.def)}`;
  if (skillId === 'warrior_crush') return `傷害：約 ${estimate(1.45, 16)}`;
  if (skillId.startsWith('warrior_')) return `傷害：約 ${estimate(1.5, 18)}`;

  if (skillId === 'mage_arcane_nova') return `傷害：約 ${estimate(1.5, 14)}`;
  if (skillId === 'mage_frost_prison') return `傷害：約 ${estimate(1.25, 12)}`;
  if (skillId === 'mage_chain_burst') return `傷害：約 ${estimate(2.7, 8)}（三段）`;
  if (skillId.startsWith('mage_')) return `傷害：約 ${estimate(1.9, 20)}`;

  if (skillId === 'assassin_shadow_flurry') return `傷害：約 ${estimate(2.64, 6)}（三段）`;
  if (skillId === 'assassin_bleed_mark') return `傷害：約 ${estimate(2.1, 18)}（含流血）`;
  if (skillId === 'assassin_ghost_step') return `傷害：約 ${estimate(1.02, 6)} + 自身增益`;
  if (skillId.startsWith('god_')) return `傷害：∞（神裁）`;
  return `傷害：約 ${estimate(3.2, 10)}（多段）`;
};


