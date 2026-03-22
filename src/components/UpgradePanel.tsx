import { motion } from 'framer-motion';
import { getUpgradeZh } from '../data/upgradeTextsZh';
import { rarityClass } from '../logic/utils';
import { UpgradeOption } from '../types/game';
import Panel from './Panel';

interface UpgradePanelProps {
  options: UpgradeOption[];
  onPick: (id: string) => void;
}

const rarityLabel = {
  common: '普通',
  rare: '稀有',
  epic: '史詩'
};

const UpgradePanel = ({ options, onPick }: UpgradePanelProps) => {
  return (
    <Panel title="選擇升級" subtitle="擊敗首領後獲得一項增強，選擇你的下一步策略。">
      <div className="grid gap-3 md:grid-cols-3">
        {options.map((option, index) => {
          const zh = getUpgradeZh(option.id, option.title, option.description);
          return (
            <motion.button
              key={option.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className={`rounded-xl border p-4 text-left transition-all ${rarityClass(option.rarity)}`}
              onClick={() => onPick(option.id)}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-md border border-slate-500/60 bg-slate-800/80 px-2 py-1 font-display text-[11px] tracking-wider text-slate-100">
                  {option.icon}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-slate-300">{rarityLabel[option.rarity]}</span>
              </div>
              <h4 className="font-display text-lg uppercase tracking-[0.1em] text-slate-50">{zh.title}</h4>
              <p className="mt-2 text-sm text-slate-200">{zh.description}</p>
            </motion.button>
          );
        })}
      </div>
    </Panel>
  );
};

export default UpgradePanel;

