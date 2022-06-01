export type Address = Id | Index | Raw | Address32 | Address20;

export abstract class AddressBase {
  0;

  constructor(bytes: Uint8Array) {
    // TODO: remove intermediate step upon resolution of https://github.com/microsoft/TypeScript/issues/49339
    const a = [...bytes];
    this[0] = a;
  }
}

export class Id extends AddressBase {}
export class Index extends AddressBase {}
export class Raw extends AddressBase {}
export class Address32 extends AddressBase {}
export class Address20 extends AddressBase {}

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
