import { effector } from "../impl/mod.ts";
import { codec } from "./atoms/codec.ts";
import { decoded } from "./atoms/decoded.ts";
import { deriveCodec } from "./atoms/deriveCodec.ts";
import { entryKey } from "./atoms/entryKey.ts";
import { entryMetadata } from "./atoms/entryMetadata.ts";
import { metadataLookup } from "./atoms/metadataLookup.ts";
import { palletMetadata } from "./atoms/palletMetadata.ts";
import { select } from "./atoms/select.ts";
import { wrap } from "./atoms/wrap.ts";
import { Entry } from "./entry.ts";
import { metadata } from "./metadata.ts";
import { rpcCall } from "./rpcCall.ts";

// TODO: flatten primitive?
export const read = effector.async("read", () =>
  (entry: Entry) => {
    const metadata_ = metadata(entry.pallet.rpc);
    const metadataLookup_ = metadataLookup(metadata_);
    const deriveCodec_ = deriveCodec(metadata_);
    const palletMetadata_ = palletMetadata(metadataLookup_, entry.pallet.name);
    const entryMetadata_ = entryMetadata(metadataLookup_, palletMetadata_, entry.name);
    const key = entryKey(deriveCodec_, palletMetadata_, entryMetadata_, entry.key);
    const rpcCall_ = rpcCall(entry.pallet.rpc, "state_getStorage", key);
    const encoded = select(rpcCall_, "result");
    const entryValueTypeI = select(entryMetadata_, "value");
    const entryCodec_ = codec(deriveCodec_, entryValueTypeI);
    const decoded_ = decoded(entryCodec_, encoded);
    return wrap(decoded_, "value").run();
  });
