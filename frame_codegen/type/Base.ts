import { Chain } from "/frame_codegen/Chain.ts";
import * as m from "/frame_metadata/mod.ts";

export class Type<TypeDef extends m.TypeDef = m.TypeDef> {
  constructor(
    readonly chain: Chain,
    readonly rawType: m.Type<TypeDef>,
  ) {}
}
