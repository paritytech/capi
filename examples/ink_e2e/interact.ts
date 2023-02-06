import { address } from "./deploy.ts"

const instance = ink.InkContractRune.fromAddress(address)

instance.call(...)
