import * as C from "../mod.ts";

declare const PRIMARY: Uint8Array;
declare const SECONDARY: Uint8Array[];
declare const THRESHOLD: number;

const multiSigAddress = await C.MultiSig.with(
  PRIMARY,
  SECONDARY,
  THRESHOLD,
  proposalId,
  signer
);

console.log(multiSigAddress);