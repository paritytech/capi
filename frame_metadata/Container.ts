import { MetadataLookup } from "/frame_metadata/Lookup.ts";
import { metadataRaw } from "/frame_metadata/Raw.ts";
import { run } from "/scale/decode.ts";
import * as hex from "std/encoding/hex.ts";
import * as asserts from "std/testing/asserts.ts";

export class MetadataContainer {
  lookup;
  raw;

  constructor(scaleEncoded: string) {
    const raw = run(metadataRaw, hex.decode(new TextEncoder().encode(scaleEncoded)));
    asserts.assert(raw._tag === 14);
    this.lookup = new MetadataLookup(raw);
    this.raw = raw;
  }
}
