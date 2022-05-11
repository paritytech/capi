export const isStr = (inQuestion: any): inQuestion is string => {
  return typeof inQuestion === "string";
};

export const isArray = (inQuestion: any): inQuestion is any[] => {
  return Array.isArray(inQuestion);
};

// // TODO: delete this?... do we care about this deep of validation of resolved data?
// export const isArrayOf = <
//   Of,
//   OfGuard extends (inQuestion: any) => inQuestion is Of,
// >(
//   ofGuard: OfGuard,
//   inQuestion: any,
// ): inQuestion is Of[] => {
//   // ...
// };

// TODO: remove this... it's just for testing purposes.
export const isAny = (_inQuestion: any): _inQuestion is any => {
  return true;
};
