import * as Z from "../../deps/zones.ts";

export function wrap<T, K extends Z.$<PropertyKey>>(target: T, key: K) {
  return Z.atom([target, key], (target, key): Record<Z.T<K>, Z.T<T>> => {
    return { [key]: target } as any;
  });
}
