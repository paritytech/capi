import { connect } from "@capi/polkadot"
import { ExperimentalConsumer, hex } from "capi"

const controller = new AbortController()
const { signal } = controller
const consumer = new ExperimentalConsumer(connect(signal), connect(signal), signal)

// const metadata = await consumer.metadata()
// console.log(metadata)

// const blockHash = await consumer.blockHash(0)
// console.log(blockHash)

// const block = await consumer.block()
// console.log(block)

// const systemAccountKey = "26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9"
// const keys = await consumer.keys(hex.decode(systemAccountKey), 1)
// console.log(keys)

// const values = await consumer.values(keys)
// console.log(values)
