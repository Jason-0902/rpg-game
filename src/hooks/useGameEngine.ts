import { useCallback, useEffect, useMemo, useState } from 'react';
import { CLASS_TEMPLATES } from '../data/classData';
import { createRandomEquipment, createShopOffers } from '../data/equipmentData';
import { rollTravelEvent } from '../data/eventData';
import { getClassTitleByRank, getEvolutionSkillForRank, getSkillById, rollSkillDrop } from '../data/skillData';
import {
  applyVictoryRewards,
  createBossForLevel,
  createLog,
  createPlayerFromClass,
  getActionDisabledReason,
  getBestPotionTier,
  performTurn,
  resetForNextBoss
} from '../logic/battle';
import { clearGameState, loadGameState, loadRunSummary, saveGameState, saveRunSummary } from '../logic/storage';
import {
  BattleActionId,
  BattleLogEntry,
  BattlePhase,
  Boss,
  ClassId,
  EquipmentItem,
  EquipmentSlot,
  EventCard,
  Player,
  PotionTier,
  RewardBundle,
  RunSummary
} from '../types/game';

export interface GameEngineState {
  player: Player | null;
  boss: Boss | null;
  logs: BattleLogEntry[];
  phase: BattlePhase;
  stageLevel: number;
  turn: number;
  actionLock: boolean;
  reward: RewardBundle | null;
  shopOffers: EquipmentItem[];
  travelEvent: EventCard | null;
  lastSummary: RunSummary | null;
}

const INITIAL_STATE: GameEngineState = {
  player: null,
  boss: null,
  logs: [],
  phase: 'classSelection',
  stageLevel: 1,
  turn: 1,
  actionLock: false,
  reward: null,
  shopOffers: [],
  travelEvent: null,
  lastSummary: null
};

const MAX_LOGS = 180;

const appendLogs = (origin: BattleLogEntry[], incoming: BattleLogEntry[]): BattleLogEntry[] => {
  const merged = [...origin, ...incoming];
  return merged.length <= MAX_LOGS ? merged : merged.slice(merged.length - MAX_LOGS);
};

const potionLabel: Record<PotionTier, string> = {
  minor: '初級',
  standard: '中級',
  major: '高級',
  supreme: '頂級'
};

const applyEquipBonus = (player: Player, item: EquipmentItem, sign: 1 | -1): Player => {
  const maxHp = Math.max(1, player.maxHp + (item.bonuses.maxHp ?? 0) * sign);
  const atk = Math.max(1, player.atk + (item.bonuses.atk ?? 0) * sign);
  const def = Math.max(0, player.def + (item.bonuses.def ?? 0) * sign);
  const crit = Math.max(0.05, player.crit + (item.bonuses.crit ?? 0) * sign);

  return {
    ...player,
    maxHp,
    hp: Math.min(maxHp, player.hp),
    atk,
    def,
    crit
  };
};

const equipFromInventory = (player: Player, itemId: string): { player: Player; text: string } => {
  const item = player.inventoryEquipment.find((i) => i.id === itemId);
  if (!item) return { player, text: '找不到要裝備的道具。' };

  let next = { ...player, inventoryEquipment: player.inventoryEquipment.filter((i) => i.id !== itemId) };
  const current = next.equipped[item.slot as EquipmentSlot];

  if (current) {
    next = applyEquipBonus(next, current, -1);
    next.inventoryEquipment = [...next.inventoryEquipment, current];
  }

  next = applyEquipBonus(next, item, 1);
  next.equipped = { ...next.equipped, [item.slot]: item };

  return { player: next, text: `已裝備 ${item.name}。` };
};

const rollPotionDrop = (stage: number): { tier: PotionTier; count: number } | null => {
  if (Math.random() > 0.46) return null;
  if (stage > 120 && Math.random() < 0.16) return { tier: 'supreme', count: 1 };
  if (stage > 70 && Math.random() < 0.27) return { tier: 'major', count: 1 };
  if (stage > 30 && Math.random() < 0.46) return { tier: 'standard', count: 1 };
  return { tier: 'minor', count: 1 };
};

