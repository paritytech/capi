import { unreachable } from "../../deps/std/testing/asserts.ts"
import { Ty, TyDef, UnionTyDefMember } from "../../scale_info/mod.ts"

export interface InkMetadata {
  source: Source
  contract: Contract
  V3: Abi
}

export interface Source {
  hash: string
  language: string
  compiler: string
  wasm?: string
}

export interface Contract {
  name: string
  version: string
  authors: string[]
  description?: string
  documentation?: string
  repository?: string
  homepage?: string
  license?: string
}

export interface User {
  json: Record<string, unknown>
}

export interface Abi {
  spec: Spec
  storage: Storage
  types: Ty[]
}

export interface Spec {
  constructors: Constructor[]
  docs: string[]
  events: Event[]
  messages: Message[]
}

export interface Constructor {
  args: Arg[]
  docs: string[]
  label: string
  payable: boolean
  selector: string
}

export interface Arg {
  label: string
  type: TypeRef
  docs?: string[]
  indexed?: boolean
}

export interface Event {
  args: Arg[]
  docs: string[]
  label: string
}

export interface TypeRef {
  displayName: string[]
  type: number
}

export interface Message {
  args: Arg[]
  docs: string[]
  label: string
  mutates: boolean
  payable: boolean
  returnType: TypeRef
  selector: string
}

export interface Storage {
  struct: {
    fields: {
      layout: {
        cell: {
          key: string
          ty: number
        }
      }
      name: string
    }[]
  }
}

export function normalize({ V3: { types, ...v3Rest }, ...topLevelRest }: InkMetadata): InkMetadata {
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
