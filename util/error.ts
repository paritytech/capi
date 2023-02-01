export function throwIfError<T>(value: T): Exclude<T, Error> {
  if (value instanceof Error) {
    throw value
  }
  return value as Exclude<T, Error>
}

export function returnThrows<Throw>() {
  return <R>(run: () => R) => run() as R | Throw
}
