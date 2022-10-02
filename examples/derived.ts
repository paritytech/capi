import * as C from "../mod.ts";

const ids = C.readEntry(C.polkadot, "Paras", "Parachains", []);

const root = C.into([ids], ({ value }) => {
  const heads = value.map((id: number) => {
    return C.readEntry(C.polkadot, "Paras", "Heads", [id]);
  });
  return C.all(...heads);
});

const result = await root.run();

if (result instanceof Error) {
  throw result;
}
console.log(result);
