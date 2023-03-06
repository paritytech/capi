export class ChainError<T> extends Error {
  override readonly name = "ChainError"
  constructor(public value: T) {
    super()
  }

  static toArgs = <T>(x: ChainError<T>): [T] => [x.value]
}
