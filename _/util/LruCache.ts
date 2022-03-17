import * as asserts from "std/testing/asserts.ts";

export class LruCache<Key extends PropertyKey, Value> extends Map<Key, Value> {
  constructor(
    readonly max: number,
    init?: Map<Key, Value>,
  ) {
    asserts.assert(max > 0);
    super(init || []);
  }

  get(key: Key): Value | undefined {
    const value = this.get(key);
    if (value) {
      this.delete(key);
      this.set(key, value);
      return value;
    }
    return;
  }

  set(key: Key, value: Value): this {
    if (this.size === this.max) {
      const keyToDelete = this.keys().next().value;
      asserts.assert(keyToDelete);
      this.delete(keyToDelete);
    }
    this.set(key, value);
    return this;
  }
}
