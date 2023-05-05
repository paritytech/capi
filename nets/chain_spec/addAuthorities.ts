import { GenesisConfig } from "./ChainSpec.ts"

export function addAuthorities(genesisConfig: GenesisConfig, count: number) {
  if (count > authorities.length) {
    throw new Error(`authorities count should be <= ${authorities.length}`)
  }
  const genesisAuthorities = authorities.slice(0, count)
  if (genesisConfig.session) {
    genesisConfig.session.keys = genesisAuthorities.map((
      { srAccount, srStash, edAccount, ecAccount },
    ) => [
      srStash,
      srStash,
      {
        grandpa: edAccount,
        babe: srAccount,
        im_online: srAccount,
        para_validator: srAccount,
        para_assignment: srAccount,
        authority_discovery: srAccount,
        beefy: ecAccount,
      },
    ])
  } else if (genesisConfig.aura && genesisConfig.grandpa) {
    genesisConfig.aura.authorities = genesisAuthorities.map(({ srAccount }) => srAccount)
    genesisConfig.grandpa.authorities = genesisAuthorities.map((
      { edAccount },
    ) => [edAccount, 1])
  }
}

export const authorities = [
  {
    name: "alice",
    srAccount: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    srStash: "5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY",
    edAccount: "5FA9nQDVg267DEd8m1ZypXLBnvN7SFxYwV7ndqSYGiN9TTpu",
    // cspell:disable-next-line
    ecAccount: "KW39r9CJjAVzmkf9zQ4YDb2hqfAVGdRqn53eRqyruqpxAP5YL",
  },
  {
    name: "bob",
    srAccount: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    srStash: "5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc",
    edAccount: "5GoNkf6WdbxCFnPdAnYYQyCjAKPJgLNxXwPjwTh6DGg6gN3E",
    // cspell:disable-next-line
    ecAccount: "KWByAN7WfZABWS5AoWqxriRmF5f2jnDqy3rB5pfHLGkY93ibN",
  },
  {
    name: "charlie",
    srAccount: "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
    srStash: "5Ck5SLSHYac6WFt5UZRSsdJjwmpSZq85fd5TRNAdZQVzEAPT",
    edAccount: "5DbKjhNLpqX3zqZdNBc9BGb4fHU1cRBaDhJUskrvkwfraDi6",
    // cspell:disable-next-line
    ecAccount: "KWBpGtyJLBkJERdZT1a1uu19c2uPpZm9nFd8SGtCfRUAT3Y4w",
  },
  {
    name: "dave",
    srAccount: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy",
    srStash: "5HKPmK9GYtE1PSLsS1qiYU9xQ9Si1NcEhdeCq9sw5bqu4ns8",
    edAccount: "5ECTwv6cZ5nJQPk6tWfaTrEk8YH2L7X1VT4EL5Tx2ikfFwb7",
    // cspell:disable-next-line
    ecAccount: "KWCycezxoy7MWTTqA5JDKxJbqVMiNfqThKFhb5dTfsbNaGbrW",
  },
  {
    name: "eve",
    srAccount: "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw",
    srStash: "5FCfAonRZgTFrTd9HREEyeJjDpT397KMzizE6T3DvebLFE7n",
    edAccount: "5Ck2miBfCe1JQ4cY3NDsXyBaD6EcsgiVmEFTWwqNSs25XDEq",
    // cspell:disable-next-line
    ecAccount: "KW9NRAHXUXhBnu3j1AGzUXs2AuiEPCSjYe8oGan44nwvH5qKp",
  },
  {
    name: "ferdie",
    srAccount: "5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL",
    srStash: "5CRmqmsiNFExV6VbdmPJViVxrWmkaXXvBrSX8oqBT8R9vmWk",
    edAccount: "5E2BmpVFzYGd386XRCZ76cDePMB3sfbZp5ZKGUsrG1m6gomN",
    // cspell:disable-next-line
    ecAccount: "KW6E1KGr5pqJ9Trgt7eAuA7d7mgpJPydiEDKc2h1aGTEEzYC1",
  },
]
