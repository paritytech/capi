export class ChainError<T> extends Error {
  override readonly name = "ChainError"
  constructor(public value: T) {
    super()
    this.stack = "ChainError: see error.value\n  [error occurred on chain]"
  }

  static toArgs = <T>(x: ChainError<T>): [T] => [x.value]
}
