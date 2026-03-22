import { EquipmentRarity, EquipmentItem } from '../types/game';
import Panel from './Panel';

interface ShopPanelProps {
  gold: number;
  offers: EquipmentItem[];
  onBuy: (id: string) => void;
  onLeave: () => void;
}

const rarityLabel: Record<EquipmentRarity, string> = {
  normal: '一般',
  fine: '精良',
  advanced: '高等',
  legendary: '傳說',
  mythic: '神話'
};

const bonusText = (item: EquipmentItem) => {
  const t: string[] = [];
  if (item.bonuses.maxHp) t.push(`生命+${item.bonuses.maxHp}`);
  if (item.bonuses.atk) t.push(`攻擊+${item.bonuses.atk}`);
  if (item.bonuses.def) t.push(`防禦+${item.bonuses.def}`);
  if (item.bonuses.crit) t.push(`爆擊+${Math.round(item.bonuses.crit * 100)}%`);
  return t.join(' / ');
};

const ShopPanel = ({ gold, offers, onBuy, onLeave }: ShopPanelProps) => {
  return (
    <Panel title="隨機商店" subtitle={`目前金錢：${gold}`}>
      <div className="space-y-2">
        {offers.map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-600/70 bg-slate-900/60 p-3 text-xs">
            <div className="flex items-start gap-2">
              <img src={item.image} alt={item.name} className="h-14 w-14 rounded-md object-cover" />
              <div className="flex-1">
                <p className="font-display text-sm text-slate-100">{item.name}</p>
                <p className="text-amber-200">{rarityLabel[item.rarity]} </p>
                <p className="text-slate-300">{bonusText(item)}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-amber-200">{item.price} 金幣</span>
                  <button className="btn-muted px-2 py-1 text-[11px]" onClick={() => onBuy(item.id)}>
                    購買
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-primary mt-4" onClick={onLeave}>
        離開商店
      </button>
    </Panel>
  );
};

export default ShopPanel;


