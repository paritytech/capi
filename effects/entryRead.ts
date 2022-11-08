import * as Z from "../deps/zones.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { $storageKey } from "./$storageKey.ts";
import { codec } from "./codec.ts";
import { deriveCodec } from "./deriveCodec.ts";
import { entryMetadata, metadata, palletMetadata } from "./metadata.ts";
import { state } from "./rpc_known.ts";
import * as e$ from "./scale.ts";

export function entryRead<Client extends Z.$<rpc.Client>>(client: Client) {
  return <
    PalletName extends Z.$<string>,
    EntryName extends Z.$<string>,
    Keys extends unknown[],
    Rest extends [blockHash?: Z.$<U.HexHash | undefined>],
  >(
    palletName: PalletName,
    entryName: EntryName,
    keys: [...Keys],
    ...[blockHash]: [...Rest]
  ) => {
    const metadata_ = metadata(client)(blockHash);
    const deriveCodec_ = deriveCodec(metadata_);
    const palletMetadata_ = palletMetadata(metadata_, palletName);
    const entryMetadata_ = entryMetadata(palletMetadata_, entryName);
    const $storageKey_ = $storageKey(deriveCodec_, palletMetadata_, entryMetadata_);
    const storageKey = e$.scaleEncoded($storageKey_, Z.ls(...keys)).next(U.hex.encode);
    const storageBytesHex = state.getStorage(client)(storageKey, blockHash);
    const storageBytes = storageBytesHex.next(U.hex.decode);
    const entryValueTypeI = entryMetadata_.access("value");
    const $entry = codec(deriveCodec_, entryValueTypeI);
    return e$.scaleDecoded($entry, storageBytes, "value").zoned("EntryRead");
  };
}
