import * as C from "../mod.ts";

declare module "../mod.ts" {
  namespace MultiSig {
    const create: (
      primary: Uint8Array,
      secondary: Uint8Array[],
      threshold: number,
    ) => Promise<Uint8Array>;
  }
}

/**
 * Steps
 * 1. create a multisig address for alice, bob and charlie
 * 2. add some balance or assume that there is balance in the multisig address
 * 3. get the encoded call data for a transfer from multisig address to dan address
 * 4. as alice, multisig.asMulti([bob, charlie], threshold, calldata)
 * 5. get timepoint from step 4
 * 6. as bob, multisig.asMulti([alice, charlie], threshold, calldata, timepoint)
 * 7. validate dan address new balance
 */

declare const PRIMARY: Uint8Array;
declare const SECONDARY: Uint8Array[];
declare const THRESHOLD: number;

const multiSigAddress = await C.MultiSig.create(
  PRIMARY,
  SECONDARY,
  THRESHOLD,
);

console.log(multiSigAddress);
