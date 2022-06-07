# Alliterative Aspirations on APIs

Here be dragons.

Just some internal documentation regarding the effect system.

## Tedious Tidbits on Typing

The typings here are rather complex, but they get the job done. Most of the
type-level logic is contained in `effector.ts`, which correspondingly contains
relatively little runtime logic, barring the `_effectorAtomic` function.

Ideally, the `effector` typings should not need to change significantly during
further development of Capi – they are intentionally very generic.

However, if this vision does not ultimately transpire, please reach out to
`@tjjfvi`, who will be happy to rework the typings.

## Nebulous Notions of Nodes

The meat of the runtime is contained in `_Node.ts`, which is entirely private
API, and can therefore be rewritten at a whim.

Each `Effect` has an associated `_Node`, which is a tree structure that
represents the execution. This `_Node` is what is actually executed – the
`Effect` merely serves as an opaque typed wrapper.

## Glorious Glossary of Generics

Many generics are scattered throughout this code. They are, in order:

- `K`: Sync/Async/Stream
- `T`: Ok Type
- `E`: Error Type
- `R`: Result (`T | E`)
- `X`: Observed/Exact Arguments
- `A`: Nominal Arguments

[Mnemonics](https://xkcd.com/992/) coming soon to a theater near you.

## Effective Examples of Effectors

This should probably be moved to `_docs` at some point.

```ts
// (a: number, b: number) => number
const add = effect.sync("add", (a: number, b: number) => {
  return a + b;
});

// <T>(value: T) => { value: T }
const box = effector.sync.generic(
  "box",
  (effect) =>
    <T, X extends unknown[]>(...args: EffectorArgs<X, [value: T]>) =>
      effect(args, (value) => {
        return { value };
      }),
);

// (value: number) => number
const double = effector("double", (value: EffectorItem<number>) => {
  return add(value, value);
});

// <T>(value: T) => { value: { value: { value: T } } }
const allTheBox = effector(
  "allTheBox",
  (effect) =>
    <T, X extends unknown[]>(...args: EffectorArgs<X, [value: T]>) =>
      effect(args, (value: EffectorItem<T>) => {
        return box(box(box(value)));
      }),
);
```
