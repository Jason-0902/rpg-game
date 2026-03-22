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
    <div className="grid gap-3 md:gap-4 xl:grid-cols-2">
      <Panel title={`玩家 - ${player.classTitle}`} subtitle={`等級 ${player.level} | 進階階級 ${player.classRank} | 已擊敗 ${player.defeatedBosses} 隻怪物`}>
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-slate-600/70 bg-slate-950/70 p-1">
            <img src={template.avatar} alt={template.name} className="h-36 w-full rounded-lg object-contain object-center md:h-44" />
          </div>
          <ResourceBar value={player.hp} max={player.maxHp} color="hp" label="生命" />
          <ResourceBar value={player.shield} max={Math.max(1, player.maxHp * 0.55)} color="shield" label="護盾" />
          <ResourceBar value={player.exp} max={player.expToNext} color="mana" label="職業經驗值" />

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <StatCell label="攻擊" value={player.atk + player.atkBuff} />
            <StatCell label="防禦" value={player.def + player.defBuff} />
            <StatCell label="爆擊" value={formatPercent(player.crit + player.critBuff)} />
            <StatCell label="金錢" value={player.gold} />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
            <div className="stat-chip">初級藥水：{player.potions.minor}</div>
            <div className="stat-chip">中級藥水：{player.potions.standard}</div>
            <div className="stat-chip">高級藥水：{player.potions.major}</div>
            <div className="stat-chip">頂級藥水：{player.potions.supreme}</div>
          </div>

          {player.temporaryDebuff ? (
            <div className="rounded-xl border border-red-400/45 bg-red-500/10 px-3 py-2 text-xs text-red-100">
              負面效果：{player.temporaryDebuff.name}（剩餘 {player.temporaryDebuff.remainingTurns} 回合）
            </div>
          ) : null}
        </div>
      </Panel>

      <Panel
        title={`怪物 - ${boss.emoji} ${boss.name}`}
        subtitle={`${boss.title} | 危險等級 ${boss.level}${boss.isBoss ? ' | Boss' : ''}`}
        className={boss.enraged ? 'border-red-400/80' : ''}
      >
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-slate-600/70 bg-slate-950/50">
            <img src={boss.portrait} alt={boss.name} className="h-36 w-full object-contain object-center md:h-44" />
          </div>

          <motion.div animate={boss.enraged ? { scale: [1, 1.02, 1] } : { scale: 1 }} transition={{ repeat: Infinity, duration: 1.4 }}>
            <ResourceBar value={boss.hp} max={boss.maxHp} color="danger" label="生命" />
          </motion.div>
          <ResourceBar value={boss.shield} max={Math.max(1, boss.maxHp * 0.4)} color="shield" label="護盾" />

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <StatCell label="攻擊" value={boss.atk + boss.atkBuff} />
            <StatCell label="防禦" value={boss.def + boss.defBuff} />
            <StatCell label="爆擊" value={formatPercent(boss.crit + boss.critBuff)} />
            <StatCell label="掉落金" value={boss.dropGold} />
          </div>
        </div>
      </Panel>
    </div>
  );
};

export default StatusPanel;
