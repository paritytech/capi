# Runic Ruminations

## A Rune by Any Other Name

Runes are the fundamental unit of composition in Rune, Capi's effect system.
Runes can be compared to many things, and they are, in a sense, a combination of
effects, futures, observables, and signals. But they are not exactly any one of
these things, and so calling a rune instead an effect or an observable would
ultimately do little more than confuse.

Arguably, runes are a kind of effect, a generalization of futures, and a
combination of observables and signals. If one had to pick a descriptive name
for runes, "future observable effect" might be most apt. But such a phrase would
be a mouthful, and the acronym thereof would be needlessly hostile.

For lack of a descriptive name, thus, we must choose a name unburdened with
technical meaning. For this we select "Rune"[^1], a name with apt mystical
connotations as well as an amusing backronym of sorts – "**run e**ffect".

## It's Super `Effect`ive!

Rune can be seen as an effect system – an implementation of algebraic effects –
and the natural name for the primary type in such a system is an "effect".
However, the term "effect" is loaded with much connotation but little concrete
meaning. The best definition for "effect" that I know of is that an effect is an
instance of a particular monad[^2]. Which monad, though, varies greatly. Most
effect systems use a variation on a `Future` for this monad. Rune, however, uses
a variation on a `Stream` – in particular, a rune can asynchronously resolve to
multiple values. As such, runes have rather different semantics from futures and
therefore most effects. Thus, even though calling a rune an effect would not be
inaccurate, it would mislead those already familiar with effects – and be of no
use to those unfamiliar.

## Runes of a Feather Update Together

Runes are similar to RxJS-style observables, in that they are lazy collections
of multiple values. However, there is an important difference between runes and
observables – namely, that runes maintain consistency by retaining information
about the sources of updates. This is perhaps best illustrated by a series of
examples.

First, let's look at a derived query based on one event source in both RxJS and
Rune.

```ts
import { concatMap, delay, map, of, timer, zip } from "npm:rxjs"

// Some kind of event source; this might correspond to, say, new blocks from a given chain
const a = timer(0, 1000).pipe(map((n) => `a${n}`)) // a0, a1, a2, ...

// Two different derived asynchronous queries based off of `a`
const ax = a.pipe(concatMap((value) => of(`${value}.x`).pipe(delay(500)))) // a0.x, a1.x, a2.x, ...
const ay = a.pipe(concatMap((value) => of(`${value}.y`).pipe(delay(250)))) // a0.y, a1.y, a2.y, ...

// Combine the results from each to process in some way
const az = zip(ax, ay)

const start = Date.now()
az.subscribe((value) => {
  console.log(Date.now() - start, value)
})

// Every update is based on only one value from `a`; this is good.
/*
  506 [ "a0.x", "a0.y" ]
  1505 [ "a1.x", "a1.y" ]
  2507 [ "a2.x", "a2.y" ]
  3510 [ "a3.x", "a3.y" ]
  4511 [ "a4.x", "a4.y" ]
  ...
*/
```

```ts
import { delay } from "https://deno.land/std@0.127.0/async/mod.ts"
import { Rune } from "./mod.ts"

// Some kind of event source; this might correspond to, say, new blocks from a given chain
const a = timer(1000).map((n) => `a${n}`) // a0, a1, a2, ...

// Two different derived asynchronous queries based off of `a`
const ax = a.map((value) => delay(500).then(() => `${value}.x`)) // a0.x, a1.x, a2.x, ...
const ay = a.map((value) => delay(500).then(() => `${value}.y`)) // a0.y, a1.y, a2.y, ...

// Combine the results from each to process in some way
const az = Rune.ls([ax, ay])

const start = Date.now()
for await (const value of az.watch()) {
  console.log(Date.now() - start, value)
}

// Every update is based on only one value from `a`; this is good.
/*
  503 [ "a0.x", "a0.y" ]
  1505 [ "a1.x", "a1.y" ]
  2507 [ "a2.x", "a2.y" ]
  3509 [ "a3.x", "a3.y" ]
  4512 [ "a4.x", "a4.y" ]
  ...
*/

function timer(ms: number) {
  return Rune.asyncIter(async function*() {
    let i = 0
    while (true) {
      yield i++
      await delay(ms)
    }
  })
}
```

