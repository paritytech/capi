import { CapiBinary } from "../deps/capi_binary_builds.ts"

export type CapiBinaryArgs = ConstructorParameters<typeof CapiBinary>

export function autobin<K extends PropertyKey>(
  binariesProps: Record<K, string | CapiBinaryArgs>,
  _signal?: AbortSignal, // TODO: use `_signal` in capi-binary-builds
) {
  return Object.fromEntries(
    Object.entries(binariesProps).map(([k, v]) => {
      if (typeof v === "string") return [k, () => Promise.resolve(v)]
      const binary = new CapiBinary(...v as CapiBinaryArgs)
      return [k, async () => {
        if (!(await binary.exists())) {
          console.log("Downloading", binary.key)
          await binary.download()
        }
        return binary.path
      }]
    }),
  ) as { [_ in K]: () => Promise<string> }
}
