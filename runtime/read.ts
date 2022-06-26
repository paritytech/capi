import { Hashers } from "../bindings/mod.ts";
import * as C from "../core/mod.ts";
import * as M from "../frame_metadata/mod.ts";
import * as U from "../util/mod.ts";
import { globalContext } from "./Context.ts";

export type ReadTarget = C.Entry | C.KeyPage | C.Metadata | C.Header;

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
      if (raw.result) {
        await chain.release();
        return group
          .deriveCodec(storageEntry.value)
          .decode(U.hex.decode(raw.result));
      }
      throw new Error(); // TODO
    }
    case "Metadata": {
      await chain.release();
      return group.metadata;
    }
    case "Header": {
      const raw = await chain.rpcClient.call("chain_getHeader", [block?.hash]);
      await chain.release();
      if (raw.result) {
        // TODO: parse this
        return raw.result;
      }
      throw new Error();
    }
    case "KeyPage": {
      const pallet = group.lookup.getPalletByName(target.entry.pallet.name);
      const storageEntry = group.lookup.getStorageEntryByPalletAndName(pallet, target.entry.name);
      const $key = M.$storageMapKey({
        deriveCodec: group.deriveCodec,
        hashers: await Hashers(),
        pallet,
        storageEntry,
      });
      const key = U.hex.encode($key.encode([])) as U.HashHexString;
      const startKey = target.start.length > 0
        ? (U.hex.encode($key.encode(target.start)) as U.HashHexString)
        : undefined;
      const raw = await chain.rpcClient.call("state_getKeysPaged", [
        key,
        target.count,
        startKey,
        block?.hash,
      ]);
      await chain.release();
      if (raw.result) {
        return raw.result.map((key) => {
          const trimmed = key.substring(2);
          const bytes = U.hex.decode(trimmed);
          return $key.decode(bytes);
        });
      }
      throw new Error(); // TODO
    }
  }
}
