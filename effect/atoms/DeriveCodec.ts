import * as M from "../../frame_metadata/mod.ts";
import { atom } from "../sys/Atom.ts";
import { Val } from "../sys/Effect.ts";

export type deriveCodec = typeof deriveCodec;
export function deriveCodec<Metadata extends Val<M.Metadata>>(metadata: Metadata) {
  return atom(
    "DeriveCodec",
    [metadata],
    (metadata) => {
      return M.DeriveCodec(metadata.tys);
    },
  );
}
