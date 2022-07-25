import * as M from "../../frame_metadata/mod.ts";
import { atomFactory } from "../sys/Atom.ts";

export const codec = atomFactory("Codec", (
  deriveCodec: M.DeriveCodec,
  typeI: number,
) => {
  return deriveCodec(typeI);
});
