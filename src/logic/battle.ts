import { BOSS_TEMPLATES } from '../data/bossData';
import { CLASS_TEMPLATES } from '../data/classData';
import {
  ActionOutcome,
  BattleActionId,
  BattleLogEntry,
  Boss,
  BossIntent,
  ClassId,
  CombatNumbers,
  DamageResult,
  Player
} from '../types/game';

const COMBAT_NUMBERS: CombatNumbers = {
  attackRollMin: 0.88,
  attackRollMax: 1.16,
  critMultiplier: 1.75,
  guardReduction: 0.45,
  minimumDamage: 1
};

const rng = () => Math.random();

const rollInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

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

export const createPlayerFromClass = (classId: ClassId): Player => {
  const template = CLASS_TEMPLATES[classId];

  return {
    classId,
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
    runes: 0,
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    defeatedBosses: 0
  };
};

const calcBossScale = (level: number) => 1 + (level - 1) * 0.18;

export const createBossForLevel = (level: number): Boss => {
  const template = BOSS_TEMPLATES[(level - 1) % BOSS_TEMPLATES.length];
  const scale = calcBossScale(level);

  const maxHp = Math.round((template.baseHp + template.hpScale * (level - 1)) * scale);
  const atk = Math.round((template.baseAtk + template.atkScale * (level - 1)) * (0.94 + scale * 0.08));
  const def = Math.round((template.baseDef + template.defScale * (level - 1)) * (0.9 + scale * 0.06));
  const crit = clamp(template.baseCrit + template.critScale * (level - 1), 0.05, 0.45);

  return {
    id: `boss-${level}-${template.name.toLowerCase().replace(/\s/g, '-')}`,
    name: template.name,
    title: template.title,
    stage: level,
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
    enrageThreshold: template.enrageThreshold,
    enrageBonus: template.enrageBonus,
    enraged: false,
    dropRunes: Math.round(8 + level * 3 + rollInt(0, 6))
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
  const reducedByDefense = defenderDef * (0.68 + rng() * 0.18);
  let finalDamage = Math.max(COMBAT_NUMBERS.minimumDamage, Math.round(rawDamage - reducedByDefense));
  const isCritical = rng() <= critChance;

  if (isCritical) {
    finalDamage = Math.round(finalDamage * COMBAT_NUMBERS.critMultiplier);
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

const getSkillPowerByClass = (player: Player): number => {
  switch (player.classId) {
    case 'warrior':
      return 1.15;
    case 'mage':
      return 1.7;
    case 'assassin':
      return 1.35;
    default:
      return 1.2;
  }
};

const getSkillCooldownByClass = (player: Player): number => {
  switch (player.classId) {
    case 'warrior':
      return 3;
    case 'mage':
      return 3;
    case 'assassin':
      return 2;
    default:
      return 3;
  }
};

const applyEndTurnDecay = <T extends Player | Boss>(entity: T): T => {
  const next = { ...entity };
  next.isGuarding = false;
  next.turnsGuarding = 0;
  next.critBuff = Math.max(0, next.critBuff - 0.03);
  next.atkBuff = Math.max(0, next.atkBuff - 1);
  next.defBuff = Math.max(0, next.defBuff - 1);
  if (next.skillCooldown > 0) {
    next.skillCooldown -= 1;
  }

  return next;
};

const resolveBossEnrage = (boss: Boss, logs: BattleLogEntry[], turn: number): Boss => {
  if (boss.enraged) {
    return boss;
  }

  const thresholdHp = boss.maxHp * boss.enrageThreshold;
  if (boss.hp <= thresholdHp) {
    const enragedBoss = {
      ...boss,
      enraged: true,
      atkBuff: boss.atkBuff + Math.round(boss.atk * boss.enrageBonus * 0.35),
      critBuff: boss.critBuff + boss.enrageBonus * 0.4
    };
    logs.push(createLog('system', `${boss.name} enters ENRAGE state!`, 'warning', turn));
    return enragedBoss;
  }

  return boss;
};

export const getBossIntent = (boss: Boss, turn: number): BossIntent => {
  const hpRatio = boss.hp / boss.maxHp;

  if (hpRatio < 0.35 && turn % 3 === 0) {
    return {
      id: 'drain',
      label: 'Soul Drain',
      description: '吸取生命並回復血量'
    };
  }

  if (boss.enraged && turn % 2 === 0) {
    return {
      id: 'heavy',
      label: 'Ruin Slam',
      description: '高倍率重擊'
    };
  }

  if (turn % 4 === 0) {
    return {
      id: 'focus',
      label: 'Dark Focus',
      description: '提升下回合爆擊與攻擊'
    };
  }

  return {
    id: 'strike',
    label: 'Savage Strike',
    description: '一般攻擊'
  };
};

const handlePlayerAttack = (player: Player, boss: Boss, turn: number): ActionOutcome => {
  const nextPlayer = { ...player, combo: player.combo + 1, isGuarding: false };
  const critBonus = nextPlayer.classId === 'assassin' ? Math.min(0.25, nextPlayer.combo * 0.02) : 0;

  const dmg = calculateDamage(
    nextPlayer.atk + nextPlayer.atkBuff,
    boss.def + boss.defBuff,
    clamp(nextPlayer.crit + nextPlayer.critBuff + critBonus, 0.05, 0.95)
  );

  const shieldResult = applyShieldedDamage(boss.hp, boss.shield, dmg.finalDamage);
  const nextBoss = {
    ...boss,
    hp: shieldResult.nextHp,
    shield: shieldResult.nextShield
  };

  const logs: BattleLogEntry[] = [];

  if (dmg.isCritical) {
    logs.push(createLog('player', `Critical hit! You deal ${shieldResult.appliedDamage} damage.`, 'critical', turn));
  } else {
    logs.push(createLog('player', `You strike and deal ${shieldResult.appliedDamage} damage.`, 'damage', turn));
  }

  if (shieldResult.blockedByShield > 0) {
    logs.push(createLog('system', `Boss shield blocks ${shieldResult.blockedByShield} damage.`, 'info', turn));
  }

  return {
    player: { ...nextPlayer, totalDamageDealt: nextPlayer.totalDamageDealt + shieldResult.appliedDamage },
    boss: nextBoss,
    logs,
    phase: nextBoss.hp <= 0 ? 'upgrade' : 'battle',
    turn
  };
};

const handlePlayerGuard = (player: Player, boss: Boss, turn: number): ActionOutcome => {
  const shieldGain = Math.round(player.def * (player.classId === 'warrior' ? 1.7 : 1.2) + 10);
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
    logs: [createLog('player', `You guard and gain ${shieldGain} shield.`, 'buff', turn)],
    phase: 'battle',
    turn
  };
};

const handlePlayerHeal = (player: Player, boss: Boss, turn: number): ActionOutcome => {
  const healAmount = Math.round(player.maxHp * 0.16 + player.level * 2);
  const nextHp = Math.min(player.maxHp, player.hp + healAmount);

  const nextPlayer = {
    ...player,
    hp: nextHp,
    combo: 0,
    skillCooldown: player.skillCooldown > 0 ? player.skillCooldown : 2
  };

  return {
    player: nextPlayer,
    boss,
    logs: [createLog('player', `You channel and recover ${nextHp - player.hp} HP.`, 'heal', turn)],
    phase: 'battle',
    turn
  };
};

const handlePlayerSkill = (player: Player, boss: Boss, turn: number): ActionOutcome => {
  const logs: BattleLogEntry[] = [];
  let nextPlayer = { ...player, combo: 0, skillCooldown: getSkillCooldownByClass(player) };
  let nextBoss = { ...boss };

  if (player.classId === 'warrior') {
    const shieldGain = Math.round(player.def * 2.2 + 18);
    nextPlayer = {
      ...nextPlayer,
      shield: nextPlayer.shield + shieldGain,
      defBuff: nextPlayer.defBuff + 4,
      isGuarding: true,
      turnsGuarding: 1
    };
    logs.push(createLog('player', `Iron Bastion grants ${shieldGain} shield and DEF up.`, 'buff', turn));
  }

  if (player.classId === 'mage') {
    const dmg = calculateDamage(
      player.atk + 14,
      Math.max(0, boss.def + boss.defBuff - 4),
      clamp(player.crit + 0.08 + player.critBuff, 0.05, 0.95),
      getSkillPowerByClass(player)
    );

    const shieldResult = applyShieldedDamage(boss.hp, boss.shield, dmg.finalDamage);
    nextBoss = {
      ...nextBoss,
      hp: shieldResult.nextHp,
      shield: shieldResult.nextShield,
      defBuff: Math.min(nextBoss.defBuff, -3)
    };

    logs.push(
      createLog(
        'player',
        dmg.isCritical
          ? `Arcane Nova critically deals ${shieldResult.appliedDamage} damage!`
          : `Arcane Nova deals ${shieldResult.appliedDamage} damage and shreds armor.`,
        dmg.isCritical ? 'critical' : 'damage',
        turn
      )
    );

    nextPlayer.totalDamageDealt += shieldResult.appliedDamage;
  }

  if (player.classId === 'assassin') {
    const baseHits = 2;
    const bonusHit = player.crit >= 0.35 ? 1 : 0;
    const totalHits = baseHits + bonusHit;
    let accumulatedDamage = 0;

    for (let i = 0; i < totalHits; i += 1) {
      const dmg = calculateDamage(
        player.atk + 6,
        boss.def + boss.defBuff,
        clamp(player.crit + 0.05 + i * 0.02, 0.05, 0.95),
        0.82
      );
      const shieldResult = applyShieldedDamage(nextBoss.hp, nextBoss.shield, dmg.finalDamage);
      nextBoss = {
        ...nextBoss,
        hp: shieldResult.nextHp,
        shield: shieldResult.nextShield
      };
      accumulatedDamage += shieldResult.appliedDamage;
    }

    logs.push(createLog('player', `Shadow Flurry lands ${totalHits} hits for ${accumulatedDamage} total damage.`, 'critical', turn));
    nextPlayer.critBuff += 0.06;
    nextPlayer.totalDamageDealt += accumulatedDamage;
  }

  return {
    player: nextPlayer,
    boss: nextBoss,
    logs,
    phase: nextBoss.hp <= 0 ? 'upgrade' : 'battle',
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
    logs.push(createLog('boss', `${boss.name} gathers power (+${atkBoost} ATK).`, 'buff', turn));
    return {
      player: nextPlayer,
      boss: nextBoss,
      logs,
      phase: 'battle',
      turn: turn + 1
    };
  }

  const multi = intent.id === 'heavy' ? 1.45 : intent.id === 'drain' ? 0.95 : 1;
  const critBonus = intent.id === 'heavy' ? 0.04 : 0;

  const damage = calculateDamage(
    nextBoss.atk + nextBoss.atkBuff,
    nextPlayer.def + nextPlayer.defBuff,
    clamp(nextBoss.crit + nextBoss.critBuff + critBonus, 0.05, 0.75),
    multi
  );

  let reducedDamage = damage.finalDamage;
  if (nextPlayer.isGuarding) {
    reducedDamage = Math.max(1, Math.round(reducedDamage * (1 - COMBAT_NUMBERS.guardReduction)));
  }

  const shieldResult = applyShieldedDamage(nextPlayer.hp, nextPlayer.shield, reducedDamage);
  nextPlayer = {
    ...nextPlayer,
    hp: shieldResult.nextHp,
    shield: shieldResult.nextShield,
    totalDamageTaken: nextPlayer.totalDamageTaken + shieldResult.appliedDamage
  };

  if (damage.isCritical) {
    logs.push(createLog('boss', `${boss.name} lands a CRITICAL for ${shieldResult.appliedDamage} damage!`, 'warning', turn));
  } else {
    logs.push(createLog('boss', `${boss.name} deals ${shieldResult.appliedDamage} damage.`, 'damage', turn));
  }

  if (nextPlayer.isGuarding) {
    logs.push(createLog('system', 'Guard stance reduced incoming damage.', 'info', turn));
  }

  if (intent.id === 'drain' && shieldResult.appliedDamage > 0) {
    const heal = Math.round(shieldResult.appliedDamage * 0.35);
    nextBoss.hp = Math.min(nextBoss.maxHp, nextBoss.hp + heal);
    logs.push(createLog('boss', `${boss.name} drains life and heals ${heal} HP.`, 'heal', turn));
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

export const performTurn = (
  action: BattleActionId,
  player: Player,
  boss: Boss,
  turn: number
): ActionOutcome => {
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
    const outcome = handlePlayerHeal(currentPlayer, currentBoss, turn);
    currentPlayer = outcome.player;
    currentBoss = outcome.boss;
    logs = logs.concat(outcome.logs);
  }

  currentBoss = resolveBossEnrage(currentBoss, logs, turn);

  if (currentBoss.hp <= 0) {
    logs.push(createLog('system', `Boss ${currentBoss.name} is defeated!`, 'reward', turn));
    return {
      player: currentPlayer,
      boss: currentBoss,
      logs,
      phase: 'upgrade',
      turn
    };
  }

  const bossOutcome = runBossAction(currentPlayer, currentBoss, turn);
  currentPlayer = bossOutcome.player;
  currentBoss = bossOutcome.boss;
  logs = logs.concat(bossOutcome.logs);

  if (currentPlayer.hp <= 0) {
    logs.push(createLog('system', 'You were defeated. Run ended.', 'warning', turn));
    return {
      player: currentPlayer,
      boss: currentBoss,
      logs,
      phase: 'defeat',
      turn: bossOutcome.turn
    };
  }

  const normalized = normalizeAfterTurn(currentPlayer, currentBoss);

  return {
    player: normalized.player,
    boss: normalized.boss,
    logs,
    phase: 'battle',
    turn: bossOutcome.turn
  };
};

export const applyVictoryRewards = (player: Player, boss: Boss): Player => {
  const expGain = Math.round(35 + boss.stage * 14 + boss.maxHp * 0.05);
  let nextPlayer = {
    ...player,
    exp: player.exp + expGain,
    runes: player.runes + boss.dropRunes,
    defeatedBosses: player.defeatedBosses + 1,
    combo: 0,
    isGuarding: false,
    shield: Math.round(player.shield * 0.55),
    hp: Math.min(player.maxHp, player.hp + Math.round(player.maxHp * 0.18))
  };

  while (nextPlayer.exp >= nextPlayer.expToNext) {
    nextPlayer.exp -= nextPlayer.expToNext;
    nextPlayer.level += 1;
    nextPlayer.expToNext = Math.round(nextPlayer.expToNext * 1.24 + 22);

    const growth = CLASS_TEMPLATES[nextPlayer.classId].growth;
    const maxHp = nextPlayer.maxHp + growth.hp;

    nextPlayer = {
      ...nextPlayer,
      maxHp,
      hp: Math.min(maxHp, nextPlayer.hp + Math.round(growth.hp * 0.6)),
      atk: nextPlayer.atk + growth.atk,
      def: nextPlayer.def + growth.def,
      crit: clamp(nextPlayer.crit + growth.crit, 0.05, 0.85)
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
  combo: 0,
  hp: Math.min(player.maxHp, player.hp + Math.round(player.maxHp * 0.1))
});

export const getActionDisabledReason = (action: BattleActionId, player: Player): string | null => {
  if (action === 'skill' && player.skillCooldown > 0) {
    return `Skill cooldown: ${player.skillCooldown}`;
  }

  if (action === 'heal' && player.skillCooldown > 0) {
    return `Meditate unavailable (${player.skillCooldown})`;
  }

  return null;
};
