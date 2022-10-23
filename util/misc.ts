export function getOr<K, V>(map: Map<K, V>, key: K, or: () => V): V {
  let value = map.get(key);
  if (value === undefined) {
    value = or();
    map.set(key, value);
  }
  return value;
}
