import { rpc as knownRpc } from "../../known/mod.ts";
import * as U from "../../util/mod.ts";
import * as a from "../atoms/mod.ts";
import * as sys from "../sys/mod.ts";

export function readEntry<
  C extends knownRpc.Config<string, "state_getMetadata" | "state_getStorage">,
  PalletName extends sys.Val<string>,
  EntryName extends sys.Val<string>,
  Keys extends unknown[],
  Rest extends [blockHash?: sys.Val<U.HashHexString | undefined>],
>(
  config: C,
  palletName: PalletName,
  entryName: EntryName,
  keys: Keys,
  ...[blockHash]: Rest
) {
  const metadata_ = a.metadata(config, blockHash);
  const deriveCodec_ = a.deriveCodec(metadata_);
  const palletMetadata_ = a.palletMetadata(metadata_, palletName);
  const entryMetadata_ = a.entryMetadata(palletMetadata_, entryName);
  const $storageKey = a.$storageKey(deriveCodec_, palletMetadata_, entryMetadata_);
  const storageKey = a.storageKey($storageKey, keys);
  const storageCall = a.rpcCall(config, "state_getStorage", [storageKey, blockHash]);
  const entryValueTypeI = a.select(entryMetadata_, "value");
  const $entry = a.codec(deriveCodec_, entryValueTypeI);
  const resultHex = a.select(storageCall, "result");
  return a.decoded($entry, resultHex, "value");
}
