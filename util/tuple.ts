export function tuple<Elements extends unknown[]>(...elements: [...Elements]): Elements {
  return elements;
}
