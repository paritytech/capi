import * as $ from "../../deps/scale.ts";
import * as U from "../../util/mod.ts";
import { atomFactory } from "../sys/Atom.ts";

export const storageKey = atomFactory(
  "StorageKey",
  ($storageKey: $.Codec<unknown[]>, ...keys: unknown[]) => {
    return U.hex.encode($storageKey.encode(keys)) as U.HexString;
  },
);
