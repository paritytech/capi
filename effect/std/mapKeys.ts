import * as B from "../../branded.ts";
import { effector } from "../impl/mod.ts";
import { deriveCodec } from "./atoms/deriveCodec.ts";
import { entryKey } from "./atoms/entryKey.ts";
import { entryMetadata } from "./atoms/entryMetadata.ts";
import { metadataLookup } from "./atoms/metadataLookup.ts";
import { palletMetadata } from "./atoms/palletMetadata.ts";
import { select } from "./atoms/select.ts";
import { wrap } from "./atoms/wrap.ts";
import { Map } from "./map.ts";
import { metadata } from "./metadata.ts";
import { rpcCall } from "./rpcCall.ts";

// TODO: flatten primitive?
export const mapKeys = effector.async(
  "mapKeys",
  () =>
    (map: Map, count?: number, startKey?: B.HashHexString) => {
      const metadata_ = metadata(map.pallet.rpc);
      const metadataLookup_ = metadataLookup(metadata_);
      const deriveCodec_ = deriveCodec(metadata_);
      const palletMetadata_ = palletMetadata(metadataLookup_, map.pallet.name);
      const entryMetadata_ = entryMetadata(metadataLookup_, palletMetadata_, map.name);
      const key = entryKey(deriveCodec_, palletMetadata_, entryMetadata_);
      // TODO: why is `undefined` an invalid argument for `count`?
      const rpcCall_ = rpcCall(map.pallet.rpc, "state_getKeysPaged", key, count!, startKey);
      const keys = select(rpcCall_, "result");
      return wrap(keys, "keys").run();
    },
);
