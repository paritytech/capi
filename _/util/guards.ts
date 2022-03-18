export const isString = (inQuestion: unknown): inQuestion is string => {
  return typeof inQuestion === "string";
};
