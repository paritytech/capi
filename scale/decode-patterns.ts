import * as d from "/scale/decode.ts";

// TODO: explicitly type this with `Tagged` util type.
export const Tagged = <
  Tag extends PropertyKey,
  Fields extends d.AnyRecordField[],
>(
  tag: Tag,
  ...fields: Fields
): d.Decoder<d.RecordDecoded<Fields> & { _tag: Tag }> => {
  return d.Record(
    // TODO: assure checker that `_tag` will never exist on one of the supplied `Field`s... or not ;)
    // ... depends on whether we want to do a variadic decode vs. union-to-intersection.
    // ... kind of an irrelevant implementation detail for the time being.
    ...fields as any,
    d.RecordField("_tag", d.PropertyKeyLiteral(tag)),
  );
};

// export const OmitFieldIf<Field extends d.AnyRecordField>

export const compactAsNum = d.As<number>(d.compact);

// export const SkipRecordFieldIfEmptyArray = <
//   FieldName extends PropertyKey,
//   ValueDecoder extends d.ArrayDecoder<d.AnyDecoder, number>,
// >(
//   fieldName: FieldName,
//   valueDecoder: ValueDecoder,
// ): d.Decoder<d.OptionalRecordFieldDecoded<FieldName, ValueDecoder>> => {
//   return d.SkipRecordFieldIf(fieldName, valueDecoder, (value) => value.length === 0);
// };

// export const SkipRecordFieldIfUndefined = <
//   FieldName extends PropertyKey,
//   ValueDecoder extends d.AnyOptionDecoder,
// >(
//   fieldName: FieldName,
//   valueDecoder: ValueDecoder,
// ): d.Decoder<d.OptionalRecordFieldDecoded<FieldName, ValueDecoder>> => {
//   return d.SkipRecordFieldIf(fieldName, valueDecoder, (value) => value === undefined);
// };
