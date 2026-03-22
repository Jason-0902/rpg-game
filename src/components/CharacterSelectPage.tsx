import { useState } from 'react';
import { ClassId } from '../types/game';
import CharacterCard from './CharacterCard';
import { CHARACTER_LIST } from '../data/characterSelectData';
import { CharacterInfo } from '../types/characterSelect';

interface CharacterSelectPageProps {
  onSelectRole: (classId: ClassId) => void;
}

const roleToClassId: Record<CharacterInfo['role'], ClassId> = {
  Warrior: 'warrior',
  Mage: 'mage',
  Assassin: 'assassin'
};

const CharacterSelectPage = ({ onSelectRole }: CharacterSelectPageProps) => {
  const [selected, setSelected] = useState<CharacterInfo | null>(null);

  const handleSelect = (character: CharacterInfo) => {
    setSelected(character);
    onSelectRole(roleToClassId[character.role]);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#03060f] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.15),transparent_34%),radial-gradient(circle_at_100%_10%,rgba(244,114,182,0.14),transparent_36%),linear-gradient(180deg,#02050d_0%,#050b17_48%,#02050d_100%)]" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <main className="relative mx-auto max-w-[1440px] px-3 py-6 md:px-10 md:py-10">
        <header className="mb-6 text-center md:mb-8">
          <div className="mx-auto mb-3 flex max-w-[760px] items-center gap-2 md:gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-400/80" />
            <span className="text-amber-300">◆</span>
            <p className="font-display text-base tracking-[0.04em] text-white md:text-2xl md:tracking-[0.06em]">可操作角色 PLAYABLE CHARACTERS</p>
            <span className="text-amber-300">◆</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-400/80" />
          </div>
        </header>

        <section className="grid gap-4 md:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {CHARACTER_LIST.map((character, index) => (
            <CharacterCard
              key={character.id}
              character={character}
              selected={selected?.id === character.id}
              onSelect={handleSelect}
              index={index}
            />
          ))}
        </section>

        <footer className="mt-5 border-t border-amber-500/35 pt-3 text-center md:mt-7 md:pt-4">
          <p className="font-display text-xs tracking-[0.12em] text-slate-200 md:text-sm md:tracking-[0.16em]">
            {selected ? `已選擇 ${selected.roleZh}` : '請選擇你的起始職業'}
          </p>
        </footer>
      </main>
    </div>
  );
};

export default CharacterSelectPage;

