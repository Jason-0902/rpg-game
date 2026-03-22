import { useMemo } from 'react';
import { CODEX_TIPS } from '../data/codexTips';
import Panel from './Panel';

interface TipConsoleProps {
  stageLevel: number;
}

const TipConsole = ({ stageLevel }: TipConsoleProps) => {
  const tips = useMemo(() => {
    const start = ((stageLevel - 1) * 3) % CODEX_TIPS.length;
    return [
      CODEX_TIPS[start],
      CODEX_TIPS[(start + 1) % CODEX_TIPS.length],
      CODEX_TIPS[(start + 2) % CODEX_TIPS.length]
    ];
  }, [stageLevel]);

  return (
    <Panel title="Tactical Codex" subtitle="每層提供三條建議，協助你調整策略。">
      <div className="space-y-2">
        {tips.map((tip) => (
          <div key={tip.id} className="rounded-lg border border-slate-600/70 bg-slate-900/60 px-3 py-2 text-xs">
            <p className="mb-1 font-display text-[11px] uppercase tracking-wider text-cyan-200">{tip.category}</p>
            <p className="text-slate-200">{tip.text}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
};

export default TipConsole;
