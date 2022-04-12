import { nf } from "/frame_codegen/common.ts";
import { NamedType } from "/frame_codegen/type/Named.ts";
import ts from "typescript";

const NoConstraint: unique symbol = Symbol("NoConstraint");
type NoConstraint = typeof NoConstraint;

export const TypeParams = (type: NamedType) => {
  const typeParams: ts.TypeParameterDeclaration[] = [];
  if (type.overloads.length > 1) {
    const constraintGroups: [string, (ts.Identifier | NoConstraint)[]][] = [];
    type.overloads.forEach((typeParams) => {
      typeParams.forEach((typeParam, i) => {
        if (!constraintGroups[i]) {
          constraintGroups.push([typeParam.name, []]);
        }
        if (typeParam.type) {
          const typeParamType = type.chain.getType(typeParam.type);
          if (typeParamType instanceof NamedType) {
            const importName = type.addImport(typeParamType);
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
  return typeParams;
};
