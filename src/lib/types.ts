export type Position = { x: number; y: number };

export type Stats = {
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
};

export type Actor = {
  id: number;
  name: string;
  char: string;
  color: string;
  pos: Position;
  stats: Stats;
};

export type Player = Actor & {
  inventory: import("./items").Item[];
};

export type EnemyBehavior = "idle" | "chase" | "flee";

export type Enemy = Actor & {
  behavior: EnemyBehavior;
  xp: number;
  sightRange: number;
};