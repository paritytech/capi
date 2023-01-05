import { assertEquals } from "../../deps/std/testing/asserts.ts"
import { routeInfo } from "./RouteInfo.ts"

Deno.test("routeInfo parses correctly", () => {
  assertEquals(routeInfo(toUrl("")), {
    type: "LandingPage",
  })

  assertEquals(routeInfo(toUrl(".well-known/deno-import-intellisense.json")), {
    type: "IntellisenseManifest",
  })

  assertEquals(routeInfo(toUrl("completions/frameCompassTypes")), {
    type: "FrameCompassTypeCompletions",
  })

  assertEquals(routeInfo(toUrl("completions/frameCompassUris/dev")), {
    type: "FrameCompassUriCompletions",
    compassType: "dev",
  })

  assertEquals(routeInfo(toUrl("completions/frameCompassVersions/dev/polkadot")), {
    type: "FrameCompassVersionCompletions",
    compassType: "dev",
    compassUri: "polkadot",
  })

  assertEquals(routeInfo(toUrl("completions/frameChainTs/dev/polkadot@runtimeVersion")), {
    type: "FrameChainTsCompletions",
    compass: {
      type: "dev",
      uri: "polkadot",
      version: "runtimeVersion",
    },
  })

  assertEquals(routeInfo(toUrl("frame/dev/polkadot@runtimeVersion/types/my/Type.ts")), {
    type: "FrameChainTs",
    compass: {
      type: "dev",
      uri: "polkadot",
      version: "runtimeVersion",
    },
    path: "types/my/Type.ts",
  })

  assertEquals(
    routeInfo(toUrl("frame/url/wss://rpc.polkadot.io@runtimeVersion/types/my/Type.ts")),
    {
      type: "FrameChainTs",
      compass: {
        type: "url",
        uri: "wss://rpc.polkadot.io",
        version: "runtimeVersion",
      },
      path: "types/my/Type.ts",
    },
  )
})

function toUrl(path: string): URL {
  return new URL(`http://localhost:8000/${path}`)
}
