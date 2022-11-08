import * as Z from "../deps/zones.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { $storageKey } from "./core/$storageKey.ts";
import { deriveCodec } from "./core/deriveCodec.ts";
import * as e$ from "./core/scale.ts";
import { mapMetadata, metadata, palletMetadata } from "./metadata.ts";
import { state } from "./rpc/known.ts";

export function keyPageRead<Client extends Z.$<rpc.Client>>(client: Client) {
  return <
    PalletName extends Z.$<string>,
    EntryName extends Z.$<string>,
    Count extends Z.$<number>,
    PartialKey extends unknown[],
    Rest extends [start?: unknown[] | undefined, blockHash?: Z.$<U.HexHash | undefined>],
  >(
    palletName: PalletName,
    entryName: EntryName,
    count: Count,
    partialKey: [...PartialKey],
    ...[start, blockHash]: [...Rest]
  ) => {
    const metadata_ = metadata(client)(blockHash as Rest[1]);
    const deriveCodec_ = deriveCodec(metadata_);
    const palletMetadata_ = palletMetadata(metadata_, palletName);
    const entryMetadata_ = mapMetadata(palletMetadata_, entryName);
    const $storageKey_ = $storageKey(deriveCodec_, palletMetadata_, entryMetadata_);
    const storageKey = Z.call(e$.encoded($storageKey_, Z.ls(...partialKey)), U.hex.encode);
    const startKey = start ? Z.call(e$.encoded($storageKey_, []), U.hex.encode) : undefined;
    const keysEncoded = state.getKeysPaged(client)(
      storageKey,
      count,
      startKey,
      blockHash as Rest[1],
    );
    return Z
      .call(Z.ls($storageKey_, keysEncoded), function keysDecodedImpl([$key, keysEncoded]) {
        return keysEncoded.map((keyEncoded: U.Hex) => {
          return $key.decode(U.hex.decode(keyEncoded));
        });
      })
      .zoned("KeyPageRead");
  };
}
