export type Identity<T> = (value: T) => T;
export const identity = <T>(value: T): T => {
  return value;
};
