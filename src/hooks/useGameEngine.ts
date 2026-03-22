import { useCallback, useEffect, useMemo, useState } from 'react';
import { CLASS_TEMPLATES } from '../data/classData';
import { getUpgradeZh } from '../data/upgradeTextsZh';
import { createUpgradeOptions, upgradeOptionsToMetadata } from '../data/upgradePool';
import {
  applyVictoryRewards,
  createBossForLevel,
  createLog,
  createPlayerFromClass,
  getActionDisabledReason,
  performTurn,
  resetForNextBoss
} from '../logic/battle';
import { clearGameState, loadGameState, loadRunSummary, saveGameState, saveRunSummary } from '../logic/storage';
import { createSeededRng } from '../logic/utils';
import {
  BattleActionId,
  BattleLogEntry,
  BattlePhase,
  Boss,
  ClassId,
  Player,
  RunSummary,
  UpgradeOption
} from '../types/game';

export interface GameEngineState {
  player: Player | null;
  boss: Boss | null;
  logs: BattleLogEntry[];
  phase: BattlePhase;
  stageLevel: number;
  turn: number;
  upgrades: UpgradeOption[];
  actionLock: boolean;
  lastSummary: RunSummary | null;
}

const INITIAL_STATE: GameEngineState = {
  player: null,
  boss: null,
  logs: [],
  phase: 'classSelection',
  stageLevel: 1,
  turn: 1,
  upgrades: [],
  actionLock: false,
  lastSummary: null
};

const MAX_LOGS = 120;

const appendLogs = (origin: BattleLogEntry[], incoming: BattleLogEntry[]): BattleLogEntry[] => {
  const merged = [...origin, ...incoming];
  if (merged.length <= MAX_LOGS) {
    return merged;
  }

  return merged.slice(merged.length - MAX_LOGS);
};

