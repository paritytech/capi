export interface Block {
  extrinsics: string[];
  header: {
    digest: {
      logs: string[];
    };
    extrinsicsRoot: string;
    number: string;
    parentHash: string;
    stateRoot: string;
  };
}

export interface Head {
  digest: {
    logs: string[];
  };
  extrinsicsRoot: string;
  number: string;
  parentHash: string;
  stateRoot: string;
}
