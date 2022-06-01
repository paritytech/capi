import { effector } from "/effect/Effect.ts";
import { codec } from "/effect/std/atoms/codec.ts";
import { decoded } from "/effect/std/atoms/decoded.ts";
import { deriveCodec } from "/effect/std/atoms/deriveCodec.ts";
import { entryKey } from "/effect/std/atoms/entryKey.ts";
import { entryMetadata } from "/effect/std/atoms/entryMetadata.ts";
import { metadataLookup } from "/effect/std/atoms/metadataLookup.ts";
import { palletMetadata } from "/effect/std/atoms/palletMetadata.ts";
import { select } from "/effect/std/atoms/select.ts";
import { wrap } from "/effect/std/atoms/wrap.ts";
import { Entry } from "/effect/std/Entry.ts";
import { metadata } from "/effect/std/Metadata.ts";
import { rpcCall } from "/effect/std/rpcCall.ts";
import { HexString } from "/rpc/mod.ts";

// TODO: flatten primitive?
export const read = effector.async("read", () =>
  (entry: Entry) => {
    const metadata_ = metadata(entry.pallet.rpc);
    const metadataLookup_ = metadataLookup(metadata_);
    const deriveCodec_ = deriveCodec(metadata_);
    const palletMetadata_ = palletMetadata(metadataLookup_, entry.pallet.name);
    const entryMetadata_ = entryMetadata(metadataLookup_, palletMetadata_, entry.name);
    const key = entryKey(deriveCodec_, palletMetadata_, entryMetadata_, ...entry.keys);
    const rpcCall_ = rpcCall(entry.pallet.rpc, "state_getStorage", key as unknown as HexString);
    const encoded = select(rpcCall_, "result");
    const entryValueTypeI = select(entryMetadata_, "value");
    const entryCodec_ = codec(deriveCodec_, entryValueTypeI);
    const decoded_ = decoded(entryCodec_, encoded);
    return wrap(decoded_, "value").run();
  });
