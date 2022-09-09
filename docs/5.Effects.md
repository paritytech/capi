# Effects

"Effects" are a type-safe means by which we model and dispatch potentially-complex interactions that span many chains. To understand this programming model, let's discuss effects beyond the context of network resource management.

Let's say we want to write a program that produces a random number. If the number is greater than `.5`, we want the program to fail (a strange little program, I'll admit).

```ts
class GtPoint5Error extends Error {
  constructor(value: number) {
    super(`The random number \`${value}\` is greater than \`.5\`.`);
  }
}

const getRand = (): number => {
  const rand = Math.random();
  if (rand > .5) {
    throw new GtPoint5Error(rand);
  }
  return rand;
};
```

## Type-safe Errors

How do we safeguard against `GtPoint5Error` causing trouble in other parts of our program? An unfortunate shortcoming of TypeScript is a lack of typed errors. In Rust, perhaps we could match error variants or propagate errors to the parent scope.

```rs
// Match and handle locally.
match getRand() {
  Err(e) => handleErr(e),
  Ok(o) => println!("{:?}", o),
}

// Propagate to parent for handling.
fn getRandOrErr() -> Result<u32, GtPoint5Error> {
  getRand()?
}
```

In TypeScript, we don't have this feature as a primitive of the language. So how might we type our errors? One solution would be to introduce a `Result` type.

```diff
- const getRand = (): number => {
+ const getRand = (): Result<number, GtPoint5> => {
    const rand = Math.random();
    if (rand > .5) {
-     throw new GtPoint5(rand);
+     return new GtPoint5(rand);
    }
-   return rand;
+   return ok(rand);
};
```

However, this introduces the complexity of propagating error types as we compose our program. Let's say we want to represent the addition of two numeric result types. We parameterize the constraints of `a` and `b` and produce a result type, derived from the error types extracted from those constraints. This does the trick, but introduces much boilerplate.

```ts
const add = <A extends Result<number, Error>, B extends Result<number, Error>>(
  a: A,
  b: B,
): Result<Extract<A, Error> | Extract<B, Error>> => {
  if (a instanceof Error) {
    return a;
  } else if (b instanceof Error) {
    return b;
  }
  return ok(a.ok + b.ok);
};
```

Because the error types of `A` and `B` are generic, we can never truly handle them within `add`. So, why do we even try? Ideally, the errors of `add`'s dependencies bubble to the `add` caller's root, where the applied arguments' error types are accessible for type-safe handling. More on this later.

## Optimized Execution

Let's go over one final pain point: optimizing execution.

We don't want to accidentally allocate all the JS thread's processing to a blocking operation. We don't want to accidentally send duplicate requests or keep connections alive for longer than they are needed. These are just a few of the considerations that go into smooth network interactions. In practice, these considerations pose great difficulty.

Imagine you're forming a derived request, wherein `requestC` accepts the result of `requestA` and `requestB`.

```ts
const a = await requestA();
const b = await requestB();
const c = await requestC(a, b);
```

In this case, we accidentally block on `requestA`, when we could execute it in parallel with `requestB`.

```ts
const a = requestA();
const b = requestB();
const c = await requestC(...await Promise.all([a, b]));
```

Or perhaps there are parts of our program which can produce repeat versions of a request.

```ts
const makeD = (value: number) => requestD(value);
makeD(Math.random());
makeD(Math.random());
```

If `Math.random()` miraculously returns `.25` twice, do we need to send the request a second time? If `requestD` is idempotent, then no.

The list of such situations goes on. The point is this: in an ideal world, the aforementioned responsibilities are offloaded from the developer. Enter, Capi's effect system.

## Capi Effects

TODO: description

### Final Note about Effects

The beauty of this programming model is that developers can see performance improvements as we enhance the effect runtime. Today, a Capi effect may take 100ms to execute. Tomorrow, it may take 30ms. The day after, ...

Onward to adventure.
