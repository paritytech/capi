/** A simple wrapper around wasm-bindgen-produced functions, which captures thrown values
 * (the `E`s (string literals) of `Result<T, E>`s) and instantiates an error type with them.
 * This helpers also enables us to narrow the fn types without `as`ing it. Use wisely!
 * @param fn the initialized binding
 * @param errorCtor a constructor that accepts a string (reason for the binding call's failure)
 * and produces an error instance. If not supplied, the `WasmError` constructor will be used. */
export function normalizeErrors<F>(
  fn: (...args: any[]) => any,
  errorCtor?: new(reason: any) => Error,
): F {
  return ((...args: any[]) => {
    try {
      return fn(...args);
    } catch (e) {
      if (typeof e === "string" && errorCtor) {
        return new errorCtor(e);
      }
      return new WasmError(e);
    }
  }) as unknown as F;
}

export class WasmError {
  constructor(readonly inner: unknown) {}
}
