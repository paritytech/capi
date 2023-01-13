import { PathInfo } from "../PathInfo.ts"
import {
  FrameProviderBase,
  FrameTargetBase,
  getClient,
  getClientFile,
  getRawClientFile,
} from "./FrameBase.ts"

export class WssProvider extends FrameProviderBase {
  target(pathInfo: PathInfo) {
    return new WssTarget(this, pathInfo)
  }
}

export class WssTarget extends FrameTargetBase<WssProvider> {
  url

  constructor(provider: WssProvider, pathInfo: PathInfo) {
    super(provider, pathInfo)
    this.url = `wss://${pathInfo.target}`
  }

  getClient = getClient
  getClientFile = getClientFile
  getRawClientFile = getRawClientFile
}
