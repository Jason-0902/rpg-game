import { CLASS_TEMPLATES } from '../data/classData';
import { ClassId } from '../types/game';
import Panel from './Panel';
import ResourceBar from './ResourceBar';

interface ClassSelectionProps {
  onSelect: (classId: ClassId) => void;
}

const classIds: ClassId[] = ['warrior', 'mage', 'assassin'];

const ClassSelection = ({ onSelect }: ClassSelectionProps) => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="font-display text-4xl font-bold uppercase tracking-[0.2em] text-cyan-100 md:text-5xl">
          Boss Trial Protocol
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-300 md:text-base">
          選擇你的職業，進入一場無限成長的單機回合制 Boss 戰。擊敗強敵後挑選升級，挑戰更高層級。
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {classIds.map((classId) => {
          const c = CLASS_TEMPLATES[classId];

          return (
            <Panel key={classId} title={c.name} subtitle={c.description} className={`${c.cardTheme} relative overflow-hidden`}>
              <div className="absolute right-8 top-8 h-24 w-24 opacity-70">
                <span className="rune">{c.short}</span>
                <span className="rune r2">{c.short}</span>
                <span className="rune r3">{c.short}</span>
              </div>

              <div className="space-y-3">
                <ResourceBar value={c.base.hp} max={c.base.hp} color="hp" label="HP" />
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="stat-chip">
                    <p className="text-slate-400">ATK</p>
                    <p className="font-display text-lg text-cyan-100">{c.base.atk}</p>
                  </div>
                  <div className="stat-chip">
                    <p className="text-slate-400">DEF</p>
                    <p className="font-display text-lg text-cyan-100">{c.base.def}</p>
                  </div>
                  <div className="stat-chip">
                    <p className="text-slate-400">CRIT</p>
                    <p className="font-display text-lg text-cyan-100">{Math.round(c.base.crit * 100)}%</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-600/70 bg-slate-900/70 p-3 text-xs text-slate-200">
                  <p className="mb-1 font-display text-sm uppercase tracking-wider text-cyan-100">Passive</p>
                  <p>{c.passive}</p>
                </div>

                <div className="rounded-xl border border-slate-600/70 bg-slate-900/70 p-3 text-xs text-slate-200">
                  <p className="mb-1 font-display text-sm uppercase tracking-wider text-amber-100">Skill: {c.skillName}</p>
                  <p>{c.skillDescription}</p>
                </div>

                <button type="button" className="btn-primary w-full" onClick={() => onSelect(classId)}>
                  Start As {c.name}
                </button>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
};

export default ClassSelection;
