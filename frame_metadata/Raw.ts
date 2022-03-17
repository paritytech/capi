// TODO: rename file
import { TagBearer } from "/_/util/bearer.ts";
import { MetadataRawV14, metadataRawV14 } from "/frame_metadata/V14.ts";
import * as dp from "/scale/decode-patterns.ts";
import * as d from "/scale/decode.ts";

export type MetadataVersion = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
export type MetadataRaw =
  | TagBearer<0>
  | TagBearer<1>
  | TagBearer<2>
  | TagBearer<3>
  | TagBearer<4>
  | TagBearer<5>
  | TagBearer<6>
  | TagBearer<7>
  | TagBearer<8>
  | TagBearer<9>
  | TagBearer<10>
  | TagBearer<11>
  | TagBearer<12>
  | TagBearer<13>
  | MetadataRawV14;
export const metadataRaw: d.Decoder<MetadataRaw> = d.Union(
  dp.Tagged(0),
  dp.Tagged(1),
  dp.Tagged(2),
  dp.Tagged(3),
  dp.Tagged(4),
  dp.Tagged(5),
  dp.Tagged(6),
  dp.Tagged(7),
  dp.Tagged(8),
  dp.Tagged(9),
  dp.Tagged(10),
  dp.Tagged(11),
  dp.Tagged(12),
  dp.Tagged(13),
  metadataRawV14,
);
