export interface MapLike<K, V> {
  set(key: K, value: V): void;
  get(key: K): undefined | V;
  delete(key: K): boolean;
}

export function getOrInit<K, V>(
  container: MapLike<K, V>,
  key: K,
  init: () => V,
) {
  let val = container.get(key);
  if (!val) {
    val = init();
    container.set(key, val);
  }
  return val;
}
