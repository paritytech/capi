// We use a `typeof` on the dyn import to safeguard against user-provided version mismatch. Ultimately,
// we'd like to treat Smoldot as a peer dependency, which means we should never utilize its runtime.
export type Smoldot = typeof import("https://esm.sh/@substrate/smoldot-light@0.6.19");
