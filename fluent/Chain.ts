import { Event } from "../primitives/mod.ts"

export type Chain = Record<string, ChainPallet>
export type ChainPallet = {
  calls: Record<string, ChainCall>
  events: Record<string, Event>
  storageItems: Record<string, ChainStorageItem>
  storageMaps: Record<string, ChainStorageMap>
  constants: Record<string, unknown>
}
export interface ChainCall<Value extends Record<string, unknown> = Record<string, any>> {
  value: Value
}
export interface ChainStorageItem<Type = any> {
  type: Type
}
export interface ChainStorageMap<Keys extends unknown[] = any[], Type = any> {
  keys: Keys
  type: Type
}
