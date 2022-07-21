import { unimplemented } from "../deps/std/testing/asserts.ts";
import { Ty, TyDef } from "./scale_info.ts";

export interface ContractMetadata<Ty_ = Ty> {
  source: ContractMetadata.Source;
  contract: ContractMetadata.Contract;
  V3: ContractMetadata.Abi<Ty_>;
}
export namespace ContractMetadata {
  // TODO: serde `Value` type
  export type Value = unknown;

  export interface Source {
    hash: string;
    language: string;
    compiler: string;
    wasm?: string;
  }

  export interface Contract {
    name: string;
    version: string;
    authors: string[];
    description?: string;
    documentation?: string;
    repository?: string;
    homepage?: string;
    license?: string;
  }

  export interface User {
    json: Record<string, Value>;
  }

  export interface Abi<Ty> {
    spec: Spec;
    storage: Storage;
    // TODO: type the raw serde-defined shape?
    types: Ty[];
  }

  export interface Spec {
    constructors: Constructor[];
    docs: string[];
    events: Event[];
    messages: Message[];
  }

  export interface Constructor {
    args: Arg[];
    docs: string[];
    label: string;
    payable: boolean;
    selector: string;
  }

  export interface Arg {
    label: string;
    type: TypeRef;
    docs?: string[];
    indexed?: boolean;
  }

  export interface Event {
    args: Arg[];
    docs: string[];
    label: string;
  }

  export interface TypeRef {
    displayName: string[];
    type: number;
  }

  export interface Message {
    args: Arg[];
    docs: string[];
    label: string;
    mutates: boolean;
    payable: boolean;
    returnType: TypeRef;
    selector: string;
  }

  export interface Storage {
    struct: {
      fields: {
        layout: {
          cell: {
            key: string;
            ty: number;
          };
        };
        name: string;
      }[];
    };
  }
}

// TODO: stricter typings? Not the most necessary atm.
export function fromRawTy(rawTy: any): Ty {
  const { def, params, path } = rawTy.type;
  return {
    id: rawTy.id,
    path,
    params,
    // TODO: grab this from appropriate loc
    docs: [],
    ...((): TyDef => {
      if (def.primitive) {
        return {
          type: "Primitive",
          kind: def.primitive,
        };
      } else if (def.composite) {
        return {
          type: "Struct",
          fields: normalizeFields(def.composite.fields),
        };
      } else if (def.variant) {
        return {
          type: "Union",
          members: def.variant.variants.map((variant: any) => {
            const { fields, ...rest } = variant;
            return {
              fields: fields ? normalizeFields(fields) : [],
              ...rest,
            };
          }),
        };
      } else if (def.tuple) {
        return {
          type: "Tuple",
          fields: def.tuple,
        };
      } else if (def.array) {
        return {
          type: "SizedArray",
          len: def.array.len,
          typeParam: def.array.type,
        };
      } else {
        // Sequence
        // Compact
        // BitSequence
        unimplemented();
      }
    })(),
  };
}

function normalizeFields(fields: any[]) {
  return fields.map((field: any) => {
    const { type: ty, ...rest } = field;
    return { ty, ...rest };
  });
}

export function normalize(contractMetadata: ContractMetadata): ContractMetadata<Ty> {
  const { V3, ...topLevelRest } = contractMetadata;
  const { types, ...v3Rest } = V3;
  return {
    ...topLevelRest,
    V3: {
      ...v3Rest,
      types: types.map(fromRawTy),
    },
  };
}
