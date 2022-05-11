// TODO: should we use variadic types & narrow this? Checker goes kaboom. Likely not worth it.
export const intersperse = <
  Target extends any[],
  Value,
>(
  target: Target,
  value: Value,
) => {
  return target.reduce<(Target[number] | Value)[]>((acc, cur, i) => {
    if (i === 0) {
      return [cur];
    }
    return [...acc, value, cur];
  }, []);
};
