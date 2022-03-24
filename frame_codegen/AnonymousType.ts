import { Chain } from "/frame_codegen/Chain.ts";
import { nf } from "/frame_codegen/common.ts";
import { TypeBase } from "/frame_codegen/TypeBase.ts";
import * as m from "/frame_metadata/mod.ts";
import ts from "typescript";

export class AnonymousType extends TypeBase<Exclude<m.TypeDef, m.NamedTypeDef>> {
  constructor(
    chain: Chain,
    rawType: m.Type<Exclude<m.TypeDef, m.NamedTypeDef>>,
  ) {
    super(chain, rawType);
  }

  get node(): ts.TypeNode {
    return nf.createLiteralTypeNode(nf.createStringLiteral("TODO"));
  }
}
