import { GenesisConfig } from "./ChainSpec.ts"

const hrmpChannelMaxCapacity = 8
const hrmpChannelMaxMessageSize = 512
export function addXcmHrmpChannels(genesisConfig: GenesisConfig, paraIds: number[]) {
  genesisConfig.hrmp ??= { preopenHrmpChannels: [] }
  for (const senderParaId of paraIds) {
    for (const recipientParaId of paraIds) {
      if (senderParaId === recipientParaId) continue
      genesisConfig.hrmp.preopenHrmpChannels.push([
        senderParaId,
        recipientParaId,
        hrmpChannelMaxCapacity,
        hrmpChannelMaxMessageSize,
      ])
    }
  }
}
