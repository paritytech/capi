import * as $ from "../deps/scale.ts";
import * as Z from "../deps/zones.ts";
import * as M from "../frame_metadata/mod.ts";
import * as rpc from "../rpc/mod.ts";
import * as U from "../util/mod.ts";
import { state } from "./rpc/known.ts";

export function metadata<Client extends Z.$<rpc.Client>>(client: Client) {
  return <Rest extends [blockHash?: Z.$<U.HexHash | undefined>]>(...[blockHash]: [...Rest]) => {
    return Z.call(
      state.getMetadata(client)(blockHash),
      function metadataImpl(encoded) {
        try {
          return M.fromPrefixedHex(encoded);
        } catch (e) {
          return e as $.ScaleError;
        }
      },
    ).zoned("Metadata");
  };
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
  ).zoned("PalletMetadata");
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
  ).zoned("EntryMetadata");
}

export function constMetadata<
  PalletMetadata extends Z.$<M.Pallet>,
  ConstName extends Z.$<string>,
>(
  palletMetadata: PalletMetadata,
  constName: ConstName,
) {
  return Z.call(
    Z.ls(palletMetadata, constName),
    function constMetadataImpl([palletMetadata, constName]) {
      return M.getConst(palletMetadata, constName);
    },
  ).zoned("ConstMetadata");
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
  ).zoned("MapMetadata");
}

export class ExpectedMapError extends Error {
  override readonly name = "ExpectedMapError";
}
