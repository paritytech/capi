export const spreadableOptional = <
  Key extends PropertyKey,
  Value,
>(
  key: Key,
  value: Value,
): {} | { [_ in Key]: Value } => {
  return value ? { [key]: value } : {};
};
