import { visitFixtures } from "/_/util/testing.ts";
import { metadataRaw } from "/frame_metadata/Raw.ts";
import { run } from "/scale/decode.ts";
import { frame_metadata_ } from "/target/wasm/frame_metadata_fixtures/mod.js";
import * as asserts from "std/testing/asserts.ts";

Deno.test("FRAME Metadata Decoder", () => {
  visitFixtures(frame_metadata_, (bytes, _json) => {
    const metadata = run(metadataRaw, bytes.slice(8));
    asserts.assert(metadata._tag === 14);
    console.log(metadata);
  }, () => {/* TODO: pre-process Rust-authored fixtures to match capi's FRAME metadata representation */});
});
