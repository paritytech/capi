import { nf } from "/frame_codegen/common.ts";
import { NamedType } from "/frame_codegen/type/Named.ts";
import { TypeParams } from "/frame_codegen/type/Params.ts";
import { toAst } from "/frame_codegen/type/toAst.ts";
import * as m from "/frame_metadata/mod.ts";
import ts from "typescript";
import { camelCase } from "x/case/mod.ts";

export type RecordTypeStatements = [ts.InterfaceDeclaration];

export class RecordType extends NamedType<m.RecordTypeDef, RecordTypeStatements> {
  FieldPropertySignature = (
    rawField: m.Field,
    i: number,
  ): ts.PropertySignature => {
    const type = this.chain.getType(rawField.type);
    return nf.createPropertySignature(
      undefined,
      nf.createIdentifier(rawField.name ? camelCase(rawField.name) : i.toString()),
      undefined,
      toAst(this, type),
    );
  };

  get statements(): RecordTypeStatements {
    const typeParams = TypeParams(this);
    const propertySignatures = this.rawType.def.fields.map((field, i) => {
      return this.FieldPropertySignature(field, i);
    });
    return [nf.createInterfaceDeclaration(
      undefined,
      [nf.createModifier(ts.SyntaxKind.ExportKeyword)],
      this.nameIdent,
      typeParams,
      undefined,
      propertySignatures,
    )];
  }
}
