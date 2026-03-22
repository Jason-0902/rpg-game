import { motion } from 'framer-motion';
import { CLASS_TEMPLATES } from '../data/classData';
import { formatPercent } from '../logic/utils';
import { Boss, Player } from '../types/game';
import Panel from './Panel';
import ResourceBar from './ResourceBar';

interface StatusPanelProps {
  player: Player;
  boss: Boss;
}

const StatCell = ({ label, value }: { label: string; value: string | number }) => (
  <div className="stat-chip">
    <p className="text-[10px] uppercase tracking-wider text-slate-400">{label}</p>
    <p className="font-display text-lg text-slate-100">{value}</p>
  </div>
);

const StatusPanel = ({ player, boss }: StatusPanelProps) => {
  const template = CLASS_TEMPLATES[player.classId];

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Panel title={`Player - ${template.name}`} subtitle={`Lv.${player.level} | Stage Cleared ${player.defeatedBosses}`}>
        <div className="space-y-3">
          <ResourceBar value={player.hp} max={player.maxHp} color="hp" label="HP" />
          <ResourceBar value={player.shield} max={Math.max(1, player.maxHp * 0.55)} color="shield" label="Shield" />

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <StatCell label="ATK" value={player.atk + player.atkBuff} />
            <StatCell label="DEF" value={player.def + player.defBuff} />
            <StatCell label="CRIT" value={formatPercent(player.crit + player.critBuff)} />
            <StatCell label="Runes" value={player.runes} />
          </div>

          <div className="rounded-xl border border-slate-600/70 bg-slate-900/65 p-2 text-xs text-slate-300">
            <div className="mb-1 flex items-center justify-between">
              <span>EXP</span>
              <span>
                {player.exp} / {player.expToNext}
              </span>
            </div>
            <ResourceBar value={player.exp} max={player.expToNext} color="mana" label="Progress" showValue={false} />
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-md border border-slate-600 bg-slate-900/60 px-2 py-1">Combo: {player.combo}</span>
            <span className="rounded-md border border-slate-600 bg-slate-900/60 px-2 py-1">
              Skill CD: {player.skillCooldown}
            </span>
            {player.isGuarding ? (
              <span className="rounded-md border border-emerald-500/70 bg-emerald-500/10 px-2 py-1 text-emerald-200">
                Guarding
              </span>
            ) : null}
          </div>
        </div>
      </Panel>

      <Panel
        title={`Boss - ${boss.name}`}
        subtitle={`${boss.title} | Danger Lv.${boss.level}`}
        className={boss.enraged ? 'border-red-400/80' : ''}
      >
        <div className="space-y-3">
          <motion.div animate={boss.enraged ? { scale: [1, 1.02, 1] } : { scale: 1 }} transition={{ repeat: Infinity, duration: 1.4 }}>
            <ResourceBar value={boss.hp} max={boss.maxHp} color="danger" label="HP" />
          </motion.div>
          <ResourceBar value={boss.shield} max={Math.max(1, boss.maxHp * 0.4)} color="shield" label="Shield" />

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <StatCell label="ATK" value={boss.atk + boss.atkBuff} />
            <StatCell label="DEF" value={boss.def + boss.defBuff} />
            <StatCell label="CRIT" value={formatPercent(boss.crit + boss.critBuff)} />
            <StatCell label="Bounty" value={boss.dropRunes} />
          </div>

          <div className="rounded-xl border border-slate-600/70 bg-slate-900/65 p-3 text-xs text-slate-300">
            <p className="mb-1 font-display uppercase tracking-[0.14em] text-red-200">Boss Trait</p>
            <p>當生命低於 {Math.round(boss.enrageThreshold * 100)}% 會進入 Enrage，獲得額外攻擊與爆擊。</p>
            {boss.enraged ? (
              <p className="mt-2 text-red-300">Enrage Active: 攻擊傾向更激進，請留意防禦與治療節奏。</p>
            ) : null}
          </div>
        </div>
      </Panel>
    </div>
  );
};

export default StatusPanel;
