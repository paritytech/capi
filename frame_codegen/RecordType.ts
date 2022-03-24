import { nf } from "/frame_codegen/common.ts";
import { NamedTypeBase } from "/frame_codegen/NamedTypeBase.ts";
import { TypeParams } from "/frame_codegen/TypeParams.ts";
import * as m from "/frame_metadata/mod.ts";
import ts from "typescript";

export type RecordTypeStatements = [ts.InterfaceDeclaration];

export class RecordType extends NamedTypeBase<RecordTypeStatements, m.RecordTypeDef> {
  get statements(): RecordTypeStatements {
    console.log(this.rawType.path);
    const typeParams = TypeParams(this);
    const propertySignatures = this.rawType.def.fields.map(this.#FieldPropertySignature);
    return [nf.createInterfaceDeclaration(
      undefined,
      [nf.createModifier(ts.SyntaxKind.ExportKeyword)],
      this.nameIdent,
      typeParams,
      undefined,
      propertySignatures,
    )];
  }

  #FieldPropertySignature = (
    rawField: m.Field,
    i: number,
  ): ts.PropertySignature => {
    const type = this.chain.getType(rawField.type);
    return nf.createPropertySignature(
      undefined,
      nf.createIdentifier(rawField.name || i.toString()),
      undefined,
      type.node(this),
    );
  };
}