So far, RxJS and Rune behave equivalently. Now, let's look at what happens once
we have multiple event sources:

```ts
import { combineLatest, map, timer, zip } from "npm:rxjs"

// Two event sources with different speeds
const a = timer(0, 1000).pipe(map((n) => `a${n}`)) // a0, a1, a2, ...
const b = timer(0, 1500).pipe(map((n) => `b${n}`)) // b0, b1, b2, ...

// Combine them with `zip` like before
const ab1 = zip(a, b)

const start1 = Date.now()
ab1.subscribe((value) => {
  console.log(Date.now() - start1, value)
})

// Every update has the same index of both `a` and `b`, but this shouldn't be
// the case, since `b` is slower than `a`.
/*
  3 [ "a0", "b0" ]
  1505 [ "a1", "b1" ]
  3006 [ "a2", "b2" ]
  4507 [ "a3", "b3" ]
  6009 [ "a4", "b4" ]
  7511 [ "a5", "b5" ]
  9017 [ "a6", "b6" ] // should be at `a9` but this lags behind
  ...
*/

// Instead, we want to combine them using `combineLatest`:
const ab2 = combineLatest([a, b])

const start2 = Date.now()
ab2.subscribe((value) => {
  console.log(Date.now() - start2, value)
})

// This is what we want:
/*
  4 [ "a0", "b0" ]
  1004 [ "a1", "b0" ]
  1507 [ "a1", "b1" ]
  2005 [ "a2", "b1" ]
  3008 [ "a3", "b1" ]
  3009 [ "a3", "b2" ]
  4009 [ "a4", "b2" ]
  4511 [ "a4", "b3" ]
  5012 [ "a5", "b3" ]
  6013 [ "a5", "b4" ]
  6013 [ "a6", "b4" ]
  7015 [ "a7", "b4" ]
  7517 [ "a7", "b5" ]
  8023 [ "a8", "b5" ]
  9024 [ "a8", "b6" ]
  9024 [ "a9", "b6" ] // both up-to-date
  ...
*/
```

```ts
import { delay } from "https://deno.land/std@0.127.0/async/mod.ts"
import { Rune } from "./mod.ts"

const a = timer(1000).map((n) => `a${n}`) // a0, a1, a2, ...
const b = timer(1500).map((n) => `b${n}`) // b0, b1, b2, ...

// Combine them with `ls` like before:
const ab = Rune.ls([a, b])

const start = Date.now()
for await (const value of ab.watch()) {
  console.log(Date.now() - start, value)
}

// This still has the correct behavior, without having to change the combinator:
/*
  2 [ "a0", "b0" ]
  1003 [ "a1", "b0" ]
  1506 [ "a1", "b1" ]
  2005 [ "a2", "b1" ]
  3007 [ "a3", "b1" ]
  3007 [ "a3", "b2" ]
  4009 [ "a4", "b2" ]
  4509 [ "a4", "b3" ]
  5010 [ "a5", "b3" ]
  6011 [ "a5", "b4" ]
  6012 [ "a6", "b4" ]
  7013 [ "a7", "b4" ]
  7514 [ "a7", "b5" ]
  8021 [ "a8", "b5" ]
  9020 [ "a8", "b6" ]
  9023 [ "a9", "b6" ] // both up-to-date
*/
```

