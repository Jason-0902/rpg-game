import { motion } from 'framer-motion';
import { CharacterInfo } from '../types/characterSelect';

interface CharacterCardProps {
  character: CharacterInfo;
  selected: boolean;
  onSelect: (character: CharacterInfo) => void;
  index: number;
}

const roleStyle: Record<CharacterInfo['role'], string> = {
  Warrior: 'from-sky-500/60 to-blue-700/60 border-sky-300/55 text-sky-100',
  Mage: 'from-violet-500/60 to-purple-700/60 border-violet-300/55 text-violet-100',
  Assassin: 'from-rose-500/60 to-red-700/60 border-rose-300/55 text-rose-100'
};

const CharacterCard = ({ character, selected, onSelect, index }: CharacterCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={`group relative overflow-hidden rounded-[10px] border bg-black/40 transition-all duration-300 ${
        selected
          ? 'border-amber-300/80 shadow-[0_0_35px_rgba(245,158,11,0.45)]'
          : 'border-slate-400/25 shadow-[0_12px_36px_rgba(0,0,0,0.5)] hover:border-amber-200/55 hover:shadow-[0_0_32px_rgba(99,102,241,0.35)]'
      }`}
    >
      <img src={character.image} alt={character.roleZh} className="h-[500px] w-full object-cover transition-transform duration-700 group-hover:scale-105" />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/68 to-black/10" />
      <div className="absolute inset-x-0 top-0 h-[35%] bg-gradient-to-b from-black/30 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="text-center">
          <p className="font-display text-[38px] leading-none tracking-[0.08em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">{character.roleZh}</p>
          <p className="mt-1 font-display text-[30px] leading-none tracking-[0.09em] text-slate-100">{character.role.toUpperCase()}</p>
        </div>

        <div className={`mx-auto mt-4 flex w-fit items-center gap-2 rounded-full border bg-gradient-to-r px-4 py-1 text-xs tracking-[0.16em] ${roleStyle[character.role]}`}>
          <span>{character.roleZh}</span>
          <span className="text-white/70">•</span>
          <span>{character.role.toUpperCase()}</span>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
          <div className="rounded border border-white/20 bg-black/35 p-1.5">
            <p className="text-[9px] tracking-[0.14em] text-slate-300">HP</p>
            <p className="font-display text-base text-white">{character.hp}</p>
          </div>
          <div className="rounded border border-white/20 bg-black/35 p-1.5">
            <p className="text-[9px] tracking-[0.14em] text-slate-300">ATK</p>
            <p className="font-display text-base text-white">{character.atk}</p>
          </div>
          <div className="rounded border border-white/20 bg-black/35 p-1.5">
            <p className="text-[9px] tracking-[0.14em] text-slate-300">DEF</p>
            <p className="font-display text-base text-white">{character.def}</p>
          </div>
          <div className="rounded border border-white/20 bg-black/35 p-1.5">
            <p className="text-[9px] tracking-[0.14em] text-slate-300">CRIT</p>
            <p className="font-display text-base text-white">{character.crit}%</p>
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-slate-200">{character.skill}</p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => onSelect(character)}
          className="mt-3 w-full rounded border border-amber-300/45 bg-gradient-to-r from-amber-500/20 to-orange-600/20 px-3 py-2 font-display text-xs uppercase tracking-[0.2em] text-amber-100 transition-all duration-300 hover:border-amber-200/90 hover:from-amber-400/30 hover:to-orange-500/30"
        >
          選擇角色
        </motion.button>
      </div>
    </motion.article>
  );
};

export default CharacterCard;
