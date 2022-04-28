// TODO: how do we differentiate blocks from signed blocks?
export interface ChainGetBlockResult {
  block: {
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
  };
  justifications: null; // TODO...
}
