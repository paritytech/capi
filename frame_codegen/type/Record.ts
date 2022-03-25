import { nf } from "/frame_codegen/common.ts";
import { NamedType } from "/frame_codegen/type/Named.ts";
import { TypeParams } from "/frame_codegen/type/Params.ts";
import * as m from "/frame_metadata/mod.ts";
import ts from "typescript";

export type RecordTypeStatements = [ts.InterfaceDeclaration];

export class RecordType extends NamedType<m.RecordTypeDef, RecordTypeStatements> {
  get statements(): RecordTypeStatements {
    const typeParams = TypeParams(this); // TODO: `Timepoint` not getting the correct type params
    const propertySignatures = this.rawType.def.fields.map(this.FieldPropertySignature);
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
