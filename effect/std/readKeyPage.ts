import { rpc as knownRpc } from "../../known/mod.ts";
import * as U from "../../util/mod.ts";
import * as a from "../atoms/mod.ts";
import * as sys from "../sys/mod.ts";

type Config = knownRpc.Config<string, "state_getMetadata" | "state_getKeysPaged">;

export function readKeyPage<
  PalletName extends sys.Val<string>,
  EntryName extends sys.Val<string>,
  Count extends sys.Val<number>,
  Rest extends [start?: unknown[] | undefined, blockHash?: sys.Val<U.HashHexString | undefined>],
>(
  config: Config,
  palletName: PalletName,
  entryName: EntryName,
  count: Count,
  ...[start, blockHash]: Rest
) {
  const metadata = a.metadata(config, blockHash);
  const deriveCodec = a.deriveCodec(metadata);
  const palletMetadata = a.palletMetadata(metadata, palletName);
  const entryMetadata = sys.anon([a.entryMetadata(palletMetadata, entryName)], (entryMetadata) => {
    if (entryMetadata.type !== "Map") {
      return new ReadingKeysOfNonMapError();
    }
    return entryMetadata;
  });
  const $storageKey = a.$storageKey(deriveCodec, palletMetadata, entryMetadata);
  const startKey = start ? a.storageKey($storageKey, start) : undefined;
  const storageKey = a.storageKey($storageKey, []);
  const call = a.rpcCall(config, "state_getKeysPaged", [storageKey, count, startKey, blockHash]);
  const $key = a.$key(deriveCodec, palletMetadata, entryMetadata);
  const keysEncoded = a.select(call, "result");
  const keysDecoded = sys.anon([$key, keysEncoded], ($key, keysEncoded) => {
    return keysEncoded.map((keyEncoded) => {
      return $key.decode(U.hex.decode(keyEncoded));
    });
  });
  return a.wrap(keysDecoded, "keys");
}

export class ReadingKeysOfNonMapError extends U.ErrorCtor("ReadingKeysOfNonMap") {}
