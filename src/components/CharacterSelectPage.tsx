import { useState } from 'react';
import CharacterCard from './CharacterCard';
import { CHARACTER_LIST } from '../data/characterSelectData';
import { CharacterInfo } from '../types/characterSelect';

const CharacterSelectPage = () => {
  const [selected, setSelected] = useState<CharacterInfo | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050812] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-[-180px] h-[460px] w-[460px] rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute -right-32 top-[80px] h-[460px] w-[460px] rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#030712_0%,#0a1224_48%,#050812_100%)]" />
      </div>

      <main className="relative mx-auto max-w-[1500px] px-6 py-12 md:px-10">
        <header className="mb-10 text-center">
          <p className="font-display text-sm uppercase tracking-[0.4em] text-cyan-200">Celestial Selection</p>
          <h1 className="mt-2 font-display text-5xl tracking-[0.14em] text-white md:text-6xl">角色選擇</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-slate-300 md:text-lg">
            選擇你的命定角色，踏入高難度試煉戰場。
          </p>
        </header>

        <section className="grid gap-7 xl:grid-cols-3">
          {CHARACTER_LIST.map((character) => (
            <CharacterCard
              key={character.name}
              character={character}
              selected={selected?.name === character.name}
              onSelect={setSelected}
            />
          ))}
        </section>

        <footer className="mt-10 rounded-3xl border border-white/15 bg-black/35 p-5 text-center backdrop-blur-md">
          <p className="text-sm tracking-[0.12em] text-slate-200 md:text-base">
            {selected ? `已選擇：${selected.name}（${selected.role}）` : '尚未選擇角色'}
          </p>
        </footer>
      </main>
    </div>
  );
};

export default CharacterSelectPage;
