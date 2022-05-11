export const spreadableOptional = <
  Key extends PropertyKey,
  Value,
>(
  key: Key,
  value: Value,
): Value extends undefined ? {} : { [_ in Key]: Value } => {
  return value ? { [key]: value } : {} as any;
};