export const useGameEngine = () => {
  const [state, setState] = useState<GameEngineState>(INITIAL_STATE);
  const [seed, setSeed] = useState<number>(() => Date.now());
  const rng = useMemo(() => createSeededRng(seed), [seed]);

  useEffect(() => {
    const summary = loadRunSummary();
    setState((prev) => ({ ...prev, lastSummary: summary }));

    const loaded = loadGameState();
    if (!loaded) {
      return;
    }

    setState((prev) => ({
      ...prev,
      player: loaded.snapshot.player,
      boss: loaded.snapshot.boss,
      logs: loaded.snapshot.logs,
      turn: loaded.snapshot.turn,
      phase: loaded.snapshot.phase,
      stageLevel: loaded.snapshot.level,
      upgrades: loaded.offeredUpgrades
    }));
  }, []);

  useEffect(() => {
    if (!state.player || !state.boss) {
      return;
    }

    saveGameState(
      {
        player: state.player,
        boss: state.boss,
        logs: state.logs,
        turn: state.turn,
        phase: state.phase,
        level: state.stageLevel
      },
      upgradeOptionsToMetadata(state.upgrades)
    );
  }, [state.player, state.boss, state.logs, state.turn, state.phase, state.stageLevel, state.upgrades]);

  const startNewRun = useCallback((classId: ClassId) => {
    const player = createPlayerFromClass(classId);
    const boss = createBossForLevel(1);
    const logs = [
      createLog('system', `你選擇了「${CLASS_TEMPLATES[classId].name}」，試煉開始。`, 'info', 1),
      createLog('system', `${boss.emoji} ${boss.name}（${boss.title}）現身了！`, 'warning', 1)
    ];

    setSeed(Date.now());
    setState((prev) => ({
      ...prev,
      player,
      boss,
      logs,
      phase: 'battle',
      stageLevel: 1,
      turn: 1,
      upgrades: [],
      actionLock: false
    }));
  }, []);

  const restartRun = useCallback(() => {
    clearGameState();
    setSeed(Date.now());
    setState((prev) => ({
      ...INITIAL_STATE,
      lastSummary: prev.lastSummary
    }));
  }, []);

  const runAction = useCallback(
    (action: BattleActionId) => {
      setState((prev) => {
        if (!prev.player || !prev.boss || prev.phase !== 'battle' || prev.actionLock) {
          return prev;
        }

        const reason = getActionDisabledReason(action, prev.player);
        if (reason) {
          const logs = appendLogs(prev.logs, [createLog('system', reason, 'info', prev.turn)]);
          return {
            ...prev,
            logs
          };
        }

        const outcome = performTurn(action, prev.player, prev.boss, prev.turn);
        const withOutcomeLogs = appendLogs(prev.logs, outcome.logs);

        if (outcome.phase === 'upgrade') {
          const rewardedPlayer = applyVictoryRewards(outcome.player, outcome.boss);
          const options = createUpgradeOptions(rewardedPlayer, rng, 3);
          const logs = appendLogs(withOutcomeLogs, [createLog('system', `勝利！請在進入第 ${prev.stageLevel + 1} 層前選擇一項升級。`, 'reward', outcome.turn)]);

          return {
            ...prev,
            player: rewardedPlayer,
            boss: outcome.boss,
            logs,
            phase: 'upgrade',
            turn: outcome.turn,
            upgrades: options,
            actionLock: false
          };
        }

        if (outcome.phase === 'defeat') {
          const logs = appendLogs(withOutcomeLogs, [createLog('system', '你的旅程在此結束，按下重新開始可再戰。', 'warning', outcome.turn)]);

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
            logs,
            phase: 'defeat',
            turn: outcome.turn,
            actionLock: false,
            lastSummary: summary
          };
        }

        return {
          ...prev,
          player: outcome.player,
          boss: outcome.boss,
          logs: withOutcomeLogs,
          phase: outcome.phase,
          turn: outcome.turn,
          actionLock: false
        };
      });
    },
    [rng]
  );

  const chooseUpgrade = useCallback((optionId: string) => {
    setState((prev) => {
      if (prev.phase !== 'upgrade' || !prev.player) {
        return prev;
      }

      const selected = prev.upgrades.find((item) => item.id === optionId);
      if (!selected) {
        return prev;
      }

      const nextPlayer = selected.apply(prev.player);
      const nextLevel = prev.stageLevel + 1;
      const zh = getUpgradeZh(selected.id, selected.title, selected.description);
      const logs = appendLogs(prev.logs, [
        createLog('system', `已獲得升級：「${zh.title}」`, 'reward', prev.turn),
        createLog('system', '更強的敵人正在逼近…', 'warning', prev.turn)
      ]);

      const nextBoss = createBossForLevel(nextLevel);

      return {
        ...prev,
        player: resetForNextBoss(nextPlayer),
        boss: nextBoss,
        logs: appendLogs(logs, [createLog('system', `第 ${nextLevel} 層開始！${nextBoss.emoji} ${nextBoss.name} 降臨。`, 'warning', 1)]),
        stageLevel: nextLevel,
        phase: 'battle',
        turn: 1,
        upgrades: []
      };
    });
  }, []);

  const canLoad = state.phase !== 'classSelection' && Boolean(state.player && state.boss);

  const hud = useMemo(() => {
    if (!state.player || !state.boss) {
      return {
        className: null,
        bossName: null,
        stageLabel: '第 1 層'
      };
    }

    return {
      className: CLASS_TEMPLATES[state.player.classId].name,
      bossName: `${state.boss.emoji} ${state.boss.name}・${state.boss.title}`,
      stageLabel: `第 ${state.stageLevel} 層`
    };
  }, [state.player, state.boss, state.stageLevel]);

  const actionAvailability = useMemo(() => {
    if (!state.player || state.phase !== 'battle') {
      return {
        attack: false,
        guard: false,
        skill: false,
        heal: false
      };
    }

    return {
      attack: true,
      guard: true,
      skill: state.player.skillCooldown <= 0,
      heal: state.player.skillCooldown <= 0
    };
  }, [state.player, state.phase]);

  return {
    state,
    hud,
    canLoad,
    actionAvailability,
    startNewRun,
    restartRun,
    runAction,
    chooseUpgrade
  };
};
