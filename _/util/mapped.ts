export type LookupOf<Key extends PropertyKey> = { [_ in Key]: unknown };
export type EnsureLookupOf<
  Key extends PropertyKey,
  T extends LookupOf<Key>,
> = T;
