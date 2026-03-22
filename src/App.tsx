import { AnimatePresence, motion } from 'framer-motion';
import ActionPanel from './components/ActionPanel';
import ArenaBackdrop from './components/ArenaBackdrop';
import BattleLog from './components/BattleLog';
import ClassSelection from './components/ClassSelection';
import EventPanel from './components/EventPanel';
import InventoryPanel from './components/InventoryPanel';
import RewardPanel from './components/RewardPanel';
import RunSummaryCard from './components/RunSummaryCard';
import ShopPanel from './components/ShopPanel';
import StatusPanel from './components/StatusPanel';
import TopHud from './components/TopHud';
import { useGameEngine } from './hooks/useGameEngine';

const App = () => {
  const {
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
  } = useGameEngine();

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

                {state.phase === 'battle' ? <ActionPanel player={state.player} disabled={state.actionLock} onAction={runAction} /> : null}

                {state.phase === 'reward' && state.reward ? <RewardPanel reward={state.reward} onContinue={proceedAfterReward} /> : null}

                {state.phase === 'shop' ? (
                  <ShopPanel gold={state.player.gold} offers={state.shopOffers} onBuy={buyFromShop} onLeave={leaveShop} />
                ) : null}

                {state.phase === 'event' && state.travelEvent ? <EventPanel eventCard={state.travelEvent} onResolve={resolveEvent} /> : null}

                {state.phase === 'defeat' ? (
                  <div className="panel">
                    <h3 className="panel-title text-red-200">挑戰失敗</h3>
                    <p className="mt-2 text-sm text-slate-200">你在第 {state.stageLevel} 隻怪物前倒下。重新開始後可以再挑戰。</p>
                    <button type="button" className="btn-primary mt-4" onClick={restartRun}>
                      返回職業選擇
                    </button>
                  </div>
                ) : null}
              </section>

              <section className="space-y-4">
                <InventoryPanel player={state.player} onEquip={equipItem} onSelectSkill={setActiveSkill} />
                <BattleLog logs={state.logs} />
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
