export const enum EraKind {
  Mortal = "Mortal",
  Immortal = "Immortal",
}
export abstract class EraBase {
  constructor(readonly type: EraKind) {}
}
export class MortalEra extends EraBase {
  value;
  constructor(period: bigint, phase: bigint) {
    super(EraKind.Mortal);
    this.value = [period, phase];
  }
}
export class ImmortalEra extends EraBase {
  constructor() {
    super(EraKind.Immortal);
  }
}
export const immortalEra = new ImmortalEra();
export type Era = MortalEra | ImmortalEra;
