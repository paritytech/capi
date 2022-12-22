import { unreachable } from "../deps/std/testing/asserts.ts"
import { Ty, TyDef, UnionTyDefMember } from "../scale_info/mod.ts"
import { Metadata } from "./Metadata.ts"

export function normalizeTys({ V3: { types, ...v3Rest }, ...topLevelRest }: Metadata): Metadata {
  return {
    ...topLevelRest,
    V3: {
      ...v3Rest,
      types: types.map(fromRawTy),
    },
  }
}

// TODO: stricter typings? Not the most necessary atm.
function fromRawTy({ type: { def, params, path }, id }: any): Ty {
  return {
    id,
    path,
    params: params ? normalizeFields(params) : [],
    // TODO: grab this from appropriate loc
    docs: [],
    ...((): TyDef => {
      if (def.primitive) {
        return {
          type: "Primitive",
          kind: def.primitive,
        }
      } else if (def.composite) {
        return {
          type: "Struct",
          fields: normalizeFields(def.composite.fields),
        }
      } else if (def.variant) {
        return {
          type: "Union",
          members: def.variant.variants.map((variant: any) => {
            const { fields, ...rest } = variant
            const member: UnionTyDefMember = {
              fields: fields ? normalizeFields(fields) : [],
              ...rest,
            }
            return member
          }),
        }
      } else if (def.tuple) {
        return {
          type: "Tuple",
          fields: def.tuple,
        }
      } else if (def.array) {
        return {
          type: "SizedArray",
          len: def.array.len,
          typeParam: def.array.type,
        }
      } else if (def.sequence) {
        return {
          type: "Sequence",
          typeParam: def.sequence.type,
        }
      } else if (def.compact) {
        return {
          type: "Compact",
          typeParam: def.compact.typeParam,
        }
      } else if (def.bitSequence) {
        return {
          type: "BitSequence",
          bitOrderType: def.bitSequence.bitOrderType,
          bitStoreType: def.bitSequence.bitStoreType,
        }
      }
      unreachable()
    })(),
  }
}

function normalizeFields(fields: any[]) {
  return fields.map(({ type: ty, ...rest }: any) => {
    return { ty, ...rest }
  })
}
