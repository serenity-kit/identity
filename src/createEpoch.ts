import { bls12_381 as bls } from "@noble/curves/bls12-381";
import { canonicalize } from "json-canonicalize";
import { Epoch, InitialEpoch, SubsequentEpoch } from "./types";

type CreateEpochParams = {
  prevEpoch: Epoch;
  prevEpochPrivateKey: Uint8Array;
};

export const createEpoch = (params?: CreateEpochParams) => {
  const privateKey = bls.utils.randomPrivateKey();
  const publicKey = bls.getPublicKey(privateKey);

  if (!params) {
    const epoch: InitialEpoch = {
      epoch: 0,
      publicKey,
    };
    const msg = new TextEncoder().encode(canonicalize(epoch));
    const signature = bls.sign(msg, privateKey);
    return {
      epoch,
      privateKey,
      signature,
    };
  }

  const epoch: SubsequentEpoch = {
    epoch: params.prevEpoch.epoch + 1,
    previousPublicKey: params.prevEpoch.publicKey,
    publicKey,
  };

  const msg = new TextEncoder().encode(canonicalize(epoch));

  const signatures = [params.prevEpochPrivateKey, privateKey].map(
    (privateKey) => {
      return bls.sign(msg, privateKey);
    }
  );
  const aggregatedSignature = bls.aggregateSignatures(signatures);

  return {
    epoch,
    privateKey,
    signature: aggregatedSignature,
  };
};
