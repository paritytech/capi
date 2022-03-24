import { NamedTypeBase } from "/frame_codegen/NamedTypeBase.ts";
import * as m from "/frame_metadata/mod.ts";
import ts from "typescript";

export type RecordTypeStatements = [ts.InterfaceDeclaration];

export class RecordType extends NamedTypeBase<RecordTypeStatements, m.RecordTypeDef> {
  constructor(rawType: m.Type<m.RecordTypeDef>) {
    super(rawType);
  }

  get statements(): RecordTypeStatements {
    return [] as any;
  }
}
