import * as C from "../mod.ts";

declare const PRIMARY: Uint8Array;
declare const SECONDARY: Uint8Array[];
declare const THRESHOLD: number;

const xMultiSig = C.MultiSig.from(
  PRIMARY,
  SECONDARY,
  THRESHOLD
);

const xPending = xMultiSig.pending.get(proposalId);
const approvalTx = xPending.sign(signer);

const multiSigAddress = await approvalTx.send();

console.log(multiSigAddress);