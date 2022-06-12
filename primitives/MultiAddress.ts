export const enum MultiAddressKind {
  Id = "Id",
  Index = "Index",
  Raw = "Raw",
  Address32 = "Address32",
  Address20 = "Address20",
}

export class MultiAddress {
  constructor(
    readonly type: MultiAddressKind,
    readonly value: Uint8Array,
  ) {}
}
