import * as m from "./Metadata.ts";
import { TypeVisitors } from "./TypeVisitor.ts";

export const display = (
  metadata: m.Metadata,
  typeI: number,
) => {
  const cache: Record<number, unknown> = {};

  const Fields = (...fields: m.Field[]) => {
    return fields.map((field) => {
      return {
        ...field,
        type: visitors.visit(field.type),
      };
    });
  };

  const visitors: TypeVisitors<{ [_ in m.TypeKind]: unknown }> = {
    [m.TypeKind.Struct]: (ty) => {
      return {
        ...ty,
        fields: Fields(...ty.fields),
      };
    },
    [m.TypeKind.Union]: (ty) => {
      return {
        ...ty,
        members: ty.members.map((member) => {
          return {
            ...member,
            fields: Fields(...member.fields),
          };
        }),
      };
    },
    [m.TypeKind.Sequence]: (ty) => {
      return {
        ...ty,
        typeParam: visitors.visit(ty.typeParam),
      };
    },
    [m.TypeKind.SizedArray]: (ty) => {
      return {
        ...ty,
        typeParam: visitors.visit(ty.typeParam),
      };
    },
    [m.TypeKind.Tuple]: (ty) => {
      return {
        ...ty,
        fields: ty.fields.map(visitors.visit),
      };
    },
    [m.TypeKind.Primitive]: (ty) => {
      return ty;
    },
    [m.TypeKind.Compact]: (ty) => {
      return ty;
    },
    [m.TypeKind.BitSequence]: (ty) => {
      return ty;
    },
    visit: (i) => {
      if (cache[i]) {
        return cache[i];
      }
      if (i === 103) {
        return "XMC STUFF TODO";
      }
      const type_ = metadata.types[i]!;
      const result = (visitors[type_._tag] as any)(type_);
      cache[i] = result;
      return result;
    },
  };

  return visitors.visit(typeI);
};
