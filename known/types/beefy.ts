// TODO: clean this up!

export interface SignedCommitment {
  commitment: Commitment;
  signatures: ("TODO" | undefined)[];
}

export interface Commitment {
  payload: Payload;
  blockNumber: number;
  validatorSetId: string;
}

export type Payload = [[PayloadId, number[]][]];

export type PayloadId = number;
