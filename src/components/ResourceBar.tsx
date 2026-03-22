import { motion } from 'framer-motion';

interface ResourceBarProps {
  value: number;
  max: number;
  color: 'hp' | 'mana' | 'shield' | 'danger';
  label: string;
  showValue?: boolean;
}

const palette = {
  hp: 'from-emerald-400 to-emerald-600 hp-glow',
  mana: 'from-cyan-400 to-sky-600',
  shield: 'from-indigo-400 to-indigo-600',
  danger: 'from-rose-400 to-rose-600 boss-glow'
};

const ResourceBar = ({ value, max, color, label, showValue = true }: ResourceBarProps) => {
  const percent = max <= 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-slate-300">
        <span>{label}</span>
        {showValue ? (
          <span className="font-display text-[11px] uppercase tracking-wide text-slate-200">
            {Math.round(value)} / {Math.round(max)}
          </span>
        ) : null}
      </div>
      <div className="bar-shell">
        <motion.div
          className={`bar-fill bg-gradient-to-r ${palette[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export default ResourceBar;
