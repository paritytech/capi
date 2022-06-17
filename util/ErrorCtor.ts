/** Produces an error whose name is represented within the type system */
export function ErrorCtor<Name extends string>(name: Name) {
  return class extends Error {
    override readonly name = name;
  };
}

export function ReasonBearingErrorCtor<Name extends string>(name: Name) {
  return <Reason extends string>() => {
    return class extends ErrorCtor(name) {
      constructor(
        readonly reason: Reason,
        message?: string,
        options?: ErrorOptions,
      ) {
        super(message, options);
      }
    };
  };
}
