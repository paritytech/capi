import { Container } from "/effect/Base.ts";
import { select } from "/effect/intrinsic/Select.ts";
import { codec } from "/effect/std/atoms/codec.ts";
import { decoded } from "/effect/std/atoms/decoded.ts";
import { deriveCodec } from "/effect/std/atoms/deriveCodec.ts";
import { entryKey } from "/effect/std/atoms/entryKey.ts";
import { entryMetadata } from "/effect/std/atoms/entryMetadata.ts";
import { metadataLookup } from "/effect/std/atoms/metadataLookup.ts";
import { palletMetadata } from "/effect/std/atoms/palletMetadata.ts";
import { AnyEntry } from "/effect/std/entry.ts";
import { metadata } from "/effect/std/metadata.ts";
import { rpcCall } from "/effect/std/rpcCall.ts";

export class Read<Entry extends AnyEntry> extends Container {
  inner;

  constructor(readonly entry: Entry) {
    super();
    const metadata_ = metadata(entry.pallet.beacon);
    const metadataLookup_ = metadataLookup(metadata_);
    const deriveCodec_ = deriveCodec(metadata_);
    const palletMetadata_ = palletMetadata(metadataLookup_, entry.pallet.name);
    // TODO: fix the typing
    const entryMetadata_ = entryMetadata(metadataLookup_, palletMetadata_ as any, entry.name);
    // TODO: fix the typing
    const key = entryKey(deriveCodec_, palletMetadata_ as any, entryMetadata_ as any, ...entry.keys);
    const rpcCall_ = rpcCall(entry.pallet.beacon, "state_getStorage", key);
    const encoded = select(rpcCall_, "result");
    // TODO
    const entryValueTypeI = select(entryMetadata_, "value" as never);
    const entryCodec_ = codec(deriveCodec_, entryValueTypeI);
    // TODO
    const decoded_ = decoded(encoded, entryCodec_ as any);
    // const decoded =
    this.inner = decoded_;
  }
}

export type AnyRead = Read<AnyEntry>;

export const read = <Entry extends AnyEntry>(entry: Entry): Read<Entry> => {
  return new Read(entry);
};
