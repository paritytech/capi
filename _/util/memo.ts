export const memo = <Fn extends (...args: any[]) => any>(fn: Fn) => {
  let result: any;
  return ((...args: any[]) => {
    if (!result) {
      result = fn(...args);
    }
    return result;
  }) as Fn;
};
