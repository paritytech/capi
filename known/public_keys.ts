import * as U from "../util/mod.ts";

export class Pair {
  constructor(
    readonly publicText: string,
    readonly secretText: string,
  ) {}

  get public(): Uint8Array {
    return U.hex.decode(this.publicText);
  }

  get secret(): Uint8Array {
    return U.hex.decode(this.secretText);
  }
}

export const alice = new Pair(
  "d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
  "e5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a",
);
export const bob = new Pair(
  "8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48",
  "398f0c28f98885e046333d4a41c19cee4c37368a9832c6502f6cfd182e2aef89",
);
export const charlie = new Pair(
  "90b5ab205c6974c9ea841be688864633dc9ca8a357843eeacf2314649965fe22",
  "bc1ede780f784bb6991a585e4f6e61522c14e1cae6ad0895fb57b9a205a8f938",
);
export const dave = new Pair(
  "306721211d5404bd9da88e0204360a1a9ab8b87c66c1bc2fcdd37f3c2222cc20",
  "868020ae0687dda7d57565093a69090211449845a7e11453612800b663307246",
);
export const eve = new Pair(
  "e659a7a1628cdd93febc04a4e0646ea20e9f5f0ce097d9a05290d4a9e054df4e",
  "786ad0e2df456fe43dd1f91ebca22e235bc162e0bb8d53c633e8c85b2af68b7a",
);
export const ferdie = new Pair(
  "1cbd2d43530a44705ad088af313e18f80b53ef16b36177cd4b77b846f2a5f07c",
  "42438b7883391c05512a938e36c2df0131e088b3756d6aa7a755fbff19d2f842",
);
export const one = new Pair(
  "ac859f8a216eeb1b320b4c76d118da3d7407fa523484d0a980126d3b4d0d220a",
  "3b3993c957ed9342cbb011eb9029c53fb253345114eff7da5951e98a41ba5ad5",
);
export const two = new Pair(
  "1254f7017f0b8347ce7ab14f96d818802e7e9e0c0d1b7c9acb3c726b080e7a03",
  "711baefcb129e031885532a8f1e634bbd28f4c60490a7dd29636567472af513d",
);

export const testPairs = { alice, bob, charlie, dave, eve, ferdie, one, two };
