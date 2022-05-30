export enum MultiAddressKind {
  Id = "Id",
  Index = "Index",
  Raw = "Raw",
  Address32 = "Address32",
  Address20 = "Address20",
}

export abstract class MultiAddress {
  constructor(readonly _tag: MultiAddressKind) {}
}

export class Raw extends MultiAddress {
  readonly 0;

  constructor(bytes: Uint8Array) {
    super(MultiAddressKind.Raw);
    // TODO: cleanup
    const asA = { 0: [...bytes] };
    this[0] = asA;
  }
}

export class Id extends MultiAddress {
  readonly 0;

  constructor(bytes: Uint8Array) {
    super(MultiAddressKind.Id);
    // TODO: cleanup
    const asA = { 0: [...bytes] };
    this[0] = asA;
  }
}
