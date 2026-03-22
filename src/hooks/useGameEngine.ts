import { useCallback, useEffect, useMemo, useState } from 'react';
import { CLASS_TEMPLATES } from '../data/classData';
import { createRandomEquipment, createShopOffers } from '../data/equipmentData';
import { rollTravelEvent } from '../data/eventData';
import { getSkillById, rollSkillDrop } from '../data/skillData';
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
  if (Math.random() > 0.45) return null;
  if (stage > 90 && Math.random() < 0.12) return { tier: 'supreme', count: 1 };
  if (stage > 55 && Math.random() < 0.22) return { tier: 'major', count: 1 };
  if (stage > 25 && Math.random() < 0.42) return { tier: 'standard', count: 1 };
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
      next.hp = Math.min(next.maxHp, next.hp + Math.round(v * 0.5));
      lines.push(`最大生命 +${v}`);
    }
  }

  return { player: next, lines };
};

const generateReward = (player: Player, stage: number): RewardBundle => {
  const money = Math.round(22 + stage * 7 + Math.random() * 18);
  const p = rollPotionDrop(stage);
  const equipment = Math.random() < 0.44 ? createRandomEquipment(stage) : null;
  const skill = rollSkillDrop(player.classId, player.unlockedSkillIds);

  return {
    money,
    potionTier: p?.tier ?? null,
    potionCount: p?.count ?? 0,
    equipment,
    skill
  };
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
    const boss = createBossForLevel(1);

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

        const bundle = generateReward(progressed, prev.stageLevel);
        let rewarded = { ...progressed, gold: progressed.gold + bundle.money };
        const rewardLogs: BattleLogEntry[] = [
          createLog('system', `獲得金錢 ${bundle.money}。`, 'reward', outcome.turn),
          createLog('system', `擊殺成長：${growth.lines.join('、')}`, 'buff', outcome.turn)
        ];

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

        if (bundle.skill) {
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

      if (Math.random() < 0.33) {
        return {
          ...prev,
          phase: 'shop',
          shopOffers: createShopOffers(prev.stageLevel + 1),
          reward: null,
          logs: appendLogs(prev.logs, [createLog('system', '旅行商人隨機出現。', 'info', prev.turn)])
        };
      }

      const ev = rollTravelEvent();
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
      const nextBoss = createBossForLevel(nextLevel);
      return {
        ...prev,
        player: resetForNextBoss(prev.player),
        boss: nextBoss,
        stageLevel: nextLevel,
        phase: 'battle',
        turn: 1,
        reward: null,
        logs: appendLogs(prev.logs, [createLog('system', `第 ${nextLevel} 隻怪物：${nextBoss.emoji} ${nextBoss.name}`, 'warning', 1)])
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
      const ev = rollTravelEvent();
      if (ev) {
        return { ...prev, phase: 'event', travelEvent: ev, shopOffers: [] };
      }

      const nextLevel = prev.stageLevel + 1;
      const nextBoss = createBossForLevel(nextLevel);
      return {
        ...prev,
        player: resetForNextBoss(prev.player),
        boss: nextBoss,
        stageLevel: nextLevel,
        phase: 'battle',
        turn: 1,
        shopOffers: [],
        logs: appendLogs(prev.logs, [createLog('system', `前方出現：${nextBoss.emoji} ${nextBoss.name}`, 'warning', 1)])
      };
    });
  }, []);

  const resolveEvent = useCallback(() => {
    setState((prev) => {
      if (!prev.player || !prev.travelEvent) return prev;

      let player = { ...prev.player };
      const e = prev.travelEvent;
      let logText = '';

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
        logText = '祝福使你最大生命 +20、防禦 +3。';
      } else if (e.id === 'ev_poison_mist') {
        player.atk = Math.max(1, player.atk - 3);
        player.def = Math.max(0, player.def - 2);
        logText = '毒霧讓你攻擊 -3、防禦 -2。';
      } else if (e.id === 'ev_bandit_tax') {
        const loss = Math.min(player.gold, 40 + prev.stageLevel * 3);
        player.gold -= loss;
        logText = `你被搶走 ${loss} 金錢。`;
      } else if (e.id === 'ev_curse_stone') {
        player.maxHp = Math.max(1, player.maxHp - 18);
        player.hp = Math.min(player.hp, player.maxHp);
        player.crit = Math.max(0.05, player.crit - 0.03);
        logText = '詛咒使你最大生命 -18、爆擊率 -3%。';
      }

      const nextLevel = prev.stageLevel + 1;
      const nextBoss = createBossForLevel(nextLevel);
      return {
        ...prev,
        player: resetForNextBoss(player),
        boss: nextBoss,
        stageLevel: nextLevel,
        phase: 'battle',
        turn: 1,
        travelEvent: null,
        logs: appendLogs(prev.logs, [createLog('system', logText, e.polarity === 'positive' ? 'reward' : 'warning', prev.turn)])
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
      return { className: null, bossName: null, stageLabel: '第 1 隻怪物' };
    }

    return {
      className: CLASS_TEMPLATES[state.player.classId].name,
      bossName: `${state.boss.emoji} ${state.boss.name}・${state.boss.title}`,
      stageLabel: `第 ${state.stageLevel} 隻怪物`
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
