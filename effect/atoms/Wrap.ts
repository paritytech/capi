import { atom, T_, Val } from "../sys/mod.ts";

export function wrap<T, K extends Val<PropertyKey>>(target: T, key: K) {
  return atom("Wrap", [target, key], (target, key): Record<T_<K>, T_<T>> => {
    return { [key]: target } as any;
  });
}
