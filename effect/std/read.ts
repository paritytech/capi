import { HOEffect } from "/effect/Effect.ts";
import { codec } from "/effect/std/atoms/codec.ts";
import { decoded } from "/effect/std/atoms/decoded.ts";
import { deriveCodec } from "/effect/std/atoms/deriveCodec.ts";
import { entryKey } from "/effect/std/atoms/entryKey.ts";
import { entryMetadata } from "/effect/std/atoms/entryMetadata.ts";
import { metadataLookup } from "/effect/std/atoms/metadataLookup.ts";
import { palletMetadata } from "/effect/std/atoms/palletMetadata.ts";
import { select } from "/effect/std/atoms/select.ts";
import { AnyEntry } from "/effect/std/Entry.ts";
import { metadata } from "/effect/std/Metadata.ts";
import { rpcCall } from "/effect/std/RpcCall.ts";

export class Read<Entry extends AnyEntry = AnyEntry> extends HOEffect {
  root;

  constructor(readonly entry: Entry) {
    super();
    const metadata_ = metadata(entry.pallet.beacon);
    const metadataLookup_ = metadataLookup(metadata_);
    const deriveCodec_ = deriveCodec(metadata_);
    const palletMetadata_ = palletMetadata(metadataLookup_, entry.pallet.name);
    const entryMetadata_ = entryMetadata(metadataLookup_, palletMetadata_, entry.name);
    const key = entryKey(deriveCodec_, palletMetadata_, entryMetadata_, ...entry.keys);
    const rpcCall_ = rpcCall(entry.pallet.beacon, "state_getStorage", key);
    const encoded = select(rpcCall_, "result");
    const entryValueTypeI = select(entryMetadata_, "value");
    const entryCodec_ = codec(deriveCodec_, entryValueTypeI);
    this.root = decoded(entryCodec_, encoded);
  }
}

export const read = <Entry extends AnyEntry>(entry: Entry): Read<Entry> => {
  return new Read(entry);
};
