import { AnimatePresence, motion } from 'framer-motion';
import { BattleLogEntry } from '../types/game';
import Panel from './Panel';

interface BattleLogProps {
  logs: BattleLogEntry[];
}

const rowClassByType: Record<BattleLogEntry['type'], string> = {
  info: 'text-slate-300 border-slate-700/60',
  damage: 'text-orange-200 border-orange-500/30',
  heal: 'text-emerald-200 border-emerald-500/30',
  critical: 'text-fuchsia-200 border-fuchsia-500/40',
  warning: 'text-red-200 border-red-500/35',
  buff: 'text-cyan-200 border-cyan-500/35',
  debuff: 'text-amber-200 border-amber-500/35',
  reward: 'text-yellow-100 border-yellow-500/35'
};

const actorName: Record<BattleLogEntry['actor'], string> = {
  system: '[系統]',
  player: '[玩家]',
  boss: '[首領]'
};

const localizeLogText = (text: string) => {
  return text
    .replace(/^Critical hit! You deal (\d+) damage\.$/, '爆擊！你造成 $1 點傷害。')
    .replace(/^You strike and deal (\d+) damage\.$/, '你出手攻擊，造成 $1 點傷害。')
    .replace(/^Boss shield blocks (\d+) damage\.$/, '首領護盾抵擋了 $1 點傷害。')
    .replace(/^You guard and gain (\d+) shield\.$/, '你進入防禦姿態，獲得 $1 點護盾。')
    .replace(/^You channel and recover (\d+) HP\.$/, '你調息回復 $1 點生命。')
    .replace(/^Iron Bastion grants (\d+) shield and DEF up\.$/, '鋼鐵堡壘發動，獲得 $1 點護盾並提升防禦。')
    .replace(/^Arcane Nova critically deals (\d+) damage!$/, '奧術新星爆擊！造成 $1 點傷害！')
    .replace(/^Arcane Nova deals (\d+) damage and shreds armor\.$/, '奧術新星造成 $1 點傷害並削弱護甲。')
    .replace(/^Shadow Flurry lands (\d+) hits for (\d+) total damage\.$/, '暗影連斬命中 $1 段，總計造成 $2 點傷害。')
    .replace(/^(.*) enters ENRAGE state!$/, '$1 進入狂暴狀態！😡')
    .replace(/^(.*) gathers power \(\+(\d+) ATK\)\.$/, '$1 開始蓄力（攻擊 +$2）。')
    .replace(/^(.*) lands a CRITICAL for (\d+) damage!$/, '$1 打出爆擊，造成 $2 點傷害！')
    .replace(/^(.*) deals (\d+) damage\.$/, '$1 造成 $2 點傷害。')
    .replace(/^(.*) drains life and heals (\d+) HP\.$/, '$1 汲取生命，回復 $2 點生命。')
    .replace(/^Guard stance reduced incoming damage\.$/, '防禦姿態降低了受到的傷害。')
    .replace(/^Boss (.*) is defeated!$/, '$1 被你擊敗了！')
    .replace(/^You were defeated\. Run ended\.$/, '你被擊敗了，本輪挑戰結束。')
    .replace(/^Skill cooldown: (\d+)$/, '技能冷卻中：$1')
    .replace(/^Meditate unavailable \((\d+)\)$/, '調息不可用（剩餘 $1 回合）');
};

const BattleLog = ({ logs }: BattleLogProps) => {
  const visibleLogs = logs.slice(-18).reverse();

  return (
    <Panel title="戰鬥紀錄" subtitle="即時戰鬥訊息">
      <div className="log-scroll h-[360px] space-y-2 overflow-y-auto pr-2">
        <AnimatePresence initial={false}>
          {visibleLogs.map((log) => (
            <motion.div
              key={log.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className={`rounded-lg border px-3 py-2 text-xs ${rowClassByType[log.type]}`}
            >
              <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-400">
                <span>{actorName[log.actor]}</span>
                <span>第 {log.turn} 回合</span>
              </div>
              <p>{localizeLogText(log.text)}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Panel>
  );
};

export default BattleLog;
