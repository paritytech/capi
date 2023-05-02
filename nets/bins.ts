import { CapiBinary } from "../deps/capi_binary_builds.ts"

export type CapiBinaryArgs = ConstructorParameters<typeof CapiBinary>

export type BinaryResolver = (signal: AbortSignal) => Promise<string>

export function bins<K extends PropertyKey>(
  binariesProps: Record<K, string | CapiBinaryArgs>,
): Record<K, BinaryResolver>
export function bins(
  binariesProps: Record<string, string | CapiBinaryArgs>,
): Record<string, BinaryResolver> {
  return Object.fromEntries(
    Object.entries(binariesProps).map(([k, v]) => {
      if (typeof v === "string") return [k, () => Promise.resolve(v)]
      const binary = new CapiBinary(...v as CapiBinaryArgs)
      return [k, async (_signal: AbortSignal) => { // TODO: use `_signal` in capi-binary-builds
        if (!(await binary.exists())) {
          console.log("Downloading", binary.key)
          await binary.download()
        }
        return binary.path
      }]
    }),
  )
}
