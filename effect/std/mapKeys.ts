import { effector } from "../../effect/impl/mod.ts";
import { deriveCodec } from "../../effect/std/atoms/deriveCodec.ts";
import { entryKey } from "../../effect/std/atoms/entryKey.ts";
import { entryMetadata } from "../../effect/std/atoms/entryMetadata.ts";
import { metadataLookup } from "../../effect/std/atoms/metadataLookup.ts";
import { palletMetadata } from "../../effect/std/atoms/palletMetadata.ts";
import { select } from "../../effect/std/atoms/select.ts";
import { wrap } from "../../effect/std/atoms/wrap.ts";
import { Map } from "../../effect/std/map.ts";
import { metadata } from "../../effect/std/metadata.ts";
import { rpcCall } from "../../effect/std/rpcCall.ts";
import * as U from "../../util/mod.ts";

// TODO: flatten primitive?
export const mapKeys = effector.async(
  "mapKeys",
  () =>
    (map: Map, count?: number, startKey?: U.HashHexString) => {
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
