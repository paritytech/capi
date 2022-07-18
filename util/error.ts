/** Produces an error whose name is represented within the type system */
export function ErrorCtor<Name extends string>(name: Name) {
  return class extends Error {
    override readonly name = name;
  };
}

export function throwIfError<T>(value: T): Exclude<T, Error> {
  if (value instanceof Error) {
    throw value;
  }
  return value as Exclude<T, Error>;
}
