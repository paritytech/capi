export type ExtrinsicStatus =
  | ExtrinsicStatus.Validated
  | ExtrinsicStatus.Invalidated
  | ExtrinsicStatus.Broadcasted
  | ExtrinsicStatus.Dropped
  | ExtrinsicStatus.Included
  | ExtrinsicStatus.Finalized
  | ExtrinsicStatus.Errored
export namespace ExtrinsicStatus {
  export interface Validated {
    type: "validated"
  }
  export interface Invalidated {
    type: "invalidated"
    reason?: string
  }
  export interface Broadcasted {
    type: "broadcasted"
    numPeers: number
  }
  export interface Dropped {
    type: "dropped"
    broadcasted?: boolean
    reason?: string
  }
  export interface Included {
    type: "included"
    block?: ExtrinsicStatusBlock
  }
  export interface Finalized {
    type: "finalized"
    block: ExtrinsicStatusBlock
  }
  export interface Errored {
    type: "errored"
    message: string
  }
}

export interface ExtrinsicStatusBlock {
  hash: string
  index?: string
}
