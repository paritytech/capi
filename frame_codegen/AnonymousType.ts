import { TypeBase } from "/frame_codegen/TypeBase.ts";
import * as m from "/frame_metadata/mod.ts";

export class AnonymousType extends TypeBase<Exclude<m.TypeDef, m.NamedTypeDef>> {
  constructor(rawType: m.Type<Exclude<m.TypeDef, m.NamedTypeDef>>) {
    super(rawType);
  }
}
