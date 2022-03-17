# Effects

"Effects" are a type-safe means by which we model and dispatch potentially-complex interactions that span many chains. However, to understand this programming model, let's discuss effects beyond the context of network resource management.

Let's say we want to write a program that produces a random number. If the number is greater than `.5`, we want the program to fail (a strange little program, I'll admit).

```ts
class GtPoint5 extends Error {
  constructor(value: number) {
    super(`The random number \`${value}\` is greater than \`.5\`.`);
  }
}

const getRand = (): number => {
  const rand = Math.random();
  if (rand > .5) {
    throw new GtPoint5(rand);
  }
  return rand;
};
```

## Dependency Injection

What if we want to enable developers to swap in their own random-number-generating function (ie. dependency injection)? I suppose we could pass the function as an argument.

```diff
- const getRand = (): number => {
+ const getRand = (rand: () => number): number => {
-   const rand = Math.random();
+   const rand = rand();
    if (rand > .5) {
      throw new GtPoint5(rand);
    }
    return rand;
  };
```

This isn't ideal however, as we must now pass in a `rand` function wherever we call `getRand`.

## Type-safe Errors

There's another issue: how do we safeguard against `GtPoint5` in other parts of our program? An unfortunate shortcoming of TypeScript is a lack of typed errors. In Rust, perhaps we could match error variants as follows.

```rs
match getRand() {
  Err(e) => handleErr(e),
  Ok(o) => println!("{:?}", o),
}
```

In TypeScript, we don't have this ability. We must create the `Result` type for ourselves and be sure to return an `Error` subtype or the appropriate wrapped `ok` value.

```diff
- const getRand = (): number => {
+ const getRand = (): Result<GtPoint5, number> => {
    const rand = Math.random();
    if (rand > .5) {
-     throw new GtPoint5(rand);
+     return new GtPoint5(rand);
    }
-   return rand;
+   return ok(rand);
};
```

However, this introduces the complexity of matching and handling error variants as we compose our program. Let's say we want to represent addition of `getRand` results.

```ts
const add = <
  AE,
  A extends Result<AE, number>,
  BE,
  B extends Result<BE, number>,
>(
  a: A,
  b: B,
): Result<AE | BE> => {
  if (a instanceof Error) {
    return a;
  } else if (b instanceof Error) {
    return b;
  }
  return a.ok + b.ok;
};
```

The error types of `A` and `B` are generic, which means we can never truly handle them within `add`. So, why do we even try? Ideally, the errors of `add`'s dependencies would bubble to the `add` caller's root, where the types of `AE` and `BE` are accessible for type-safe handling. More on this later.

## Optimized Execution

Let's go over one final pain point: optimizing execution.

We don't want to accidentally allocate all of the JS thread's processing to a blocking operation. We don't want to accidentally send duplicate requests. We don't want to keep connections alive for longer than they are needed. These are just a few of the considerations that go into a good JavaScript-network interactions. In practice, these considerations pose great difficulty.

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
const c = await requestC(...Promise.all([a, b] as const));
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

Let's represent the example from earlier using Capi's effect system.

First, we import `capi/system`

```ts
import * as sys from "capi/system/mod.ts";
```

Next, we define an interface containing whatever dependencies we want to––eventually––inject. This is known as the runtime requirement or `R`.

```ts
interface GetRandR {
  rand(): number;
}
```

Next, we'll instantiate our effect.

```ts
const getRand = sys.effect<number, GetRandR>()("Rand", {}, async (runtime) => {
  const rand = runtime.rand();
  if (rand > .5) {
    return new GtPoint5();
  }
  return sys.ok(rand);
});
```

As you can see, we specify that the `Ok` value or `A` is of type `number`. We also give the Effect a name, `"Rand"` and supply the unit of computation.

The type of `getRand` is equivalent to the following:

```ts
type GetRand = sys.Effect<GetRandR, any, number, {}, any>;
```

What exactly are these type parameters?

```ts
type Effect<
  R,
  E extends Error,
  A,
  D extends AnyDeps,
  C,
> = {/* ... */};
```

- `R` is the runtime requirement previously mentioned
- `E` is an `Error` subtype
- `A` is the type of of whatever value was returned, wrapped in an `ok` call
- `D` is a record, whose values are also effects
- `C` is a phantom type, which we'll eventually use to constrain the mixing and matching of cross-chain effects

Now, let's combine some effects!

We'll define a new one, which simply adds the number `3` to the resolved value of its sole dependency.

```ts
interface AddR {
  add(a: number, b: number): number;
}

const AddToThree = <Target extends sys.AnyEffectA<number>>(target: Target) => {
  return sys.effect<number, AddR>()(
    "AddToThree",
    { target },
    async (runtime, resolved) => {
      return sys.ok(runtime.add(resolved.target, 3));
    },
  );
};
```

We see the second argument of the final `sys.effect` stage––the dependency record––is not empty. We specify `target`, which will ultimately be resolved and supplied to the closure as a member of `resolved`.

Let's use our `getRand` effect and `AddToThree` effect factory!

```ts
const addRandToThree = AddToThree(getRand);
```

If we take a look at the signature of `addRandToThree`, we see something very intriguing:

```ts
type addToThreeReturn = sys.Effect<AddR, never, number, {
  target: sys.Effect<RandRuntime, RandomIsGtPoint5, number, {}, any>;
}, any>;
```

The dependencies, error variants and result stages––of our entire program––are represented within the type system. Let's try to create a fiber from `addToThreeReturn`.

```ts
const fiber = sys.Fiber(addToThreeReturn, {});
//                                        ^
//                                        Type error! Missing dependencies.
```

We immediately get an error message, as we have not satisfied the runtime requirements. Let's fix this.

```ts
const fiber = sys.Fiber(addToThreeReturn, {
  rand() {
    return Math.random();
  },
  add(a, b) {
    return a + b;
  },
});
```

Now let's run the fiber.

```ts
const result = await fiber.run();
```

And surely enough, we either get an `Ok`, containing a numeric value:

```sh
{ ok: 3.3287550827663788 }
```

... or, we get an expected `GtPoint5` error.

```sh
{
  err: is_gt_point_5
    at Effect.run (file:///Users/spike/Desktop/hic-sunt-dracones/examples/effect.ts:32:16)
    at next (file:///Users/spike/Desktop/hic-sunt-dracones/system/Fiber.ts:59:17)
    at async file:///Users/spike/Desktop/hic-sunt-dracones/system/Fiber.ts:37:28
    at async Promise.all (index 0)
    at async next (file:///Users/spike/Desktop/hic-sunt-dracones/system/Fiber.ts:52:26)
    at async Module.Fiber (file:///Users/spike/Desktop/hic-sunt-dracones/system/Fiber.ts:12:18)
    at async file:///Users/spike/Desktop/hic-sunt-dracones/examples/effect.ts:52:16
}
```

This is of course also represented within the type system.

```ts
if (result instanceof Error) {
  result; // signature of `GtPoint5`
} else {
  result; // signature of `number`
}
```

### Final Note about Effects

The beauty of this programming model is that developers can see performance improvements as we enhance the executor. Today, a Capi Effect may take 100ms to execute. Tomorrow, it may take 30ms. The day after, ...

Onward to adventure.
