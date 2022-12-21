import * as C from "../mod.ts"
import { storageEntry } from "./StorageMap.ts"

export function storageItem<Client extends C.Z.$<C.rpc.Client>>(
  client: Client,
  pallet: string,
  name: string,
) {
  return storageEntry(client, pallet, name)
}
