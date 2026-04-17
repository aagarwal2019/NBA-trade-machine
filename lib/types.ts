export type Position = "PG" | "SG" | "SF" | "PF" | "C";
export type ContractType = "standard" | "rookie" | "two-way" | "team-option" | "player-option";

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
  conference: "East" | "West";
  division: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: Position;
  jerseyNumber: number;
  age: number;
  salary2025: number;
  salary2026: number | null;
  salary2027: number | null;
  contractType: ContractType;
}

export interface TradeSlot {
  teamId: string;
  selectedPlayerIds: Set<string>;
}
