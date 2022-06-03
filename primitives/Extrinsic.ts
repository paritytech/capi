export const enum EraKind {
  Mortal = "Mortal",
  Immortal = "Immortal",
}
export abstract class EraBase {
  constructor(readonly _tag: EraKind) {}
}
export class MortalEra extends EraBase {
  0;
  1;
  constructor(period: bigint, phase: bigint) {
    super(EraKind.Mortal);
    this[0] = period;
    this[1] = phase;
  }
}
export class ImmortalEra extends EraBase {
  constructor() {
    super(EraKind.Immortal);
  }
}
export const immortalEra = new ImmortalEra();
export type Era = MortalEra | ImmortalEra;

export class ChargeAssetTxPayment {
  0;
  1;
  constructor(tip: bigint, assetId?: "TODO") {
    this[0] = tip;
    this[1] = assetId;
  }
}

export class Extras {
  0 = {};
  1 = {};
  2 = {};
  3 = {};
  // TODO: remove `any`s upon Deno upgrade with TS release containing changes of `https://github.com/microsoft/TypeScript/pull/49374#pullrequestreview-994644744`
  4: any;
  5: any;
  6 = {};
  7;

  constructor(
    era: Era,
    nonce: number,
    chargeAssetTxPayment: ChargeAssetTxPayment,
  ) {
    this[4] = { 0: era };
    this[5] = { 0: nonce };
    this[7] = chargeAssetTxPayment;
  }
}
