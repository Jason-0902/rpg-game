import { CLASS_TEMPLATES } from '../data/classData';
import { RunSummary } from '../types/game';
import Panel from './Panel';

interface RunSummaryCardProps {
  summary: RunSummary | null;
}

const RunSummaryCard = ({ summary }: RunSummaryCardProps) => {
  if (!summary) {
    return (
      <Panel title="Last Run" subtitle="尚未有歷史紀錄。">
        <p className="text-sm text-slate-300">首次遊玩後會在這裡顯示最高層、總傷害與完成時間。</p>
      </Panel>
    );
  }

  return (
    <Panel title="Last Run" subtitle="最近一次結算">
      <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-3">
        <div className="stat-chip">
          <p className="text-slate-400">Class</p>
          <p className="font-display text-base text-slate-100">{CLASS_TEMPLATES[summary.classId].name}</p>
        </div>
        <div className="stat-chip">
          <p className="text-slate-400">Highest Stage</p>
          <p className="font-display text-base text-slate-100">{summary.highestLevel}</p>
        </div>
        <div className="stat-chip">
          <p className="text-slate-400">Bosses</p>
          <p className="font-display text-base text-slate-100">{summary.bossesDefeated}</p>
        </div>
        <div className="stat-chip">
          <p className="text-slate-400">Damage Dealt</p>
          <p className="font-display text-base text-slate-100">{Math.round(summary.totalDamageDealt)}</p>
        </div>
        <div className="stat-chip">
          <p className="text-slate-400">Damage Taken</p>
          <p className="font-display text-base text-slate-100">{Math.round(summary.totalDamageTaken)}</p>
        </div>
        <div className="stat-chip">
          <p className="text-slate-400">Completed</p>
          <p className="font-display text-base text-slate-100">{new Date(summary.completedAt).toLocaleString()}</p>
        </div>
      </div>
    </Panel>
  );
};

export default RunSummaryCard;
