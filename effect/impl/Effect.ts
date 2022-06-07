import { _Node, _runAsyncNode, _runSyncNode, _SyncNode } from "./_Node.ts";

export const _K: unique symbol = Symbol();
type _K<T> = T extends _EffectBase<infer K, any, any> ? K : never;

/** Key of ok result phantom */
export const _T: unique symbol = Symbol();
export type _T<T> = T extends _EffectBase<any, infer T, any> ? T : T;

/** Key of error result phantom */
export const _E: unique symbol = Symbol();
export type _E<T> = T extends _EffectBase<any, any, infer E> ? E : never;

export type _ArrayK<T extends unknown[]> = { [K in keyof T]: _K<T[K]> }[number];
export type _ArrayE<T extends unknown[]> = { [K in keyof T]: _E<T[K]> }[number];

export type Effect<T, E extends Error> =
  | SyncEffect<T, E>
  | AsyncEffect<T, E>
  | StreamEffect<T, E>;

export enum EffectKind {
  Sync = 0,
  Async = 1,
  Stream = 2,
}

export abstract class _EffectBase<K extends EffectKind, T, E extends Error> {
  abstract [_K]: K;
  declare [_T]: T;
  declare [_E]: E;

  constructor(readonly _node: _Node) {}

  pipe<T>(fn: (effect: this) => T) {
    return fn(this);
  }
}

export class SyncEffect<T, E extends Error> extends _EffectBase<EffectKind.Sync, T, E> {
  readonly [_K] = EffectKind.Sync;

  run(): T | E {
    return _runSyncNode(this._node as _SyncNode) as any;
  }
}

export class AsyncEffect<T, E extends Error> extends _EffectBase<EffectKind.Async, T, E> {
  readonly [_K] = EffectKind.Async;

  async run(): Promise<T | E> {
    return _runAsyncNode(this._node) as any;
  }
}

export class StreamEffect<T, E extends Error> extends _EffectBase<EffectKind.Stream, T, E> {
  readonly [_K] = EffectKind.Stream;
}