We can still achieve the same behavior in both, but in RxJS, we had to use a
different combinator. (`combineLatest` wouldn't have worked in the first example
as it would've given `a` inconsistent values).

As the timing gets even more complex, though, it becomes infeasible to handle correctly in RxJS:

```ts
import { combineLatest, map, timer, zip } from "npm:rxjs"

const a = timer(0, 1000).pipe(map((n) => `a${n}`)) // a0, a1, a2, ...
const b = timer(0, 1500).pipe(map((n) => `b${n}`)) // b0, b1, b2, ...
const c = timer(0, 2500).pipe(map((n) => `c${n}`)) // c0, c1, c2, ...

// From our above experiments we know that this needs to be `combineLatest`
const ab = combineLatest([a, b])
const bc = combineLatest([b, c])

// But what should this be?
const allTogetherNow1 = zip(ab, bc)

const start1 = Date.now()
allTogetherNow1.subscribe((value) => {
  console.log(Date.now() - start1, value)
})

// Again, `zip` makes some of these lag. In this case, it also gives b inconsistent values.
/*
  3 [ [ "a0", "b0" ], [ "b0", "c0" ] ]
  1504 [ [ "a1", "b0" ], [ "b1", "c0" ] ]
  2506 [ [ "a1", "b1" ], [ "b1", "c1" ] ]
  3007 [ [ "a2", "b1" ], [ "b2", "c1" ] ]
  4509 [ [ "a2", "b2" ], [ "b3", "c1" ] ]
  5008 [ [ "a3", "b2" ], [ "b3", "c2" ] ]
  6011 [ [ "a4", "b2" ], [ "b4", "c2" ] ]
  7510 [ [ "a4", "b3" ], [ "b4", "c3" ] ]
  7512 [ [ "a5", "b3" ], [ "b5", "c3" ] ]
  9016 [ [ "a5", "b4" ], [ "b6", "c3" ] ] // a should be at 9; b has inconsistent values
*/

// Alternatively, would could use `combineLatest`...
const allTogetherNow2 = combineLatest([ab, bc])

const start2 = Date.now()
allTogetherNow2.subscribe((value) => {
  console.log(Date.now() - start2, value)
})

const start2 = Date.now()
ab2.subscribe((value) => {
  console.log(Date.now() - start2, value)
})

// But now even though they all have the right speed, b still has inconsistent values
/*
  3 [ [ "a0", "b0" ], [ "b0", "c0" ] ]
  1006 [ [ "a1", "b0" ], [ "b0", "c0" ] ]
  1505 [ [ "a1", "b1" ], [ "b0", "c0" ] ] // b has inconsistent values at times
  1506 [ [ "a1", "b1" ], [ "b1", "c0" ] ]
  2008 [ [ "a2", "b1" ], [ "b1", "c0" ] ]
  2506 [ [ "a2", "b1" ], [ "b1", "c1" ] ]
  3007 [ [ "a2", "b2" ], [ "b1", "c1" ] ]
  3007 [ [ "a2", "b2" ], [ "b2", "c1" ] ]
  3010 [ [ "a3", "b2" ], [ "b2", "c1" ] ]
  4012 [ [ "a4", "b2" ], [ "b2", "c1" ] ]
  4510 [ [ "a4", "b3" ], [ "b2", "c1" ] ]
  4510 [ [ "a4", "b3" ], [ "b3", "c1" ] ]
  5007 [ [ "a4", "b3" ], [ "b3", "c2" ] ]
  5014 [ [ "a5", "b3" ], [ "b3", "c2" ] ]
  6013 [ [ "a5", "b4" ], [ "b3", "c2" ] ]
  6013 [ [ "a5", "b4" ], [ "b4", "c2" ] ]
  6015 [ [ "a6", "b4" ], [ "b4", "c2" ] ]
  7017 [ [ "a7", "b4" ], [ "b4", "c2" ] ]
  7509 [ [ "a7", "b4" ], [ "b4", "c3" ] ]
  7514 [ [ "a7", "b5" ], [ "b4", "c3" ] ]
  7514 [ [ "a7", "b5" ], [ "b5", "c3" ] ]
  8025 [ [ "a8", "b5" ], [ "b5", "c3" ] ]
  9022 [ [ "a8", "b6" ], [ "b5", "c3" ] ]
  9022 [ [ "a8", "b6" ], [ "b6", "c3" ] ]
  9027 [ [ "a9", "b6" ], [ "b6", "c3" ] ] // but at least a is at the right speed
  ...
*/
```

No RxJS combinator will work in this case because the updates need to be handled
differently depending on it it's `b` updating (in which case it should be like
`zip`) or `a` or `c` updating (in which case it should be like `combineLatest`).

