import * as $ from "../deps/scale.ts";
import * as Z from "../deps/zones.ts";
import * as M from "../frame_metadata/mod.ts";
import { Config } from "../mod.ts";
import * as U from "../util/mod.ts";
import { rpcCall } from "./rpcCall.ts";

export function metadata<Rest extends [blockHash?: Z.$<U.HexHash | undefined>]>(
  config: Config,
  ...[blockHash]: [...Rest]
) {
  return Z.call(
    rpcCall(config, "state_getMetadata", [blockHash]),
    function metadataImpl(call) {
      try {
        return M.fromPrefixedHex(call.result);
      } catch (e) {
        return e as $.CodecError;
      }
    },
  );
}

export function palletMetadata<Metadata extends Z.$<M.Metadata>, PalletName extends Z.$<string>>(
  metadata: Metadata,
  palletName: PalletName,
) {
  return Z.call(
    Z.ls(metadata, palletName),
    function palletMetadataImpl([metadata, palletName]) {
      return M.getPallet(metadata, palletName);
    },
  );
}

export function entryMetadata<PalletMetadata extends Z.$<M.Pallet>, EntryName extends Z.$<string>>(
  palletMetadata: PalletMetadata,
  entryName: EntryName,
) {
  return Z.call(
    Z.ls(palletMetadata, entryName),
    function entryMetadataImpl([palletMetadata, entryName]) {
      return M.getEntry(palletMetadata, entryName);
    },
  );
}

export function mapMetadata<PalletMetadata extends Z.$<M.Pallet>, EntryName extends Z.$<string>>(
  palletMetadata: PalletMetadata,
  entryName: EntryName,
) {
  return Z.call(
    Z.ls(palletMetadata, entryName),
    function mapMetadataImpl([palletMetadata, entryName]) {
      const entryMetadata = M.getEntry(palletMetadata, entryName);
      if (entryMetadata instanceof Error) return entryMetadata;
      if (entryMetadata.type !== "Map") {
        return new ExpectedMapError();
      }
      return entryMetadata;
    },
  );
}

export class ExpectedMapError extends U.ErrorCtor("ExpectedMap") {}
