import * as U from "../../util/mod.ts";
import * as sys from "../sys/mod.ts";

export function select<T, Field extends sys.Val<keyof sys.T_<T>>>(val: T, field: Field) {
  return sys.atom(
    "Select",
    [val, field],
    (val, field): sys.T_<T>[U.AssertT<sys.T_<Field>, keyof sys.T_<T>>] => {
      return (val as any)[field];
    },
  );
}
