import * as M from "../../frame_metadata/mod.ts";
import { atomFactory } from "../sys/Atom.ts";

export const codec = atomFactory("Codec", (
  deriveCodec: M.DeriveCodec,
  ty: number | M.Ty,
) => {
  return deriveCodec(ty);
});
