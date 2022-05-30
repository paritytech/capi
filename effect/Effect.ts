const _K: unique symbol = Symbol();
type _K<T> = T extends _EffectBase<infer K, any, any> ? K : never;

/** Key of ok result phantom */
const _T: unique symbol = Symbol();
type _T<T> = T extends _EffectBase<any, infer T, any> ? T : T;

/** Key of error result phantom */
const _E: unique symbol = Symbol();
type _E<T> = T extends _EffectBase<any, any, infer E> ? E : never;

export enum EffectKind {
  Sync = 0,
  Async = 1,
  Stream = 2,
}

export abstract class _EffectBase<K extends EffectKind, T, E extends Error> {
  abstract [_K]: K;
  declare [_T]: T;
  declare [_E]: E;

  private constructor(readonly _node: _Node) {}

  pipe<T>(fn: (effect: this) => T) {
    return fn(this);
  }
}

export class SyncEffect<T, E extends Error> extends // @ts-ignore private constructor
_EffectBase<EffectKind.Sync, T, E> {
  readonly [_K] = EffectKind.Sync;

  run(): T | E {
    return _runSyncNode(this._node as _SyncNode) as any;
  }
}

export class AsyncEffect<T, E extends Error> extends // @ts-ignore private constructor
_EffectBase<EffectKind.Async, T, E> {
  readonly [_K] = EffectKind.Async;

  async run(): Promise<T | E> {
    return _runAsyncNode(this._node) as any;
  }
}

export class StreamEffect<T, E extends Error> extends // @ts-ignore private constructor
_EffectBase<EffectKind.Stream, T, E> {
  readonly [_K] = EffectKind.Stream;
}

function _syncEffect<T, E extends Error>(node: _Node): SyncEffect<T, E> {
  // @ts-ignore private constructor
  return new SyncEffect(node);
}

function _asyncEffect<T, E extends Error>(node: _Node): AsyncEffect<T, E> {
  // @ts-ignore private constructor
  return new AsyncEffect(node);
}

function _streamEffect<T, E extends Error>(node: _Node): StreamEffect<T, E> {
  // @ts-ignore private constructor
  return new StreamEffect(node);
}

function _valueNode(value: unknown): _Node {
  return { kind: "value", resolved: true, value };
}

export type MaxEffectKind<K extends EffectKind> = EffectKind.Stream extends K ? EffectKind.Stream
  : EffectKind.Async extends K ? EffectKind.Async
  : EffectKind.Sync;

export type EffectOfKind<K extends EffectKind, T, E extends Error> = [
  SyncEffect<T, E>,
  AsyncEffect<T, E>,
  StreamEffect<T, E>,
][K];

export type InferEffectOfKind<K extends EffectKind, T, E extends Error> = never extends K ? EffectOfKind<K, T, E>
  : _EffectBase<K, T, E>;

export type EffectKindReturn<K extends EffectKind, R> = [
  R,
  Promise<R>,
  AsyncIterableIterator<R>,
][K];

export type Effect<T, E extends Error> = SyncEffect<T, E> | AsyncEffect<T, E> | StreamEffect<T, E>;

type _Node = (
  | {
    kind: "syncFunc";
    fn: (...args: unknown[]) => unknown;
    deps: _Node[];
    resolved: boolean;
    value: unknown;
  }
  | {
    kind: "asyncFunc";
    fn: (...args: unknown[]) => Promise<unknown>;
    deps: _Node[];
    resolved: boolean;
    value: unknown;
    running: boolean;
    promise: Promise<unknown> | undefined;
  }
  | {
    kind: "value";
    resolved: true;
    value: unknown;
  }
);

type _SyncNode = _Node & ({ kind: "syncFunc" } | { resolved: true });

interface Frame {
  nodes: _Node[];
  i: number;
  backtracking: boolean;
}

function _runSyncNode(node: _SyncNode) {
  const todo: Frame[] = [{ nodes: [node], i: 0, backtracking: false }];
  while (todo.length) {
    const frame = todo[todo.length - 1]!;
    const node = frame.nodes[frame.i];
    if (!node) {
      todo.pop();
      continue;
    }
    if (node.resolved) {
      if (node.value instanceof Error) {
        return node.value;
      }
      frame.i++;
      continue;
    }
    if (frame.backtracking) {
      const value = node.fn(...node.deps.map((x) => x.value));
      node.resolved = true;
      node.value = value;
      if (value instanceof Error) {
        return value;
      }
      frame.i++;
      frame.backtracking = false;
      continue;
    } else {
      frame.backtracking = true;
      todo.push({ nodes: node.deps, i: 0, backtracking: false });
    }
  }
  return node.value;
}

