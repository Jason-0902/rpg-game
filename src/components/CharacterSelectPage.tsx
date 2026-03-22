import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import CharacterCard from '../components/CharacterCard';
import { CHARACTER_SELECT_DATA } from '../data/characterSelectData';
import { SelectableCharacter } from '../types/characterSelect';

const CharacterSelectPage = () => {
  const [selected, setSelected] = useState<SelectableCharacter | null>(null);

  const subtitle = useMemo(() => {
    if (!selected) return '選擇你的命定角色，開啟下一段史詩旅程';
    return `已鎖定 ${selected.name} · ${selected.title}`;
  }, [selected]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060915] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-[-140px] h-[420px] w-[420px] rounded-full bg-cyan-400/18 blur-3xl" />
        <div className="absolute -right-36 top-[80px] h-[420px] w-[420px] rounded-full bg-fuchsia-500/18 blur-3xl" />
        <div className="absolute bottom-[-180px] left-[26%] h-[520px] w-[520px] rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_42%),linear-gradient(180deg,#050812_0%,#090f1f_52%,#050812_100%)]" />
      </div>

      <main className="relative mx-auto max-w-[1520px] px-6 py-12 md:px-10 lg:px-14">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-10 text-center"
        >
          <p className="font-display text-sm uppercase tracking-[0.42em] text-cyan-200/90">Teyvat Operative Protocol</p>
          <h1 className="mt-3 font-display text-5xl tracking-[0.16em] text-white md:text-6xl">角色選擇</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-slate-300 md:text-lg">{subtitle}</p>
        </motion.header>

        <section className="grid gap-7 xl:grid-cols-3">
          {CHARACTER_SELECT_DATA.map((character, index) => (
            <CharacterCard key={character.id} character={character} index={index} onSelect={setSelected} />
          ))}
        </section>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-10 rounded-3xl border border-white/15 bg-black/35 p-5 text-center backdrop-blur-md"
        >
          <p className="text-sm tracking-[0.12em] text-slate-200 md:text-base">
            {selected ? `已確認出戰角色：${selected.name}（${selected.role}）` : '尚未選擇角色'}
          </p>
        </motion.footer>
      </main>
    </div>
  );
};

export default CharacterSelectPage;
