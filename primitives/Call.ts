export class Call {
  _tag;
  value;

  constructor(
    palletName: string,
    methodName: string,
    args: Record<string, unknown>,
  ) {
    this._tag = palletName;
    this.value = {
      _tag: methodName,
      ...args,
    };
  }
}
