import { expect, test } from "vitest";
import { createEpoch } from "./createEpoch.js";
import { verifyEpoch } from "./verifyEpoch.js";

test("verifyEpoch", () => {
  const epoch1 = createEpoch();

  expect(
    verifyEpoch({
      epoch: epoch1.epoch,
      signature: epoch1.signature,
    })
  ).toBeTruthy();

  const { epoch: epoch2, signature } = createEpoch({
    prevEpochPrivateKey: epoch1.privateKey,
    prevEpoch: epoch1.epoch,
  });

  expect(
    verifyEpoch({
      knownPublicKey: epoch1.epoch.publicKey,
      epoch: epoch2,
      signature,
    })
  ).toBeTruthy();
});
