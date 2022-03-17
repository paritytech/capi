import * as d from "/scale/decode.ts";
import { assert, type IsExact } from "x/conditional_type_checks/mod.ts";

// TODO
assert<IsExact<"TODO", "TODO">>(true);

const enumOne = d.Union(
  d.Record(
    d.RecordField("_tag", d.PropertyKeyLiteral("A")),
    d.RecordField("a", d.str),
  ),
  d.Record(
    d.RecordField("_tag", d.PropertyKeyLiteral("B")),
    d.RecordField("b", d.i8),
  ),
  d.Record(
    d.RecordField("_tag", d.PropertyKeyLiteral("C")),
    d.RecordField("c", d.u128),
  ),
  d.Record(d.RecordField("_tag", d.PropertyKeyLiteral("D"))),
);
declare const enumOneDecoded: ReturnType<typeof enumOne>;
if (enumOneDecoded._tag === "A") {
  enumOneDecoded.a;
} else if (enumOneDecoded._tag === "B") {
  enumOneDecoded.b;
} else if (enumOneDecoded._tag === "C") {
  enumOneDecoded.c;
} else {
  enumOneDecoded;
}

const tupleOne = d.Tuple(d.i16, d.Option(d.i128), d.Tuple(d.i16));
declare const tupleOneDecoded: ReturnType<typeof tupleOne>;
tupleOneDecoded["0"];
tupleOneDecoded["1"];
tupleOneDecoded["2"];

const recordOne = d.Record(
  d.RecordField("a", d.str),
  d.RecordField("b", d.bool),
  d.RecordField("c", tupleOne),
  d.RecordField("d", enumOne),
);
declare const recordOneDecoded: ReturnType<typeof recordOne>;
recordOneDecoded.a;
recordOneDecoded.b;
recordOneDecoded.c;
recordOneDecoded.d;

const arrayOne = d.UnknownSizeArray(d.str);
declare const arrayOneDecoded: ReturnType<typeof arrayOne>;
arrayOneDecoded;
