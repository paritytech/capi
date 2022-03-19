import { configSchema } from "/config/Raw.ts";
import * as path from "std/path/mod.ts";

await Deno.writeFile(
  path.join("target", "schema.json"),
  new TextEncoder().encode(JSON.stringify(configSchema, null, 2)),
);
