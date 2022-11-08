import * as Z from "../../deps/zones.ts";

// TODO: move this into zones
export function option<Target, UseResult>(
  target: Target,
  use: (resolved: NonNullable<Z.T<Target>>) => UseResult,
): Z.Effect<undefined | Exclude<UseResult, Error>, Z.E<Target> | Extract<UseResult, Error>> {
  return Z.call(target, (resolved) => {
    return resolved ? use(resolved) : undefined;
  });
}
