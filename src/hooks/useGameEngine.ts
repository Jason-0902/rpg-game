import { useCallback, useEffect, useMemo, useState } from 'react';
import { CLASS_TEMPLATES } from '../data/classData';
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
      createLog('system', `Run started as ${CLASS_TEMPLATES[classId].name}.`, 'info', 1),
      createLog('system', `A wild ${boss.name}, ${boss.title}, appears.`, 'warning', 1)
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

  const nextStage = useCallback(
    (player: Player, nextLevel: number, logs: BattleLogEntry[]) => {
      const freshPlayer = resetForNextBoss(player);
      const nextBoss = createBossForLevel(nextLevel);

      const stageLogs = appendLogs(logs, [
        createLog('system', `Stage ${nextLevel}: ${nextBoss.name} enters the arena.`, 'warning', 1)
      ]);

      setState((prev) => ({
        ...prev,
        player: freshPlayer,
        boss: nextBoss,
        logs: stageLogs,
        phase: 'battle',
        stageLevel: nextLevel,
        turn: 1,
        upgrades: [],
        actionLock: false
      }));
    },
    []
  );

  const commitDefeat = useCallback((player: Player, stageLevel: number) => {
    const summary: RunSummary = {
      highestLevel: stageLevel,
      bossesDefeated: player.defeatedBosses,
      totalDamageDealt: player.totalDamageDealt,
      totalDamageTaken: player.totalDamageTaken,
      classId: player.classId,
      completedAt: new Date().toISOString()
    };

    saveRunSummary(summary);

    setState((prev) => ({
      ...prev,
      phase: 'defeat',
      lastSummary: summary,
      actionLock: false
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
          const logs = appendLogs(withOutcomeLogs, [
            createLog('system', `Victory! Choose an upgrade before Stage ${prev.stageLevel + 1}.`, 'reward', outcome.turn)
          ]);

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
          const logs = appendLogs(withOutcomeLogs, [
            createLog('system', 'Your journey ends here. Press Restart to begin again.', 'warning', outcome.turn)
          ]);

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

  const chooseUpgrade = useCallback(
    (optionId: string) => {
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
        const logs = appendLogs(prev.logs, [
          createLog('system', `Upgrade acquired: ${selected.title}`, 'reward', prev.turn),
          createLog('system', 'A stronger foe is approaching...', 'warning', prev.turn)
        ]);

        const nextBoss = createBossForLevel(nextLevel);

        return {
          ...prev,
          player: resetForNextBoss(nextPlayer),
          boss: nextBoss,
          logs: appendLogs(logs, [
            createLog('system', `Stage ${nextLevel} starts. ${nextBoss.name} descends.`, 'warning', 1)
          ]),
          stageLevel: nextLevel,
          phase: 'battle',
          turn: 1,
          upgrades: []
        };
      });
    },
    []
  );

  const canLoad = state.phase !== 'classSelection' && Boolean(state.player && state.boss);

  const hud = useMemo(() => {
    if (!state.player || !state.boss) {
      return {
        className: null,
        bossName: null,
        stageLabel: 'Stage 1'
      };
    }

    return {
      className: CLASS_TEMPLATES[state.player.classId].name,
      bossName: `${state.boss.name} - ${state.boss.title}`,
      stageLabel: `Stage ${state.stageLevel}`
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
    chooseUpgrade,
    nextStage,
    commitDefeat
  };
};
