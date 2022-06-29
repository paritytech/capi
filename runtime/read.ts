import { Hashers } from "../bindings/mod.ts";
import * as core from "../core/mod.ts";
import * as M from "../frame_metadata/mod.ts";
import * as U from "../util/mod.ts";
import { globalContext } from "./Context.ts";

export type ReadTarget = core.Entry | core.KeyPage | core.Metadata | core.Header | core.Block;

export async function read<Target extends ReadTarget = ReadTarget>(
  target: Target,
  block?: core.Block<Target["chain"]>,
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
      const $key = M.$storageKey({
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
      const $key = M.$storageKey({
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
    case "Block": {
      const raw = await chain.rpcClient.call("chain_getBlock", [target.hash]);
      if (raw.result) {
        const { block, justifications } = raw.result;
        const { extrinsics, header } = block;
        const $extrinsic = M.$extrinsic({
          deriveCodec: group.deriveCodec,
          hashers: await Hashers(),
          metadata: group.metadata,
          sign: undefined!,
        });
        await chain.release();
        return {
          justifications,
          block: {
            header,
            extrinsics: extrinsics.map((extrinsic) => {
              const trimmed = extrinsic.substring(2);
              const bytes = U.hex.decode(trimmed);
              return $extrinsic.decode(bytes);
            }),
          },
        };
      }
      throw new Error();
    }
  }
}
