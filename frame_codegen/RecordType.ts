import { Chain } from "/frame_codegen/Chain.ts";
import { FieldPropertySignatureFactory, nf } from "/frame_codegen/common.ts";
import { isNamedType } from "/frame_codegen/NamedType.ts";
import { NamedTypeBase } from "/frame_codegen/NamedTypeBase.ts";
import * as m from "/frame_metadata/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";

export type RecordTypeStatements = [ts.InterfaceDeclaration];

const NoConstraint: unique symbol = Symbol("NoConstraint");
type NoConstraint = typeof NoConstraint;

export class RecordType extends NamedTypeBase<RecordTypeStatements, m.RecordTypeDef> {
  constructor(
    chain: Chain,
    rawType: m.Type<m.RecordTypeDef>,
  ) {
    super(chain, rawType);
  }

  get statements(): RecordTypeStatements {
    const typeParams: ts.TypeParameterDeclaration[] = [];
    if (this.overloads.length > 1) {
      const constraintGroups: [string, (ts.Identifier | NoConstraint)[]][] = [];
      this.overloads.forEach((typeParams) => {
        typeParams.forEach((typeParam, i) => {
          if (!constraintGroups[i]) {
            constraintGroups.push([typeParam.name, []]);
          }
          if (typeParam.type) {
            const typeParamType = this.chain.getType(typeParam.type);
            if (isNamedType(typeParamType)) {
              const importName = this.addImport(typeParamType);
              constraintGroups[i]![1].push(importName);
            } else {
              constraintGroups[i]![1].push(nf.createIdentifier("TODOAnonymousTypesAsConstraints"));
            }
          } else {
            constraintGroups[i]![1].push(NoConstraint);
          }
        });
      });
      constraintGroups.forEach(([name, constraintIdents]) => {
        const constraintTypeReferences = constraintIdents.reduce<ts.TypeReferenceNode[]>((acc, constraintIdent) => {
          return [...acc, ...constraintIdent === NoConstraint ? [] : [nf.createTypeReferenceNode(constraintIdent)]];
        }, []);
        const constraintUnionOrUndefined = constraintTypeReferences.length > 0
          ? nf.createUnionTypeNode(constraintTypeReferences)
          : undefined;
        typeParams.push(nf.createTypeParameterDeclaration(
          nf.createIdentifier(name),
          constraintUnionOrUndefined,
          undefined,
        ));
      });
    }
    const FieldPropertySignature = FieldPropertySignatureFactory(this);
    const propertySignatures = this.rawType.def.fields.map(FieldPropertySignature);
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
