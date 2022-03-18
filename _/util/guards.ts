export const isStr = (inQuestion: any): inQuestion is string => {
  return typeof inQuestion === "string";
};

// TODO: remove this... it's just for testing purposes.
export const isAny = (_inQuestion: any): _inQuestion is any => {
  return true;
};
