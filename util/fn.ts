export function identity<T>(value: T): T {
  return value;
}

export function throw_(error: Error): never {
  throw error;
}
