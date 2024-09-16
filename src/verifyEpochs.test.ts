import { bls12_381 as bls } from "@noble/curves/bls12-381";
import { expect, test } from "vitest";
import { createEpoch } from "./createEpoch.js";
import { verifyEpochs } from "./verifyEpochs.js";

test("verifyEpochs", () => {
  const epoch1 = createEpoch();

  const epoch2 = createEpoch({
    prevEpochPrivateKey: epoch1.privateKey,
    prevEpoch: epoch1.epoch,
  });

  expect(
    verifyEpochs({
      publicKeys: [epoch2.epoch.publicKey],
      knownEpoch: epoch1.epoch,
      signature: epoch2.signature,
    })
  ).toBeTruthy();

  const epoch3 = createEpoch({
    prevEpochPrivateKey: epoch2.privateKey,
    prevEpoch: epoch2.epoch,
  });
  const epoch4 = createEpoch({
    prevEpochPrivateKey: epoch3.privateKey,
    prevEpoch: epoch3.epoch,
  });
  const aggregatedSignatureEpoch2To4 = bls.aggregateSignatures([
    epoch3.signature,
    epoch4.signature,
  ]);

  expect(
    verifyEpochs({
      publicKeys: [epoch3.epoch.publicKey, epoch4.epoch.publicKey],
      knownEpoch: epoch2.epoch,
      signature: aggregatedSignatureEpoch2To4,
    })
  ).toBeTruthy();
});
