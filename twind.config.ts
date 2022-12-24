import { Options } from "$fresh/plugins/twind.ts"

export default ((): Options => ({
  selfURL: import.meta.url,
}))()
