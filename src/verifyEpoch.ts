import { bls12_381 as bls } from "@noble/curves/bls12-381";
import { canonicalize } from "json-canonicalize";
import { Epoch } from "./types";
import { isEqualUint8Array } from "./utils/isEqualUint8Array";

type Params = {
  epoch: Epoch;
  signature: Uint8Array;
  knownPublicKey?: Uint8Array;
};

export const verifyEpoch = ({ epoch, signature, knownPublicKey }: Params) => {
  if (epoch.epoch === 0 && knownPublicKey === undefined) {
    const msg = new TextEncoder().encode(canonicalize(epoch));
    return bls.verify(signature, msg, epoch.publicKey);
  }

  if (knownPublicKey === undefined) {
    return false;
  }

  // @ts-expect-error previousPublicKey is defined only for SubsequentEpoch
  if (!isEqualUint8Array(knownPublicKey, epoch.previousPublicKey)) {
    return false;
  }
  const aggregatedPublicKey = bls.aggregatePublicKeys([
    knownPublicKey,
    epoch.publicKey,
  ]);

  const msg = new TextEncoder().encode(canonicalize(epoch));
  return bls.verify(signature, msg, aggregatedPublicKey);
};
