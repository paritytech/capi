import * as $ from "../../deps/scale.ts";
import * as Z from "../../deps/zones.ts";
import * as U from "../../util/mod.ts";

export const storageKey = Z.call.fac((
  $storageKey: $.Codec<unknown[]>,
  ...keys: unknown[]
) => {
  return U.hex.encode($storageKey.encode(keys)) as U.Hex;
});