const applyRandomKillGrowth = (player: Player) => {
  const picks = ['atk', 'def', 'crit', 'maxHp'] as const;
  const count = 1 + Math.floor(Math.random() * 4);
  const shuffled = [...picks].sort(() => Math.random() - 0.5).slice(0, count);

  let next = { ...player };
  const lines: string[] = [];

  for (const k of shuffled) {
    if (k === 'atk') {
      const v = 1 + Math.floor(Math.random() * 20);
      next.atk += v;
      lines.push(`攻擊 +${v}`);
    }
    if (k === 'def') {
      const v = 5 + Math.floor(Math.random() * 46);
      next.def += v;
      lines.push(`防禦 +${v}`);
    }
    if (k === 'crit') {
      const v = 1 + Math.floor(Math.random() * 10);
      next.crit += v / 100;
      lines.push(`爆擊率 +${v}%`);
    }
    if (k === 'maxHp') {
      const v = 10 + Math.floor(Math.random() * 91);
      next.maxHp += v;
      next.hp = Math.min(next.maxHp, next.hp + Math.round(v * 0.45));
      lines.push(`最大生命 +${v}`);
    }
  }

  return { player: next, lines };
};

const evolveClassIfNeeded = (player: Player) => {
  const targetRank = Math.floor(player.level / 50);
  if (targetRank <= player.classRank) {
    return { player, logs: [] as string[] };
  }

  let next = { ...player };
  const logs: string[] = [];
  for (let rank = player.classRank + 1; rank <= targetRank; rank += 1) {
    next.classRank = rank;
    next.classTitle = getClassTitleByRank(next.classId, rank);
    logs.push(`職業進階：${next.classTitle}`);

    const evoSkill = getEvolutionSkillForRank(next.classId, rank);
    if (evoSkill && !next.unlockedSkillIds.includes(evoSkill.id)) {
      next.unlockedSkillIds = [...next.unlockedSkillIds, evoSkill.id];
      next.activeSkillId = evoSkill.id;
      logs.push(`獲得進階技能：${evoSkill.name}`);
    }
  }

  return { player: next, logs };
};

const getStageModeLabel = (stage: number) => {
  if (stage > 1000) return '天界';
  if (stage > 500) return '深淵';
  if (stage <= 50) return '新手村';
  return '地表';
};

const generateReward = (player: Player, stage: number, statGrowths: string[]): RewardBundle => {
  const money = Math.round(22 + stage * 7 + Math.random() * 18);
  const p = rollPotionDrop(stage);
  const equipment = Math.random() < 0.44 ? createRandomEquipment(stage) : null;
  const skill = rollSkillDrop(player.classId, player.unlockedSkillIds);

  return {
    money,
    potionTier: p?.tier ?? null,
    potionCount: p?.count ?? 0,
    statGrowths,
    equipment,
    skill
  };
};

const applyTemporaryDebuff = (player: Player, name: string, atkPenalty: number, defPenalty: number, critPenalty: number, turns: number): Player => ({
  ...player,
  temporaryDebuff: {
    name,
    atkPenalty,
    defPenalty,
    critPenalty,
    remainingTurns: turns
  }
});

const addUniqueSkill = (player: Player, skillId: string): Player => {
  if (player.unlockedSkillIds.includes(skillId)) return player;
  return { ...player, unlockedSkillIds: [...player.unlockedSkillIds, skillId], activeSkillId: skillId };
};

