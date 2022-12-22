import { Ty } from "../scale_info/mod.ts"

export interface Metadata {
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
