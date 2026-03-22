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
      <Panel title={`玩家 - ${template.name}`} subtitle={`等級 ${player.level} | 已擊敗 ${player.defeatedBosses} 隻首領`}>
        <div className="space-y-3">
          <ResourceBar value={player.hp} max={player.maxHp} color="hp" label="生命" />
          <ResourceBar value={player.shield} max={Math.max(1, player.maxHp * 0.55)} color="shield" label="護盾" />

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <StatCell label="攻擊" value={player.atk + player.atkBuff} />
            <StatCell label="防禦" value={player.def + player.defBuff} />
            <StatCell label="爆擊" value={formatPercent(player.crit + player.critBuff)} />
            <StatCell label="符石" value={player.runes} />
          </div>

          <div className="rounded-xl border border-slate-600/70 bg-slate-900/65 p-2 text-xs text-slate-300">
            <div className="mb-1 flex items-center justify-between">
              <span>經驗值</span>
              <span>
                {player.exp} / {player.expToNext}
              </span>
            </div>
            <ResourceBar value={player.exp} max={player.expToNext} color="mana" label="進度" showValue={false} />
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-md border border-slate-600 bg-slate-900/60 px-2 py-1">連擊：{player.combo}</span>
            <span className="rounded-md border border-slate-600 bg-slate-900/60 px-2 py-1">技能冷卻：{player.skillCooldown}</span>
            {player.isGuarding ? (
              <span className="rounded-md border border-emerald-500/70 bg-emerald-500/10 px-2 py-1 text-emerald-200">防禦中</span>
            ) : null}
          </div>
        </div>
      </Panel>

      <Panel
        title={`首領 - ${boss.emoji} ${boss.name}`}
        subtitle={`${boss.title} | 危險等級 ${boss.level}`}
        className={boss.enraged ? 'border-red-400/80' : ''}
      >
        <div className="space-y-3">
          <motion.div animate={boss.enraged ? { scale: [1, 1.02, 1] } : { scale: 1 }} transition={{ repeat: Infinity, duration: 1.4 }}>
            <ResourceBar value={boss.hp} max={boss.maxHp} color="danger" label="生命" />
          </motion.div>
          <ResourceBar value={boss.shield} max={Math.max(1, boss.maxHp * 0.4)} color="shield" label="護盾" />

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <StatCell label="攻擊" value={boss.atk + boss.atkBuff} />
            <StatCell label="防禦" value={boss.def + boss.defBuff} />
            <StatCell label="爆擊" value={formatPercent(boss.crit + boss.critBuff)} />
            <StatCell label="懸賞" value={boss.dropRunes} />
          </div>

          <div className="rounded-xl border border-slate-600/70 bg-slate-900/65 p-3 text-xs text-slate-300">
            <p className="mb-1 font-display uppercase tracking-[0.14em] text-red-200">首領特性</p>
            <p>當生命低於 {Math.round(boss.enrageThreshold * 100)}% 會進入狂暴，獲得額外攻擊與爆擊。</p>
            {boss.enraged ? <p className="mt-2 text-red-300">狂暴中：出手更兇狠，請提高防禦與治療節奏。</p> : null}
          </div>
        </div>
      </Panel>
    </div>
  );
};

export default StatusPanel;
