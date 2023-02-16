export type PromiseOr<T> = T | Promise<T>

export interface SignalBearer {
  signal: AbortSignal
}
