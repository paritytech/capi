import * as Z from "../../deps/zones.ts";

export function select<T, Field extends Z.$<keyof Z.T<T>>>(val: T, field: Field) {
  return Z.call(
    Z.ls(val, field),
    ([val, field]): Z.T<T>[Extract<Z.T<Field>, keyof Z.T<T>>] => {
      return (val as any)[field];
    },
  );
}
