import { bls12_381 as bls } from "@noble/curves/bls12-381";
import { canonicalize } from "json-canonicalize";
import { Epoch } from "./types";

type Params = {
  signature: Uint8Array;
  knownEpoch: Epoch;
  // ordered list of public keys, excluding the knownEpoch.publicKey
  publicKeys: Uint8Array[];
};

export const verifyEpochs = ({ signature, publicKeys, knownEpoch }: Params) => {
  if (publicKeys.length === 0) {
    return false;
  }

  let epochCounter = knownEpoch.epoch;

  const messages = publicKeys.map((publicKey, index) => {
    const epoch: Epoch = {
      epoch: epochCounter + 1,
      previousPublicKey:
        index === 0 ? knownEpoch.publicKey : publicKeys[index - 1],
      publicKey,
    };
    epochCounter++;
    return new TextEncoder().encode(canonicalize(epoch));
  });
  const aggregatePublicKeys = publicKeys.map((publicKey, index) => {
    return bls.aggregatePublicKeys([
      index === 0 ? knownEpoch.publicKey : publicKeys[index - 1],
      publicKey,
    ]);
  });

  return bls.verifyBatch(signature, messages, aggregatePublicKeys);
};
