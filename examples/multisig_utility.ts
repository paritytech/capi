import * as C from "../mod.ts";

declare const PRIMARY: Uint8Array;
declare const SECONDARY: Uint8Array[];
declare const THRESHOLD: number;

declare namespace MultiSig {
  const create: (
    primary: Uint8Array,
    secondary: Uint8Array[],
    threshold: number,
  ) => Promise<Uint8Array>;
}

const multiSigAddress = await MultiSig.create(
  PRIMARY,
  SECONDARY,
  THRESHOLD,
);

console.log(multiSigAddress);