However, this works implicitly in rune:

```ts
import { delay } from "https://deno.land/std@0.127.0/async/mod.ts"
import { Rune } from "./mod.ts"

const a = timer(1000).map((n) => `a${n}`) // a0, a1, a2, ...
const b = timer(1500).map((n) => `b${n}`) // b0, b1, b2, ...
const c = timer(2500).map((n) => `c${n}`) // c0, c1, c2, ...

const ab = Rune.ls([a, b])
const bc = Rune.ls([b, c])

// The combinator is the same as always
const allTogetherNow = Rune.ls([ab, bc])

const start = Date.now()
for await (const value of allTogetherNow.watch()) {
  console.log(Date.now() - start, value)
}

// And everything works correctly; `a` is faster than `b` is faster than `c`,
// and `b`'s value is always consistent:
/*
  2 [ [ "a0", "b0" ], [ "b0", "c0" ] ]
  1004 [ [ "a1", "b0" ], [ "b0", "c0" ] ]
  1504 [ [ "a1", "b1" ], [ "b1", "c0" ] ]
  2005 [ [ "a2", "b1" ], [ "b1", "c0" ] ]
  2502 [ [ "a2", "b1" ], [ "b1", "c1" ] ]
  3005 [ [ "a2", "b2" ], [ "b2", "c1" ] ]
  3007 [ [ "a3", "b2" ], [ "b2", "c1" ] ]
  4008 [ [ "a4", "b2" ], [ "b2", "c1" ] ]
  4508 [ [ "a4", "b3" ], [ "b3", "c1" ] ]
  5005 [ [ "a4", "b3" ], [ "b3", "c2" ] ]
  5009 [ [ "a5", "b3" ], [ "b3", "c2" ] ]
  6009 [ [ "a5", "b4" ], [ "b4", "c2" ] ]
  6011 [ [ "a6", "b4" ], [ "b4", "c2" ] ]
  7013 [ [ "a7", "b4" ], [ "b4", "c2" ] ]
  7508 [ [ "a7", "b4" ], [ "b4", "c3" ] ]
  7510 [ [ "a7", "b5" ], [ "b5", "c3" ] ]
  8013 [ [ "a8", "b5" ], [ "b5", "c3" ] ]
  9013 [ [ "a8", "b6" ], [ "b6", "c3" ] ]
  9014 [ [ "a9", "b6" ], [ "b6", "c3" ] ]
*/
```

All of these examples work correctly in Rune because Rune essentially tracks the
"source" of each update, and so it can know if two updates are correlated or
not. In this way, a rune is similar to a signal like in SolidJS, except that
runes can be asynchronous.

[^1]: It is worth noting that "Rune" is not _entirely_ devoid of technical
meaning – it is both the name of an experimental programming language, and the
name of the character type in Go. But neither of these uses are ubiquitous, and
they're both used in rather different contexts from our use; the former is, of
course, a programming language, not a type, and though the latter is a type, it
is not generic, and thus very plainly a different concept.

[^2]: ["Monads for the Rest of Us"][monads4all] is an excellent, JS-based
explanation of monads and describes how monads can be useful even outside of
functional languages.

[monads4all]: https://gist.github.com/fatcerberus/beae4d15842071eab24fca2f0740c2ef
