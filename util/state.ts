export interface MapLike<K, V> {
  set(key: K, value: V): void
  get(key: K): undefined | V
}

export function getOrInit<K, V>(
  container: MapLike<K, V>,
  key: K,
  init: () => V,
): V {
  let value = container.get(key)
  if (value === undefined) {
    value = init()
    container.set(key, value)
  }
  return value
}

export class WeakRefMap<K, V extends object> {
  map = new Map<K, WeakRef<V>>()
  finReg = new FinalizationRegistry<K>((key) => this.map.delete(key))
  get(key: K) {
    return this.map.get(key)?.deref()
  }
  set(key: K, value: V) {
    this.map.set(key, new WeakRef(value))
    this.finReg.register(value, key, value)
  }
  delete(key: K) {
    const value = this.get(key)
    if (!value) return false
    this.map.delete(key)
    this.finReg.unregister(value)
    return true
  }
}
