/** Produces an error whose name is represented within the type system */
export function ErrorCtor<Name extends string>(name: Name) {
  return class extends Error {
    override readonly name = name;
  };
}
