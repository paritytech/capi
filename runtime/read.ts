import { Hashers } from "../bindings/mod.ts";
import * as C from "../core/mod.ts";
import * as M from "../frame_metadata/mod.ts";
import * as U from "../util/mod.ts";
import { globalContext } from "./Context.ts";

export type ReadTarget = C.Entry | C.KeyPage | C.Metadata | C.Head;

export async function read<Target extends ReadTarget = ReadTarget>(
  target: Target,
  block?: C.Block<Target["chain"]>,
) {
  const chain = await globalContext.register(target.chain.beacon as any);
  if (chain instanceof Error) {
    return chain;
  }
  const group = await chain.load(block?.hash);
  switch (target.kind) {
    case "Entry": {
      const pallet = group.lookup.getPalletByName(target.pallet.name);
      const storageEntry = group.lookup.getStorageEntryByPalletAndName(pallet, target.name);
      const $key = M.$storageMapKey({
        deriveCodec: group.deriveCodec,
        hashers: await Hashers(),
        pallet,
        storageEntry,
      });
      const key = $key.encode(target.keys.length === 1 ? target.keys[0]! : target.keys);
      const keyEncoded = U.hex.encode(key) as U.HexString;
      const raw = await chain.rpcClient.call("state_getStorage", [keyEncoded, block?.hash]);
      await chain.release();
      if (raw.result) {
        const $value = group.deriveCodec(storageEntry.value);
        return $value.decode(U.hex.decode(raw.result));
      }
      throw new Error(); // TODO
    }
    default: {
      return Promise.resolve("UNIMPLEMENTED");
    }
  }
}
