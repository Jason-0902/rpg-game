export type CharacterRole = '戰士' | '法師' | '刺客';

export interface CharacterStats {
  hp: number;
  atk: number;
  def: number;
  crit: number;
}

export interface SelectableCharacter {
  id: string;
  name: string;
  role: CharacterRole;
  image: string;
  title: string;
  element: string;
  skillSummary: string;
  stats: CharacterStats;
  accent: string;
  glow: string;
}
