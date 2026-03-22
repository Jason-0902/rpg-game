import { AnimatePresence, motion } from 'framer-motion';
import { BattleLogEntry } from '../types/game';
import Panel from './Panel';

interface BattleLogProps {
  logs: BattleLogEntry[];
}

const rowClassByType: Record<BattleLogEntry['type'], string> = {
  info: 'text-slate-300 border-slate-700/60',
  damage: 'text-orange-200 border-orange-500/30',
  heal: 'text-emerald-200 border-emerald-500/30',
  critical: 'text-fuchsia-200 border-fuchsia-500/40',
  warning: 'text-red-200 border-red-500/35',
  buff: 'text-cyan-200 border-cyan-500/35',
  debuff: 'text-amber-200 border-amber-500/35',
  reward: 'text-yellow-100 border-yellow-500/35'
};

const actorName: Record<BattleLogEntry['actor'], string> = {
  system: '[SYS]',
  player: '[YOU]',
  boss: '[BOSS]'
};

const BattleLog = ({ logs }: BattleLogProps) => {
  const visibleLogs = logs.slice(-18).reverse();

  return (
    <Panel title="Battle Log" subtitle="即時戰鬥紀錄">
      <div className="log-scroll h-[360px] space-y-2 overflow-y-auto pr-2">
        <AnimatePresence initial={false}>
          {visibleLogs.map((log) => (
            <motion.div
              key={log.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className={`rounded-lg border px-3 py-2 text-xs ${rowClassByType[log.type]}`}
            >
              <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-400">
                <span>{actorName[log.actor]}</span>
                <span>Turn {log.turn}</span>
              </div>
              <p>{log.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Panel>
  );
};

export default BattleLog;
