export class Call {
  _tag;
  0;

  constructor(
    palletName: string,
    methodName: string,
    args: Record<string, unknown>,
  ) {
    this._tag = palletName;
    const e0 = {
      _tag: methodName,
      ...args,
    };
    this[0] = e0;
  }
}
