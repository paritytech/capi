export const ErrorCtor = <Name extends string>(name: Name) => {
  return class extends Error {
    readonly name = name;
  };
};
