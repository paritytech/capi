export const enum MultiAddressKind {
  Id = "Id",
  Index = "Index",
  Raw = "Raw",
  Address32 = "Address32",
  Address20 = "Address20",
}

export class MultiAddress {
  0;

  constructor(
    readonly _tag: MultiAddressKind,
    bytes: Uint8Array,
  ) {
    const asA = { 0: [...bytes] };
    this[0] = asA;
  }
}
