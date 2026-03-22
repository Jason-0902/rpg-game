import { CharacterInfo } from '../types/characterSelect';

interface CharacterCardProps {
  character: CharacterInfo;
  selected: boolean;
  onSelect: (character: CharacterInfo) => void;
}

const CharacterCard = ({ character, selected, onSelect }: CharacterCardProps) => {
  return (
    <article
      className={`group relative overflow-hidden rounded-[28px] border transition-all duration-300 ${
        selected
          ? 'border-cyan-300/90 shadow-[0_0_40px_rgba(56,189,248,0.5)]'
          : 'border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.4)] hover:border-fuchsia-300/80 hover:shadow-[0_0_40px_rgba(232,121,249,0.45)]'
      }`}
    >
      <img
        src={character.image}
        alt={character.name}
        className="h-[620px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">{character.role}</p>
        <h3 className="mt-1 font-display text-3xl tracking-[0.12em] text-white">{character.name}</h3>

        <p className="mt-3 rounded-2xl border border-white/15 bg-black/35 p-3 text-sm leading-relaxed text-slate-100 backdrop-blur-sm">
          {character.skill}
        </p>

        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
          <div className="rounded-xl border border-white/15 bg-black/35 p-2">
            <p className="text-[10px] tracking-[0.14em] text-slate-300">HP</p>
            <p className="font-display text-xl text-white">{character.hp}</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-black/35 p-2">
            <p className="text-[10px] tracking-[0.14em] text-slate-300">ATK</p>
            <p className="font-display text-xl text-white">{character.atk}</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-black/35 p-2">
            <p className="text-[10px] tracking-[0.14em] text-slate-300">DEF</p>
            <p className="font-display text-xl text-white">{character.def}</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-black/35 p-2">
            <p className="text-[10px] tracking-[0.14em] text-slate-300">CRIT</p>
            <p className="font-display text-xl text-white">{character.crit}%</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelect(character)}
          className="mt-4 w-full rounded-2xl border border-cyan-200/50 bg-gradient-to-r from-cyan-400/30 to-indigo-500/30 px-4 py-3 font-display text-sm uppercase tracking-[0.2em] text-cyan-50 transition-all duration-300 hover:border-cyan-100 hover:from-cyan-300/45 hover:to-indigo-400/45"
        >
          選擇角色
        </button>
      </div>
    </article>
  );
};

export default CharacterCard;
