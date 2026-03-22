import { AnimatePresence, motion } from 'framer-motion';
import ActionPanel from './components/ActionPanel';
import ArenaBackdrop from './components/ArenaBackdrop';
import BattleLog from './components/BattleLog';
import ClassSelection from './components/ClassSelection';
import RunSummaryCard from './components/RunSummaryCard';
import StatusPanel from './components/StatusPanel';
import TipConsole from './components/TipConsole';
import TopHud from './components/TopHud';
import UpgradePanel from './components/UpgradePanel';
import { useGameEngine } from './hooks/useGameEngine';

const App = () => {
  const { state, hud, startNewRun, restartRun, runAction, chooseUpgrade } = useGameEngine();

  return (
    <div className="relative min-h-screen pb-8">
      <ArenaBackdrop />

      <AnimatePresence mode="wait">
        {state.phase === 'classSelection' ? (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ClassSelection onSelect={startNewRun} />
            <div className="mx-auto mt-6 w-full max-w-4xl px-4">
              <RunSummaryCard summary={state.lastSummary} />
            </div>
          </motion.div>
        ) : null}

        {state.player && state.boss && state.phase !== 'classSelection' ? (
          <motion.main
            key="battle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto w-full max-w-7xl px-4 py-5"
          >
            <TopHud stageLabel={hud.stageLabel} className={hud.className} bossName={hud.bossName} onRestart={restartRun} />

            <div className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr]">
              <section className="space-y-4">
                <StatusPanel player={state.player} boss={state.boss} />

                {state.phase === 'battle' ? (
                  <ActionPanel
                    player={state.player}
                    disabled={state.actionLock}
                    onAction={runAction}
                  />
                ) : null}

                {state.phase === 'upgrade' ? <UpgradePanel options={state.upgrades} onPick={chooseUpgrade} /> : null}

                {state.phase === 'defeat' ? (
                  <div className="panel">
                    <h3 className="panel-title text-red-200">Run Failed</h3>
                    <p className="mt-2 text-sm text-slate-200">
                      你在 Stage {state.stageLevel} 被擊敗。可以直接重開，或回主畫面更換職業再戰。
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" className="btn-primary" onClick={restartRun}>
                        Back To Class Selection
                      </button>
                    </div>
                  </div>
                ) : null}
              </section>

              <section className="space-y-4">
                <BattleLog logs={state.logs} />
                <TipConsole stageLevel={state.stageLevel} />
                <RunSummaryCard summary={state.lastSummary} />
              </section>
            </div>
          </motion.main>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default App;
