export type MultiAddressKind = "Id" | "Index" | "Raw" | "Address20" | "Address32";

export class MultiAddress {
  constructor(
    readonly type: MultiAddressKind,
    readonly value: Uint8Array,
  ) {}
}
