import { Config } from "../../../Config.ts";
import { KnownRpcMethods } from "../../../known/mod.ts";
import * as U from "../../../util/mod.ts";
import * as a from "../../atoms/mod.ts";
import * as sys from "../../sys/mod.ts";

export function readKeys<
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
  const storageKey_ = a.storageKey(deriveCodec_, palletMetadata_, entryMetadata_);
  const startKey = start
    ? a.storageKey(deriveCodec_, palletMetadata_, entryMetadata_, start)
    : undefined;
  const storageCall = a.rpcCall(
    config,
    "state_getKeysPaged",
    storageKey_,
    count,
    startKey,
    blockHash,
  );
  const keysEncoded = a.select(storageCall, "result");
  const mapEntryMetadata = sys.atom("Anonymous", [entryMetadata_], (entryMetadata) => {
    if (entryMetadata.type === "Map") {
      return entryMetadata;
    }
    return new ReadingKeysOfNonMapError();
  });
  const entryKeyTypeI = a.select(mapEntryMetadata, "key");
  const entryKeyCodec = a.codec(deriveCodec_, entryKeyTypeI);
  // TODO: flat map one effect into another
  return a.wrap(keysEncoded, "keys");
}

export class ReadingKeysOfNonMapError extends U.ErrorCtor("ReadingKeysOfNonMap") {}
