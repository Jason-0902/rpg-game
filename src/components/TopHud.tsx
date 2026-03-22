import { motion } from 'framer-motion';

interface TopHudProps {
  stageLabel: string;
  className: string | null;
  bossName: string | null;
  onRestart: () => void;
}

const TopHud = ({ stageLabel, className, bossName, onRestart }: TopHudProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="level-banner sticky top-0 z-20 mb-4 rounded-2xl p-3 backdrop-blur"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="font-display text-xs uppercase tracking-[0.18em] text-cyan-200">無盡首領試煉</p>
          <h2 className="font-display text-2xl uppercase tracking-[0.2em] text-slate-100">{stageLabel}</h2>
          <p className="text-xs text-slate-300 md:text-sm">
            <span className="text-slate-400">職業：</span> {className ?? '-'} | <span className="text-slate-400">目標：</span>
            {bossName ?? '-'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" className="btn-danger" onClick={onRestart}>
            重新開始
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default TopHud;
