import { motion } from 'framer-motion';
import { BattleActionId, Player } from '../types/game';
import Panel from './Panel';

interface ActionPanelProps {
  player: Player;
  disabled: boolean;
  onAction: (action: BattleActionId) => void;
}

const actions: { id: BattleActionId; label: string; description: string }[] = [
  { id: 'attack', label: '攻擊', description: '一般攻擊，穩定輸出。' },
  { id: 'guard', label: '防禦', description: '提高減傷並獲得護盾。' },
  { id: 'skill', label: '技能', description: '施放目前主動技能。' },
  { id: 'heal', label: '使用藥水', description: '自動使用最高等級藥水恢復生命。' }
];

const ActionPanel = ({ player, disabled, onAction }: ActionPanelProps) => {
  const potionTotal = player.potions.minor + player.potions.standard + player.potions.major + player.potions.supreme;

  return (
    <Panel
      title="行動面板"
      subtitle={`回復生命只能透過藥水道具（目前 ${potionTotal} 瓶）`}
      className="sticky bottom-2 z-30 md:bottom-3 xl:static"
    >
      <div className="grid grid-cols-2 gap-2 md:gap-3">
        {actions.map((action) => {
          const lockByCooldown = action.id === 'skill' && player.skillCooldown > 0;
          const lockByPotion = action.id === 'heal' && potionTotal <= 0;
          const lock = disabled || lockByCooldown || lockByPotion;

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
              <p className="font-display text-sm uppercase tracking-[0.08em] md:text-base">{action.label}</p>
              <p className="mt-1 text-[11px] text-slate-300 md:text-xs">{action.description}</p>
              {lockByCooldown ? <p className="mt-2 text-[11px] uppercase tracking-wider text-amber-200">冷卻 {player.skillCooldown} 回合</p> : null}
              {lockByPotion ? <p className="mt-2 text-[11px] uppercase tracking-wider text-red-200">藥水不足</p> : null}
            </motion.button>
          );
        })}
      </div>
    </Panel>
  );
};

export default ActionPanel;
