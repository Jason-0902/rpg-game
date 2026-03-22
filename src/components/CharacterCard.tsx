import { motion } from 'framer-motion';
import { SelectableCharacter } from '../types/characterSelect';

interface CharacterCardProps {
  character: SelectableCharacter;
  index: number;
  onSelect: (character: SelectableCharacter) => void;
}

const statLabel = {
  hp: 'HP',
  atk: 'ATK',
  def: 'DEF',
  crit: 'CRIT'
} as const;

const CharacterCard = ({ character, index, onSelect }: CharacterCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 50, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.03, y: -6 }}
      className={`group relative overflow-hidden rounded-[28px] border border-white/20 bg-slate-950/45 ${character.glow}`}
    >
      <div className="absolute inset-0">
        <img src={character.image} alt={character.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/52 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60" />
      <div
        className={`pointer-events-none absolute -inset-px rounded-[28px] bg-gradient-to-br ${character.accent} opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-70`}
      />

      <div className="relative flex min-h-[690px] flex-col justify-end p-6">
        <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-black/35 px-3 py-1 text-[11px] tracking-[0.2em] text-slate-200 backdrop-blur">
          <span>{character.role}</span>
          <span className="text-slate-400">|</span>
          <span>{character.element}</span>
        </div>

        <h3 className="font-display text-4xl font-bold tracking-[0.12em] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)]">{character.name}</h3>
        <p className="mt-1 text-sm tracking-[0.12em] text-slate-200/90">{character.title}</p>

        <p className="mt-4 rounded-2xl border border-white/15 bg-black/35 p-3 text-sm leading-relaxed text-slate-100/95 backdrop-blur-sm">
          {character.skillSummary}
        </p>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {(Object.keys(character.stats) as Array<keyof typeof character.stats>).map((key) => (
            <div key={key} className="rounded-xl border border-white/15 bg-black/40 px-2 py-2 text-center backdrop-blur-sm">
              <p className="text-[10px] tracking-[0.18em] text-slate-300">{statLabel[key]}</p>
              <p className="mt-1 font-display text-xl text-white">{character.stats[key]}{key === 'crit' ? '%' : ''}</p>
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(character)}
          className="mt-5 w-full rounded-2xl border border-sky-200/45 bg-gradient-to-r from-cyan-400/30 to-indigo-500/30 px-5 py-3 font-display text-sm uppercase tracking-[0.2em] text-cyan-50 backdrop-blur transition-all duration-300 hover:border-cyan-100/90 hover:from-cyan-300/45 hover:to-indigo-400/45"
          type="button"
        >
          選擇角色
        </motion.button>
      </div>
    </motion.article>
  );
};

export default CharacterCard;