export const useGameEngine = () => {
  const [state, setState] = useState<GameEngineState>(INITIAL_STATE);

  useEffect(() => {
    const summary = loadRunSummary();
    setState((prev) => ({ ...prev, lastSummary: summary }));

    const loaded = loadGameState();
    if (!loaded) return;

    setState((prev) => ({
      ...prev,
      player: loaded.snapshot.player,
      boss: loaded.snapshot.boss,
      logs: loaded.snapshot.logs,
      turn: loaded.snapshot.turn,
      phase: loaded.snapshot.phase,
      stageLevel: loaded.snapshot.level,
      reward: loaded.snapshot.reward,
      shopOffers: loaded.snapshot.shopOffers,
      travelEvent: loaded.snapshot.travelEvent
    }));
  }, []);

  useEffect(() => {
    if (!state.player || !state.boss) return;

    saveGameState({
      player: state.player,
      boss: state.boss,
      logs: state.logs,
      turn: state.turn,
      phase: state.phase,
      level: state.stageLevel,
      reward: state.reward,
      shopOffers: state.shopOffers,
      travelEvent: state.travelEvent
    });
  }, [state]);

  const startNewRun = useCallback((classId: ClassId) => {
    const player = createPlayerFromClass(classId);
    const boss = createBossForLevel(1, player.alignment);

    setState((prev) => ({
      ...prev,
      player,
      boss,
      logs: [
        createLog('system', `你選擇了「${CLASS_TEMPLATES[classId].name}」，旅程開始。`, 'info', 1),
        createLog('system', `${boss.emoji} ${boss.name} 出現。`, 'warning', 1)
      ],
      phase: 'battle',
      stageLevel: 1,
      turn: 1,
      reward: null,
      shopOffers: [],
      travelEvent: null
    }));
  }, []);

  const restartRun = useCallback(() => {
    clearGameState();
    setState((prev) => ({ ...INITIAL_STATE, lastSummary: prev.lastSummary }));
  }, []);

  const runAction = useCallback((action: BattleActionId) => {
    setState((prev) => {
      if (!prev.player || !prev.boss || prev.phase !== 'battle' || prev.actionLock) return prev;

      if (action === 'heal' && !getBestPotionTier(prev.player)) {
        return {
          ...prev,
          logs: appendLogs(prev.logs, [createLog('system', '沒有藥水可使用。', 'warning', prev.turn)])
        };
      }

      const reason = getActionDisabledReason(action, prev.player);
      if (reason) {
        return {
          ...prev,
          logs: appendLogs(prev.logs, [createLog('system', reason, 'info', prev.turn)])
        };
      }

      const outcome = performTurn(action, prev.player, prev.boss, prev.turn);
      const withOutcomeLogs = appendLogs(prev.logs, outcome.logs);

      if (outcome.phase === 'reward') {
        let progressed = applyVictoryRewards(outcome.player, outcome.boss);
        const growth = applyRandomKillGrowth(progressed);
        progressed = growth.player;

        const evolved = evolveClassIfNeeded(progressed);
        progressed = evolved.player;

        const bundle = generateReward(progressed, prev.stageLevel, growth.lines);
        let rewarded = { ...progressed, gold: progressed.gold + bundle.money };
        const rewardLogs: BattleLogEntry[] = [
          createLog('system', `獲得金錢 ${bundle.money}。`, 'reward', outcome.turn),
          createLog('system', `本次成長：${growth.lines.join('、')}`, 'buff', outcome.turn)
        ];

        if (evolved.logs.length > 0) {
          evolved.logs.forEach((line) => {
            rewardLogs.push(createLog('system', line, 'reward', outcome.turn));
          });
        }

        if (bundle.potionTier && bundle.potionCount > 0) {
          rewarded = {
            ...rewarded,
            potions: {
              ...rewarded.potions,
              [bundle.potionTier]: rewarded.potions[bundle.potionTier] + bundle.potionCount
            }
          };
          rewardLogs.push(createLog('system', `獲得${potionLabel[bundle.potionTier]}藥水 x${bundle.potionCount}。`, 'heal', outcome.turn));
        }

        if (bundle.equipment) {
          rewarded = { ...rewarded, inventoryEquipment: [...rewarded.inventoryEquipment, bundle.equipment] };
          rewardLogs.push(createLog('system', `掉落裝備：${bundle.equipment.name}`, 'reward', outcome.turn));
        }

        if (bundle.skill && !rewarded.unlockedSkillIds.includes(bundle.skill.id)) {
          rewarded = {
            ...rewarded,
            unlockedSkillIds: [...rewarded.unlockedSkillIds, bundle.skill.id],
            activeSkillId: bundle.skill.id
          };
          rewardLogs.push(createLog('system', `學會新技能：${bundle.skill.name}`, 'reward', outcome.turn));
        }

        return {
          ...prev,
          player: rewarded,
          boss: outcome.boss,
          logs: appendLogs(withOutcomeLogs, rewardLogs),
          phase: 'reward',
          turn: outcome.turn,
          reward: bundle,
          shopOffers: [],
          travelEvent: null
        };
      }

      if (outcome.phase === 'defeat') {
        const summary: RunSummary = {
          highestLevel: prev.stageLevel,
          bossesDefeated: outcome.player.defeatedBosses,
          totalDamageDealt: outcome.player.totalDamageDealt,
          totalDamageTaken: outcome.player.totalDamageTaken,
          classId: outcome.player.classId,
          completedAt: new Date().toISOString()
        };
        saveRunSummary(summary);

        return {
          ...prev,
          player: outcome.player,
          boss: outcome.boss,
          logs: appendLogs(withOutcomeLogs, [createLog('system', '你倒下了，旅程結束。', 'warning', outcome.turn)]),
          phase: 'defeat',
          turn: outcome.turn,
          lastSummary: summary
        };
      }

      return {
        ...prev,
        player: outcome.player,
        boss: outcome.boss,
        logs: withOutcomeLogs,
        phase: 'battle',
        turn: outcome.turn
      };
    });
  }, []);

  const proceedAfterReward = useCallback(() => {
    setState((prev) => {
      if (!prev.player || !prev.boss) return prev;

      if (Math.random() < 0.09) {
        return {
          ...prev,
          phase: 'shop',
          shopOffers: createShopOffers(prev.stageLevel + 1),
          reward: null,
          logs: appendLogs(prev.logs, [createLog('system', '旅行商人隨機出現。', 'info', prev.turn)])
        };
      }

      const ev = rollTravelEvent(prev.stageLevel, prev.player.alignment);
      if (ev) {
        return {
          ...prev,
          phase: 'event',
          travelEvent: ev,
          reward: null,
          logs: appendLogs(prev.logs, [createLog('system', `遭遇事件：${ev.title}`, 'info', prev.turn)])
        };
      }

      const nextLevel = prev.stageLevel + 1;
      const nextBoss = createBossForLevel(nextLevel, prev.player.alignment);
      const mode = getStageModeLabel(nextLevel);
      const warning = nextBoss.isBoss
        ? `【${mode}】第 ${nextLevel} 層 Boss 出現：${nextBoss.emoji} ${nextBoss.name}`
        : `【${mode}】第 ${nextLevel} 隻怪物：${nextBoss.emoji} ${nextBoss.name}`;
      return {
        ...prev,
        player: resetForNextBoss(prev.player),
        boss: nextBoss,
        stageLevel: nextLevel,
        phase: 'battle',
        turn: 1,
        reward: null,
        logs: appendLogs(prev.logs, [createLog('system', warning, 'warning', 1)])
      };
    });
  }, []);

  const buyFromShop = useCallback((itemId: string) => {
    setState((prev) => {
      if (!prev.player || prev.phase !== 'shop') return prev;
      const target = prev.shopOffers.find((i) => i.id === itemId);
      if (!target) return prev;
      if (prev.player.gold < target.price) {
        return { ...prev, logs: appendLogs(prev.logs, [createLog('system', '金錢不足。', 'warning', prev.turn)]) };
      }

      return {
        ...prev,
        player: {
          ...prev.player,
          gold: prev.player.gold - target.price,
          inventoryEquipment: [...prev.player.inventoryEquipment, target]
        },
        shopOffers: prev.shopOffers.filter((i) => i.id !== itemId),
        logs: appendLogs(prev.logs, [createLog('system', `購買 ${target.name} 成功。`, 'reward', prev.turn)])
      };
    });
  }, []);

  const leaveShop = useCallback(() => {
    setState((prev) => {
      if (!prev.player) return prev;
      const ev = rollTravelEvent(prev.stageLevel, prev.player.alignment);
      if (ev) {
        return { ...prev, phase: 'event', travelEvent: ev, shopOffers: [] };
      }

      const nextLevel = prev.stageLevel + 1;
      const nextBoss = createBossForLevel(nextLevel, prev.player.alignment);
      return {
        ...prev,
        player: resetForNextBoss(prev.player),
        boss: nextBoss,
        stageLevel: nextLevel,
        phase: 'battle',
        turn: 1,
        shopOffers: [],
        logs: appendLogs(prev.logs, [createLog('system', `【${getStageModeLabel(nextLevel)}】前方出現：${nextBoss.emoji} ${nextBoss.name}`, 'warning', 1)])
      };
    });
  }, []);

  const resolveEvent = useCallback(() => {
    setState((prev) => {
      if (!prev.player || !prev.travelEvent) return prev;

      let player = { ...prev.player };
      const e = prev.travelEvent;
      let logText = '';
      const eventLogs: BattleLogEntry[] = [];

      if (e.id === 'ev_gold_shrine') {
        const gain = 45 + prev.stageLevel * 5;
        player.gold += gain;
        logText = `你獲得 ${gain} 金錢。`;
      } else if (e.id === 'ev_skill_scroll') {
        const skill = rollSkillDrop(player.classId, player.unlockedSkillIds);
        if (skill) {
          player.unlockedSkillIds.push(skill.id);
          player.activeSkillId = skill.id;
          logText = `你習得了技能 ${skill.name}。`;
        } else {
          player.potions.standard += 1;
          logText = '你得到中級藥水 x1。';
        }
      } else if (e.id === 'ev_bless_armor') {
        player.maxHp += 20;
        player.hp = Math.min(player.maxHp, player.hp + 20);
        player.def += 3;
        logText = '祝福使你最大生命 +20、防禦 +3（永久）。';
      } else if (e.id === 'ev_lucky_cache') {
        const luckyGold = 80 + prev.stageLevel * 8;
        player.gold += luckyGold;
        player.potions.major += 1;
        if (Math.random() < 0.45) {
          player.inventoryEquipment.push(createRandomEquipment(prev.stageLevel + 30));
        }
        logText = `你獲得補給：金錢 +${luckyGold}、高級藥水 x1。`;
      } else if (e.id === 'ev_poison_mist') {
        player = applyTemporaryDebuff(player, '毒霧侵蝕', 8, 10, 0.08, 4);
        logText = '毒霧造成暫時弱化（4 回合）：攻擊、防禦與爆擊下降。';
      } else if (e.id === 'ev_bandit_tax') {
        const loss = Math.min(player.gold, 40 + prev.stageLevel * 3);
        player.gold -= loss;
        logText = `你被搶走 ${loss} 金錢。`;
      } else if (e.id === 'ev_curse_stone') {
        player = applyTemporaryDebuff(player, '詛咒枷鎖', 10, 8, 0.12, 5);
        logText = '詛咒纏身（5 回合）：攻擊、防禦與爆擊率暫時下降。';
      } else if (e.id === 'ev_abyss_relic') {
        player.inventoryEquipment.push(createRandomEquipment(prev.stageLevel + 120));
        player.gold += 120 + prev.stageLevel * 10;
        logText = '你獲得深淵遺珍裝備與大量金錢。';
      } else if (e.id === 'ev_abyss_whisper') {
        player = applyTemporaryDebuff(player, '深淵低語', 14, 12, 0.1, 6);
        logText = '深淵低語干擾心智（6 回合）：戰鬥能力下降。';
      } else if (e.id === 'ev_heaven_oracle') {
        player.maxHp += 80;
        player.hp = Math.min(player.maxHp, player.hp + 80);
        player.atk += 22;
        player.def += 18;
        player.crit += 0.12;
        player.potions.supreme += 1;
        logText = '天界神諭降臨：能力大幅永久提升，並獲得頂級藥水。';
      } else if (e.id === 'ev_astral_trial') {
        player.gold += 220 + prev.stageLevel * 12;
        player.inventoryEquipment.push(createRandomEquipment(prev.stageLevel + 180));
        player.inventoryEquipment.push(createRandomEquipment(prev.stageLevel + 140));
        logText = '你通過星律試煉，獲得雙裝備獎勵與鉅額金錢。';
      } else if (e.id === 'ev_divine_luminara') {
        player.maxHp += 120;
        player.hp = Math.min(player.maxHp, player.hp + 120);
        player.atk += 30;
        player.def += 24;
        player.crit += 0.2;
        player = addUniqueSkill(player, `${player.classId}_divine_luminara`);
        logText = '曜星女神「露米娜菈」加護：全屬性大幅永久提升。';
      } else if (e.id === 'ev_divine_elysion') {
        player.maxHp += 140;
        player.hp = Math.min(player.maxHp, player.hp + 140);
        player.atk += 28;
        player.def += 20;
        player.crit += 0.18;
        player = addUniqueSkill(player, `${player.classId}_astral_elysion`);
        logText = '銀弦天琴座「艾莉希昂」賜福：獲得星域之力。';
      } else if (e.id.startsWith('ev_demon_contract_')) {
        const contractAccepted = Math.random() < 0.58;
        if (contractAccepted) {
          player.alignment = 'demon';
          player.maxHp += 160;
          player.hp = Math.min(player.maxHp, player.hp + 160);
          player.atk += 38;
          player.def += 22;
          player.crit += 0.24;
          player = addUniqueSkill(player, `${player.classId}_demon_pact`);
          logText = `你與惡魔簽約成功，獲得禁忌之力。從此人類將視你為敵。`;
        } else {
          player.maxHp += 40;
          player.hp = Math.min(player.maxHp, player.hp + 40);
          player.atk += 8;
          player.def += 6;
          logText = '你拒絕簽約並全身而退，仍帶回少量惡魔之力。';
        }
      }

      const nextLevel = prev.stageLevel + 1;
      const nextBoss = createBossForLevel(nextLevel, player.alignment);
      eventLogs.push(createLog('system', logText, e.polarity === 'positive' ? 'reward' : 'warning', prev.turn));
      if (player.temporaryDebuff) {
        eventLogs.push(
          createLog(
            'system',
            `負面效果：${player.temporaryDebuff.name}（剩餘 ${player.temporaryDebuff.remainingTurns} 回合）`,
            'debuff',
            prev.turn
          )
        );
      }
      if (player.alignment === 'demon' && prev.player.alignment !== 'demon') {
        eventLogs.push(createLog('system', '你已墮入魔契陣營，後續敵人將轉為人類討伐隊。', 'warning', prev.turn));
      }

      return {
        ...prev,
        player: resetForNextBoss(player),
        boss: nextBoss,
        stageLevel: nextLevel,
        phase: 'battle',
        turn: 1,
        travelEvent: null,
        logs: appendLogs(prev.logs, eventLogs)
      };
    });
  }, []);

  const equipItem = useCallback((itemId: string) => {
    setState((prev) => {
      if (!prev.player) return prev;
      const res = equipFromInventory(prev.player, itemId);
      return {
        ...prev,
        player: res.player,
        logs: appendLogs(prev.logs, [createLog('system', res.text, 'info', prev.turn)])
      };
    });
  }, []);

  const setActiveSkill = useCallback((skillId: string) => {
    setState((prev) => {
      if (!prev.player || !prev.player.unlockedSkillIds.includes(skillId)) return prev;
      const skill = getSkillById(skillId);
      return {
        ...prev,
        player: { ...prev.player, activeSkillId: skillId },
        logs: appendLogs(prev.logs, [createLog('system', `目前技能切換為：${skill?.name ?? skillId}`, 'info', prev.turn)])
      };
    });
  }, []);

  const hud = useMemo(() => {
    if (!state.player || !state.boss) {
      return { className: null, bossName: null, stageLabel: '第 1 層' };
    }

    return {
      className: `${state.player.classTitle} (${CLASS_TEMPLATES[state.player.classId].name})`,
      bossName: `${state.boss.emoji} ${state.boss.name}・${state.boss.title}`,
      stageLabel: state.boss.isBoss ? `第 ${state.stageLevel} 層 Boss` : `第 ${state.stageLevel} 層`
    };
  }, [state.player, state.boss, state.stageLevel]);

  return {
    state,
    hud,
    startNewRun,
    restartRun,
    runAction,
    proceedAfterReward,
    buyFromShop,
    leaveShop,
    resolveEvent,
    equipItem,
    setActiveSkill
  };
};


