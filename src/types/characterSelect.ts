export type RoleType = 'Warrior' | 'Mage' | 'Assassin' | 'God';

export interface CharacterInfo {
  id: string;
  role: RoleType;
  roleZh: string;
  image: string;
  hp: number;
  atk: number;
  def: number;
  crit: number;
  skill: string;
}