function _runAsyncNode(node: _Node) {
  let earlyExit = false;
  let resolve: (value: unknown) => void;
  const promise = new Promise((r) => resolve = r);
  const todo: Frame[] = [{ nodes: [node], i: 0, backtracking: false }];
  while (todo.length) {
    const frame = todo[todo.length - 1]!;
    const node = frame.nodes[frame.i];
    if (!node) {
      todo.pop();
      continue;
    }
    if (node.resolved) {
      if (node.value instanceof Error) {
        earlyExit = true;
        return node.value;
      }
      frame.i++;
      continue;
    }
    const unresolvedIndex = node.deps.findIndex((x) => !x.resolved);
    if (frame.backtracking || !node.deps.length) {
      if (unresolvedIndex === -1) {
        if (node.kind === "syncFunc") {
          const value = node.fn(...node.deps.map((x) => x.value));
          node.resolved = true;
          node.value = value;
          if (value instanceof Error) {
            earlyExit = true;
            return value;
          }
        } else {
          queueStrand(todo.map((e) => e.nodes[e.i]!) as never);
        }
        if (earlyExit) break;
      }
      frame.i++;
      frame.backtracking = false;
    } else {
      frame.backtracking = true;
      todo.push({ nodes: node.deps, i: unresolvedIndex, backtracking: false });
    }
  }
  return promise;

  async function queueStrand(nodes: Exclude<_Node, { kind: "value" }>[]) {
    let value: unknown;
    while (nodes.length) {
      const node = nodes.pop()!;
      if (!node.deps.every((x) => x.resolved)) break;
      if (node.kind === "syncFunc") {
        value = node.fn(...node.deps.map((x) => x.value));
        node.resolved = true;
        node.value = value;
      } else {
        if (!node.running) {
          node.running = true;
          node.promise = node.fn(...node.deps.map((x) => x.value));
          node.promise.then((value) => {
            node.running = false;
            node.resolved = true;
            node.value = value;
          });
        }
        value = await node.promise!;
      }
      if (value instanceof Error) {
        earlyExit = true;
        resolve(value);
        return;
      }
    }
    resolve(value!);
  }
}

/** Warning: values of this type should only be passed to other effectors, not used directly */
export type EffectorItem<T> = SyncEffect<T, never>;
export type EffectorItemCollection<C> = { [K in keyof C]: EffectorItem<C[K]> };

export function effector<K extends EffectKind, T, E extends Error, A extends unknown[]>(
  _name: string,
  fn: (...args: EffectorItemCollection<A>) => InferEffectOfKind<K, T, E>,
) {
  return fn as any as <X extends unknown[]>(...args: EffectorArgs<X, A>) => _EffectorEffect<K, T, E, X>;
}

effector.generic = <F>(
  _name: string,
  fn: (
    effect: <K extends EffectKind, T, E extends Error, X extends unknown[], A extends unknown[]>(
      args: EffectorArgs<X, A>,
      resolve: (
        ...args: EffectorItemCollection<A>
      ) => InferEffectOfKind<K, T, E>,
    ) => _EffectorEffect<K, T, E, X>,
  ) => F,
): F => {
  return fn((args, fn) => fn(...args as never) as never);
};

export namespace effector {
  export const sync = _effectorAtomicFn(EffectKind.Sync);
  export const async = _effectorAtomicFn(EffectKind.Async);
  export const stream = _effectorAtomicFn(EffectKind.Stream);
}

type _EffectorEffect<K extends EffectKind, T, E extends Error, X extends unknown[]> = EffectOfKind<
  MaxEffectKind<K | _K<X[number]>>,
  T,
  E | _E<X[number]>
>;

type EffectUpTo<K extends EffectKind, T, E extends Error> = [K] extends [never] ? T : [
  SyncEffect<T, E> | T,
  SyncEffect<T, E> | AsyncEffect<T, E> | T,
  SyncEffect<T, E> | AsyncEffect<T, E> | T,
][K];

export type EffectorArgs<X extends unknown[], A extends unknown[]> = never extends X
  ? { [K in keyof A]: EffectUpTo<{ [K in keyof X]: _K<X[K]> }[number], A[K], { [K in keyof X]: _E<X[K]> }[number]> }
  : X extends A ? X | { [K in keyof A]: A[K] | Effect<A[K], any> }
  : never;

function _effectorAtomicFn<K extends EffectKind>(baseKind: K) {
  function step<R, A extends unknown[]>(
    name: string,
    resolve: () => (...args: A) => EffectKindReturn<K, R>,
  ) {
    return {
      [name]: function<X extends unknown[]>(
        ...args: EffectorArgs<X, A>
      ): _EffectorEffect<K, Exclude<R, Error>, Extract<R, Error>, X> {
        return _effectorAtomic(baseKind, name, args, resolve);
      },
    }[name]!;
  }

  step.generic = <F>(
    name: string,
    fn: (
      effect: <R, X extends unknown[], A extends unknown[]>(
        args: EffectorArgs<X, A>,
        resolve: () => (...args: A) => EffectKindReturn<K, R>,
      ) => _EffectorEffect<K, Exclude<R, Error>, Extract<R, Error>, X>,
    ) => F,
  ): F => {
    return fn((args, resolve) => _effectorAtomic(baseKind, name, args, resolve));
  };

  return step;
}

function _effectorAtomic(
  baseKind: EffectKind,
  _name: string,
  args: any[],
  resolve: () => (...argsResolved: any) => any,
): any {
  const outKind: EffectKind = Math.max(
    baseKind,
    ...args.map((x) =>
      x instanceof _EffectBase
        ? x[_K]
        : EffectKind.Sync
    ),
  );
  const deps = args.map((x) => x instanceof _EffectBase ? x._node : _valueNode(x));
  if (outKind === EffectKind.Sync) {
    return _syncEffect({
      kind: "syncFunc",
      fn: resolve(),
      deps,
      resolved: false,
      value: undefined,
    });
  }
  if (outKind === EffectKind.Async) {
    if (baseKind === EffectKind.Async) {
      return _asyncEffect({
        kind: "asyncFunc",
        fn: resolve(),
        deps,
        resolved: false,
        value: undefined,
        running: false,
        promise: undefined,
      });
    } else {
      return _asyncEffect({
        kind: "syncFunc",
        fn: resolve(),
        deps,
        resolved: false,
        value: undefined,
      });
    }
  }
  throw new Error("StreamEffects are currently unsupported");
}
