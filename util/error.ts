export function throwIfError<T>(value: T): Exclude<T, Error> {
  if (value instanceof Error) {
    throw value
  }
  return value as Exclude<T, Error>
}

export function throwIfUndefined<T>(value: T): Exclude<T, undefined> {
  if (value === undefined) {
    throw new Error()
  }
  return value as Exclude<T, undefined>
}

export function returnThrows<Throw>() {
  return <R>(run: () => R): R | Throw => {
    try {
      return run()
    } catch (e) {
      return e as Throw
    }
  }
}
