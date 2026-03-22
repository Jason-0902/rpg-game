import { getSkillById } from '../data/skillData';
import { RewardBundle } from '../types/game';
import Panel from './Panel';

interface RewardPanelProps {
  reward: RewardBundle;
  onContinue: () => void;
}

const potionLabel = {
  minor: '初級藥水',
  standard: '中級藥水',
  major: '高級藥水',
  supreme: '頂級藥水'
};

const RewardPanel = ({ reward, onContinue }: RewardPanelProps) => {
  return (
    <Panel title="戰利品" subtitle="擊敗怪物後的收穫">
      <div className="space-y-2 text-sm text-slate-200">
        <p>金錢：+{reward.money}</p>
        <p>
          藥水：
          {reward.potionTier ? `${potionLabel[reward.potionTier]} x${reward.potionCount}` : '本次未掉落'}
        </p>
        <p>技能：{reward.skill ? getSkillById(reward.skill.id)?.name ?? reward.skill.name : '本次未掉落'}</p>
        <p>裝備：{reward.equipment ? reward.equipment.name : '本次未掉落'}</p>
        <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-2">
          <p className="text-emerald-200">本次屬性成長</p>
          <p className="mt-1 text-xs text-slate-100">{reward.statGrowths.join('、')}</p>
        </div>
      </div>
      <button className="btn-primary mt-4" onClick={onContinue}>
        繼續旅行
      </button>
    </Panel>
  );
};

export default RewardPanel;

