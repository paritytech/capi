export type EraKind = "Mortal" | "Immortal";
export abstract class EraBase {
  constructor(readonly type: EraKind) {}
}
export class MortalEra extends EraBase {
  value;
  constructor(period: bigint, phase: bigint) {
    super("Mortal");
    this.value = [period, phase];
  }
}
export class ImmortalEra extends EraBase {
  constructor() {
    super("Immortal");
  }
}
export const immortalEra = new ImmortalEra();
export type Era = MortalEra | ImmortalEra;
