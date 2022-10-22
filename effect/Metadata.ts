import * as $ from "../deps/scale.ts";
import * as Z from "../deps/zones.ts";
import * as M from "../frame_metadata/mod.ts";
import { Config } from "../mod.ts";
import * as U from "../util/mod.ts";
import { RpcCall } from "./RpcCall.ts";

export class Metadata<Rest extends [blockHash?: Z.$<U.HexHash | undefined>]> extends Z.Name {
  root;

  constructor(config: Config, ...[blockHash]: [...Rest]) {
    super();
    this.root = Z.call(
      new RpcCall(config, "state_getMetadata", [blockHash]),
      function metadataImpl(call) {
        try {
          return M.fromPrefixedHex(call.result);
        } catch (e) {
          return e as $.CodecError;
        }
      },
    );
  }

  pallet = <PalletName extends Z.$<string>>(palletName: PalletName) => {
    return new PalletMetadata(this, palletName);
  };
}

export class PalletMetadata<Metadata extends Z.$<M.Metadata>, PalletName extends Z.$<string>>
  extends Z.Name
{
  root;

  constructor(
    readonly metadata: Metadata,
    readonly palletName: PalletName,
  ) {
    super();
    this.root = Z.call(
      Z.ls(metadata, palletName),
      function palletMetadataImpl([metadata, palletName]) {
        return M.getPallet(metadata, palletName);
      },
    );
  }

  entry = <EntryName extends Z.$<string>>(entryName: EntryName) => {
    return new EntryMetadata(this, entryName);
  };
}

export class EntryMetadata<PalletMetadata extends Z.$<M.Pallet>, EntryName extends Z.$<string>>
  extends Z.Name
{
  root;

  constructor(
    readonly palletMetadata: PalletMetadata,
    readonly entryName: EntryName,
  ) {
    super();
    this.root = Z.call(
      Z.ls(palletMetadata, entryName),
      function entryMetadataImpl([palletMetadata, entryName]) {
        return M.getEntry(palletMetadata, entryName);
      },
    );
  }
}
