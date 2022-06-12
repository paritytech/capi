import * as M from "./Metadata.ts";
import { TypeVisitors } from "./TypeVisitor.ts";

export const display = (
  metadata: M.Metadata,
  typeI: number,
) => {
  const cache: Record<number, unknown> = {};

  const Fields = (...fields: M.Field[]) => {
    return fields.map((field) => {
      return {
        ...field,
        ty: visitors.visit(field.ty),
      };
    });
  };

  const visitors: TypeVisitors<{ [_ in M.TyType]: unknown }> = {
    Struct: (ty) => {
      return {
        ...ty,
        fields: Fields(...ty.fields),
      };
    },
    Union: (ty) => {
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
    Sequence: (ty) => {
      return {
        ...ty,
        typeParam: visitors.visit(ty.typeParam),
      };
    },
    SizedArray: (ty) => {
      return {
        ...ty,
        typeParam: visitors.visit(ty.typeParam),
      };
    },
    Tuple: (ty) => {
      return {
        ...ty,
        fields: ty.fields.map(visitors.visit),
      };
    },
    Primitive: (ty) => {
      return ty;
    },
    Compact: (ty) => {
      return ty;
    },
    BitSequence: (ty) => {
      return ty;
    },
    visit: (i) => {
      if (cache[i]) {
        return cache[i];
      }
      if (i === 103) {
        return "XMC STUFF TODO";
      }
      const ty = metadata.tys[i]!;
      const result = (visitors[ty.type] as any)(ty);
      cache[i] = result;
      return result;
    },
  };

  return visitors.visit(typeI);
};
