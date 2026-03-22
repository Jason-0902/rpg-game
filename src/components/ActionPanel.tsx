import { motion } from 'framer-motion';
import { BattleActionId, Player } from '../types/game';
import Panel from './Panel';

interface ActionPanelProps {
  player: Player;
  disabled: boolean;
  onAction: (action: BattleActionId) => void;
}

const actions: {
  id: BattleActionId;
  label: string;
  description: string;
}[] = [
  { id: 'attack', label: 'Attack', description: '一般攻擊，穩定輸出。' },
  { id: 'guard', label: 'Guard', description: '提高減傷並獲得護盾。' },
  { id: 'skill', label: 'Skill', description: '職業技能，強力但有冷卻。' },
  { id: 'heal', label: 'Meditate', description: '回復生命並調整節奏。' }
];

const ActionPanel = ({ player, disabled, onAction }: ActionPanelProps) => {
  return (
    <Panel title="Action Console" subtitle="選擇本回合行動">
      <div className="grid gap-3 md:grid-cols-2">
        {actions.map((action) => {
          const lockByCooldown = (action.id === 'skill' || action.id === 'heal') && player.skillCooldown > 0;
          const lock = disabled || lockByCooldown;

          return (
            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={!lock ? { y: -2 } : undefined}
              key={action.id}
              type="button"
              className={`${action.id === 'attack' ? 'btn-primary' : 'btn-muted'} w-full text-left ${
                lock ? 'cursor-not-allowed opacity-45' : ''
              }`}
              disabled={lock}
              onClick={() => onAction(action.id)}
            >
              <p className="font-display text-base uppercase tracking-[0.1em]">{action.label}</p>
              <p className="mt-1 text-xs text-slate-300">{action.description}</p>
              {lockByCooldown ? (
                <p className="mt-2 text-[11px] uppercase tracking-wider text-amber-200">
                  cooldown {player.skillCooldown} turns
                </p>
              ) : null}
            </motion.button>
          );
        })}
      </div>
    </Panel>
  );
};

export default ActionPanel;
