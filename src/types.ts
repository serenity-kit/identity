export type InitialEpoch = {
  epoch: 0;
  publicKey: Uint8Array;
};

export type SubsequentEpoch = {
  epoch: number;
  publicKey: Uint8Array;
  previousPublicKey: Uint8Array;
};

export type Epoch = InitialEpoch | SubsequentEpoch;
