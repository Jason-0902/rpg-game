export type RoleType = 'Warrior' | 'Mage' | 'Assassin';

export interface CharacterInfo {
  name: string;
  role: RoleType;
  image: string;
  hp: number;
  atk: number;
  def: number;
  crit: number;
  skill: string;
}
