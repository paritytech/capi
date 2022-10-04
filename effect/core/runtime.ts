import * as Z from "../../deps/zones.ts";

export const runtime = Z.runtime();

export abstract class Name extends Z.Name {
  run = runtime(this);
}
