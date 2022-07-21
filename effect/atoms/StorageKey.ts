import * as $ from "../../deps/scale.ts";
import * as U from "../../util/mod.ts";
import { atom } from "../sys/Atom.ts";
import { Val } from "../sys/Effect.ts";

export function storageKey<
  StorageKeyCodec extends Val<$.Codec<unknown>>,
  KeysRest extends [keys?: Val<unknown>[] | undefined],
>(
  $storageKey: StorageKeyCodec,
  ...[keys]: KeysRest
) {
  return atom(
    "StorageKey",
    [$storageKey, ...keys ? keys : []],
    ($storageKey, ...keys) => {
      return U.hex.encode($storageKey.encode(keys.length === 1 ? keys[0] : keys)) as U.HexString;
    },
  );
}
