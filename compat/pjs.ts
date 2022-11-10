import { KeyringPair } from "../deps/polkadot/keyring/types.ts"
import { MultiAddress, MultiSignature, Signer } from "../frame_metadata/Extrinsic.ts"

export function multiAddressFromKeypair(keypair: KeyringPair): MultiAddress {
  return MultiAddress.Id(keypair.publicKey)
}

export function signerFromKeypair(keypair: KeyringPair): Signer {
  const type = ((): MultiSignature["type"] => {
    switch (keypair.type) {
      case "sr25519": {
        return "Sr25519"
      }
      case "ed25519": {
        return "Ed25519"
      }
      default: {
        // TODO
        return null!
      }
    }
  })()
  return (message) => ({
    type,
    value: keypair.sign(message),
  })
}
