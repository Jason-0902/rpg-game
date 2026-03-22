import { BOSS_TEMPLATES } from '../data/bossData';
import { CLASS_TEMPLATES } from '../data/classData';
import { getBaseSkillId, getClassTitleByRank } from '../data/skillData';
import { generateMonsterPortrait } from './imageGen';
import {
  ActionOutcome,
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
    inventoryEquipment: []
  };
};

const calcBossScale = (level: number, isBoss: boolean) => {
  const normalScale = 1 + (level - 1) * 0.095;
  if (!isBoss) return normalScale;
  const chapter = Math.max(1, Math.floor(level / 50));
  return normalScale * (1.75 + chapter * 0.18);
};

export const createBossForLevel = (level: number): Boss => {
  const isBoss = level % 50 === 0;
  const template = BOSS_TEMPLATES[rollInt(0, BOSS_TEMPLATES.length - 1)];
  const scale = calcBossScale(level, isBoss);

  let maxHp = Math.round((template.baseHp + template.hpScale * (level - 1)) * scale);
  let atk = Math.round((template.baseAtk + template.atkScale * (level - 1)) * (0.88 + scale * 0.08));

  if (!isBoss && level <= 50) {
    maxHp = Math.min(maxHp, 50);
    atk = Math.min(atk, 50);
  }

  const def = Math.round((template.baseDef + template.defScale * (level - 1)) * (0.86 + scale * 0.06));
  const crit = clamp(template.baseCrit + template.critScale * (level - 1), 0.05, 2.4);
  const chapter = Math.max(1, Math.floor(level / 50));

  return {
    id: `boss-${level}-${Math.random().toString(36).slice(2, 8)}`,
    emoji: isBoss ? '👹' : template.emoji,
    name: isBoss ? `${template.name}・領主型` : template.name,
    title: isBoss ? `第 ${chapter} 章首領` : template.title,
    stage: level,
    isBoss,
    portrait: generateMonsterPortrait(template.name, isBoss ? '👹' : template.emoji, level),
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
    dropGold: Math.round((36 + level * 8 + rollInt(0, 16)) * (isBoss ? 2.4 : 1))
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
  const nextPlayer = { ...player, combo: player.combo + 1, isGuarding: false };
  const critBonus = nextPlayer.classId === 'assassin' ? Math.min(0.25, nextPlayer.combo * 0.02) : 0;

  const dmg = calculateDamage(nextPlayer.atk + nextPlayer.atkBuff, boss.def + boss.defBuff, nextPlayer.crit + nextPlayer.critBuff + critBonus);

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
  const shieldGain = Math.round(player.def * (player.classId === 'warrior' ? 1.65 : 1.15) + 10);
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
  let nextPlayer = { ...player, combo: 0, skillCooldown: 3 };
  let nextBoss = { ...boss };
  const skillId = player.activeSkillId;

  if (skillId.startsWith('warrior_')) {
    if (skillId === 'warrior_crush') {
      const dmg = calculateDamage(player.atk + 16, Math.max(0, boss.def + boss.defBuff - 8), player.crit + 0.06, 1.45);
      const r = applyShieldedDamage(nextBoss.hp, nextBoss.shield, dmg.finalDamage);
      nextBoss.hp = r.nextHp;
      nextBoss.shield = r.nextShield;
      nextBoss.defBuff -= 4;
      nextPlayer.totalDamageDealt += r.appliedDamage;
      logs.push(createLog('player', `破甲重擊造成 ${r.appliedDamage} 點傷害，敵方防禦下降。`, 'critical', turn));
    } else if (skillId === 'warrior_counter') {
      const shieldGain = Math.round(player.def * 2.4 + 18);
      const counter = Math.round((player.atk + player.def) * 0.72);
      const r = applyShieldedDamage(nextBoss.hp, nextBoss.shield, counter);
      nextBoss.hp = r.nextHp;
      nextBoss.shield = r.nextShield;
      nextPlayer.shield += shieldGain;
      nextPlayer.defBuff += 4;
      nextPlayer.totalDamageDealt += r.appliedDamage;
      logs.push(createLog('player', `反擊架勢：獲得 ${shieldGain} 護盾並反擊 ${r.appliedDamage} 傷害。`, 'buff', turn));
    } else if (skillId === 'warrior_colossus_wall' || skillId === 'warrior_aegis_requiem' || skillId === 'warrior_titan_overlord') {
      const bonus = skillId === 'warrior_colossus_wall' ? 1 : skillId === 'warrior_aegis_requiem' ? 1.3 : 1.65;
      const shieldGain = Math.round(player.def * (2.8 * bonus) + 28);
      const dmg = calculateDamage(player.atk + 10 * bonus, Math.max(0, boss.def + boss.defBuff - 6), player.crit + 0.08, 1.18 + 0.2 * bonus);
      const r = applyShieldedDamage(nextBoss.hp, nextBoss.shield, dmg.finalDamage);
      nextBoss.hp = r.nextHp;
      nextBoss.shield = r.nextShield;
      nextPlayer.shield += shieldGain;
      nextPlayer.defBuff += Math.round(4 + 2 * bonus);
      nextPlayer.totalDamageDealt += r.appliedDamage;
      logs.push(createLog('player', `進階戰技發動：護盾 +${shieldGain}，造成 ${r.appliedDamage} 傷害。`, 'critical', turn));
    } else {
      const shieldGain = Math.round(player.def * 2.05 + 15);
      nextPlayer.shield += shieldGain;
      nextPlayer.defBuff += 4;
      logs.push(createLog('player', `鋼鐵堡壘：獲得 ${shieldGain} 護盾。`, 'buff', turn));
    }
  } else if (skillId.startsWith('mage_')) {
    if (skillId === 'mage_frost_prison') {
      const dmg = calculateDamage(player.atk + 12, Math.max(0, boss.def + boss.defBuff - 4), player.crit + 0.06, 1.25);
      const r = applyShieldedDamage(nextBoss.hp, nextBoss.shield, dmg.finalDamage);
      nextBoss.hp = r.nextHp;
      nextBoss.shield = r.nextShield;
      nextBoss.atkBuff -= 6;
      nextPlayer.totalDamageDealt += r.appliedDamage;
      logs.push(createLog('player', `寒霜禁錮造成 ${r.appliedDamage} 傷害，敵方攻擊下降。`, 'buff', turn));
    } else if (skillId === 'mage_chain_burst') {
      let total = 0;
      for (let i = 0; i < 3; i += 1) {
        const dmg = calculateDamage(player.atk + 8, Math.max(0, boss.def + boss.defBuff - 3), player.crit + 0.04 + i * 0.02, 0.9);
        const r = applyShieldedDamage(nextBoss.hp, nextBoss.shield, dmg.finalDamage);
        nextBoss.hp = r.nextHp;
        nextBoss.shield = r.nextShield;
        total += r.appliedDamage;
      }
      nextPlayer.totalDamageDealt += total;
      logs.push(createLog('player', `連鎖脈衝總計 ${total} 傷害。`, 'critical', turn));
    } else if (skillId === 'mage_stellar_tide' || skillId === 'mage_abyss_meteor' || skillId === 'mage_cosmic_judgement') {
      const bonus = skillId === 'mage_stellar_tide' ? 1.08 : skillId === 'mage_abyss_meteor' ? 1.35 : 1.65;
      const dmg = calculateDamage(player.atk + 20 * bonus, Math.max(0, boss.def + boss.defBuff - 7), player.crit + 0.12, 1.55 + 0.22 * bonus);
      const r = applyShieldedDamage(nextBoss.hp, nextBoss.shield, dmg.finalDamage);
      nextBoss.hp = r.nextHp;
      nextBoss.shield = r.nextShield;
      nextBoss.defBuff -= Math.round(3 * bonus);
      nextPlayer.totalDamageDealt += r.appliedDamage;
      logs.push(createLog('player', `進階魔法命中 ${r.appliedDamage} 傷害。`, 'critical', turn));
    } else {
      const dmg = calculateDamage(player.atk + 14, Math.max(0, boss.def + boss.defBuff - 4), player.crit + 0.08, 1.5);
      const r = applyShieldedDamage(nextBoss.hp, nextBoss.shield, dmg.finalDamage);
      nextBoss.hp = r.nextHp;
      nextBoss.shield = r.nextShield;
      nextPlayer.totalDamageDealt += r.appliedDamage;
      logs.push(createLog('player', `奧術新星造成 ${r.appliedDamage} 點傷害。`, dmg.isCritical ? 'critical' : 'damage', turn));
    }
  } else {
    if (skillId === 'assassin_bleed_mark') {
      const first = calculateDamage(player.atk + 10, boss.def + boss.defBuff, player.crit + 0.08, 1.05);
      const second = calculateDamage(player.atk + 8, Math.max(0, boss.def + boss.defBuff - 2), player.crit + 0.12, 0.95);
      const r1 = applyShieldedDamage(nextBoss.hp, nextBoss.shield, first.finalDamage);
      nextBoss.hp = r1.nextHp;
      nextBoss.shield = r1.nextShield;
      const r2 = applyShieldedDamage(nextBoss.hp, nextBoss.shield, second.finalDamage);
      nextBoss.hp = r2.nextHp;
      nextBoss.shield = r2.nextShield;
      const total = r1.appliedDamage + r2.appliedDamage + Math.round(player.atk * 0.5);
      const bleed = applyShieldedDamage(nextBoss.hp, nextBoss.shield, Math.round(player.atk * 0.5));
      nextBoss.hp = bleed.nextHp;
      nextBoss.shield = bleed.nextShield;
      nextPlayer.totalDamageDealt += total;
      logs.push(createLog('player', `裂傷印記連擊造成 ${total} 傷害。`, 'critical', turn));
    } else if (skillId === 'assassin_ghost_step') {
      nextPlayer.critBuff += 0.22;
      nextPlayer.atkBuff += Math.round(player.atk * 0.18);
      const dmg = calculateDamage(player.atk + 6, boss.def + boss.defBuff, player.crit + 0.16, 1.02);
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
        const dmg = calculateDamage(player.atk + 7 * bonus, Math.max(0, boss.def + boss.defBuff - 1), player.crit + 0.12 + i * 0.03, 0.84 + bonus * 0.1);
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
        const dmg = calculateDamage(player.atk + 6, boss.def + boss.defBuff, player.crit + 0.05 + i * 0.02, 0.88);
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

  if (intent.id === 'focus') {
    const atkBoost = Math.max(3, Math.round(boss.atk * 0.16));
    nextBoss.atkBuff += atkBoost;
    nextBoss.critBuff += 0.08;
    logs.push(createLog('boss', `${boss.emoji} ${boss.name} 正在蓄力（攻擊 +${atkBoost}）`, 'buff', turn));
    return { player: nextPlayer, boss: nextBoss, logs, phase: 'battle', turn: turn + 1 };
  }

  const multi = intent.id === 'heavy' ? 1.45 : intent.id === 'drain' ? 0.95 : 1;
  const critBonus = intent.id === 'heavy' ? 0.04 : 0;
  const damage = calculateDamage(nextBoss.atk + nextBoss.atkBuff, nextPlayer.def + nextPlayer.defBuff, nextBoss.crit + nextBoss.critBuff + critBonus, multi);

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
    logs.push(createLog('system', `${currentBoss.emoji} ${currentBoss.name} 被擊敗。`, 'reward', turn));
    return { player: currentPlayer, boss: currentBoss, logs, phase: 'reward', turn };
  }

  const bossOutcome = runBossAction(currentPlayer, currentBoss, turn);
  currentPlayer = bossOutcome.player;
  currentBoss = bossOutcome.boss;
  logs = logs.concat(bossOutcome.logs);

  if (currentPlayer.hp <= 0) {
    logs.push(createLog('system', '你被擊敗，旅程終止。', 'warning', turn));
    return { player: currentPlayer, boss: currentBoss, logs, phase: 'defeat', turn: bossOutcome.turn };
  }

  const normalized = normalizeAfterTurn(currentPlayer, currentBoss);
  return { player: normalized.player, boss: normalized.boss, logs, phase: 'battle', turn: bossOutcome.turn };
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



