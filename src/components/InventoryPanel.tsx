import { getSkillById } from '../data/skillData';
import { EquipmentItem, Player } from '../types/game';
import Panel from './Panel';

interface InventoryPanelProps {
  player: Player;
  onEquip: (itemId: string) => void;
  onSelectSkill: (skillId: string) => void;
}

const slotLabel: Record<string, string> = {
  head: '頭',
  gloves: '手套',
  weapon: '武器',
  shield: '盾牌',
  necklace: '項鍊',
  shoes: '鞋子',
  armor: '衣服',
  legs: '腿'
};

const bonusText = (item: EquipmentItem) => {
  const t: string[] = [];
  if (item.bonuses.maxHp) t.push(`生命+${item.bonuses.maxHp}`);
  if (item.bonuses.atk) t.push(`攻擊+${item.bonuses.atk}`);
  if (item.bonuses.def) t.push(`防禦+${item.bonuses.def}`);
  if (item.bonuses.crit) t.push(`爆擊+${Math.round(item.bonuses.crit * 100)}%`);
  return t.join(' / ');
};

const InventoryPanel = ({ player, onEquip, onSelectSkill }: InventoryPanelProps) => {
  return (
    <Panel title="背包與裝備" subtitle="可從背包裝備武器，也可切換已學技能。">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
          {Object.entries(player.equipped).map(([slot, item]) => (
            <div key={slot} className="stat-chip">
              <p className="text-slate-400">{slotLabel[slot]}</p>
              <p className="text-slate-100">{item ? item.name : '未裝備'}</p>
            </div>
          ))}
        </div>

        <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
          {player.inventoryEquipment.length === 0 ? (
            <p className="text-xs text-slate-400">目前沒有可裝備物品。</p>
          ) : (
            player.inventoryEquipment.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-600/70 bg-slate-900/60 p-2 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-sm text-slate-100">{item.name}</p>
                    <p className="text-slate-300">{bonusText(item)}</p>
                  </div>
                  <button className="btn-muted px-2 py-1 text-[11px]" onClick={() => onEquip(item.id)}>
                    裝備
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs text-slate-400">已學技能（可切換主動技能）</p>
          <div className="grid gap-2">
            {player.unlockedSkillIds.map((id) => {
              const skill = getSkillById(id);
              return (
                <button
                  key={id}
                  className={`rounded-lg border px-3 py-2 text-left text-xs ${
                    player.activeSkillId === id
                      ? 'border-cyan-400/70 bg-cyan-500/10 text-cyan-100'
                      : 'border-slate-600/70 bg-slate-900/50 text-slate-200'
                  }`}
                  onClick={() => onSelectSkill(id)}
                >
                  <p className="font-display text-sm">{skill?.name ?? id}</p>
                  <p>{skill?.description ?? '技能說明遺失'}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Panel>
  );
};

export default InventoryPanel;
