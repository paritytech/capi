// TODO: chain-specific metadata
export type TmpMetadata = {
  pallets: {
    balances: {
      entries: {
        Something: {
          keys: [];
          value: "SUP";
        };
        Account: {
          keys: [accountId: Uint8Array];
          value: "TODO";
        };
      };
    };
  };
};
