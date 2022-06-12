export type MultiAddressKind =
  | "Id"
  | "Index"
  | "Raw"
  | "Address32"
  | "Address20";

export class MultiAddress {
  constructor(
    readonly type: MultiAddressKind,
    readonly value: Uint8Array,
  ) {}
}
