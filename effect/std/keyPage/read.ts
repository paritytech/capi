import { Config } from "../../../config/mod.ts";
import { KnownRpcMethods } from "../../../known/mod.ts";
import * as U from "../../../util/mod.ts";
import * as a from "../../atoms/mod.ts";
import * as sys from "../../sys/mod.ts";

export function readKeyPage<
  C extends Config<string, Pick<KnownRpcMethods, "state_getMetadata" | "state_getKeysPaged">>,
  PalletName extends sys.Val<string>,
  EntryName extends sys.Val<string>,
  Count extends sys.Val<number>,
  Rest extends [start?: unknown[] | undefined, blockHash?: sys.Val<U.HashHexString | undefined>],
>(
  config: C,
  palletName: PalletName,
  entryName: EntryName,
  count: Count,
  ...[start, blockHash]: Rest
) {
  const metadata_ = a.metadata(config, blockHash);
  const deriveCodec_ = a.deriveCodec(metadata_);
  const palletMetadata_ = a.palletMetadata(metadata_, palletName);
  const entryMetadata_ = a.entryMetadata(palletMetadata_, entryName);
  const storageKeyCodec_ = a.storageKeyCodec(deriveCodec_, palletMetadata_, entryMetadata_);
  const startKey = start ? a.storageKey(storageKeyCodec_, start) : undefined;
  const storageCall = a.rpcCall(
    config,
    "state_getKeysPaged",
    a.storageKey(storageKeyCodec_),
    count,
    startKey,
    blockHash,
  );
  const keysEncoded = a.select(storageCall, "result");
  const $key = a.keyCodec(deriveCodec_, palletMetadata_, entryMetadata_);
  const decoded = sys.atom(
    "Anonymous",
    [$key, keysEncoded],
    (keyCodec, keysEncoded) => {
      return keysEncoded.map((keyEncoded) => {
        return keyCodec.decode(U.hex.decode(keyEncoded));
      });
    },
  );
  return a.wrap(decoded, "keys");
}

export class ReadingKeysOfNonMapError extends U.ErrorCtor("ReadingKeysOfNonMap") {}
