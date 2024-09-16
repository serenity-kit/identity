import { bls12_381 as bls } from "@noble/curves/bls12-381";
import { canonicalize } from "json-canonicalize";
import { expect, test } from "vitest";

test("bls aggregate", () => {
  const message = new TextEncoder().encode(canonicalize({ text: "Hello" }));

  const privateKey1 = bls.utils.randomPrivateKey();
  const publicKey1 = bls.getPublicKey(privateKey1);
  const signature1 = bls.sign(message, privateKey1);

  const privateKey2 = bls.utils.randomPrivateKey();
  const publicKey2 = bls.getPublicKey(privateKey2);
  const signature2 = bls.sign(message, privateKey2);

  const aggregatePublicKey = bls.aggregatePublicKeys([publicKey1, publicKey2]);
  const aggregateSignature = bls.aggregateSignatures([signature1, signature2]);

  const isValid = bls.verify(aggregateSignature, message, aggregatePublicKey);
  expect(isValid).toBeTruthy();
});

test("bls aggregate again", () => {
  const message = new TextEncoder().encode(canonicalize({ text: "Hello" }));

  const privateKey1 = bls.utils.randomPrivateKey();
  const publicKey1 = bls.getPublicKey(privateKey1);
  const signature1 = bls.sign(message, privateKey1);

  const privateKey2 = bls.utils.randomPrivateKey();
  const publicKey2 = bls.getPublicKey(privateKey2);
  const signature2 = bls.sign(message, privateKey2);

  const aggregatePublicKey = bls.aggregatePublicKeys([publicKey1, publicKey2]);
  const aggregateSignature = bls.aggregateSignatures([signature1, signature2]);

  const isValid = bls.verify(aggregateSignature, message, aggregatePublicKey);
  expect(isValid).toBeTruthy();

  const privateKey3 = bls.utils.randomPrivateKey();
  const publicKey3 = bls.getPublicKey(privateKey3);
  const signature3 = bls.sign(message, privateKey3);

  const aggregatePublicKey2 = bls.aggregatePublicKeys([
    aggregatePublicKey,
    publicKey3,
  ]);
  const aggregateSignature2 = bls.aggregateSignatures([
    aggregateSignature,
    signature3,
  ]);

  const isValid2 = bls.verify(
    aggregateSignature2,
    message,
    aggregatePublicKey2
  );
  expect(isValid2).toBeTruthy();
});

test("bls verify batch", () => {
  const message1 = new TextEncoder().encode(canonicalize({ text: "Hello" }));
  const privateKey1 = bls.utils.randomPrivateKey();
  const publicKey1 = bls.getPublicKey(privateKey1);
  const signature1 = bls.sign(message1, privateKey1);

  const message2 = new TextEncoder().encode(canonicalize({ text: "World" }));
  const privateKey2 = bls.utils.randomPrivateKey();
  const publicKey2 = bls.getPublicKey(privateKey2);
  const signature2 = bls.sign(message2, privateKey2);

  const aggregateSignature = bls.aggregateSignatures([signature1, signature2]);

  const isValidBatch = bls.verifyBatch(
    aggregateSignature,
    [message1, message2],
    [publicKey1, publicKey2]
  );
  expect(isValidBatch).toBeTruthy();
});

test("bls aggregate & verify batch", () => {
  const message = new TextEncoder().encode(canonicalize({ text: "Hello" }));

  const privateKey1 = bls.utils.randomPrivateKey();
  const publicKey1 = bls.getPublicKey(privateKey1);
  const signature1 = bls.sign(message, privateKey1);

  const privateKey2 = bls.utils.randomPrivateKey();
  const publicKey2 = bls.getPublicKey(privateKey2);
  const signature2 = bls.sign(message, privateKey2);

  const aggregatePublicKey = bls.aggregatePublicKeys([publicKey1, publicKey2]);
  const aggregateSignature = bls.aggregateSignatures([signature1, signature2]);

  const isValid = bls.verify(aggregateSignature, message, aggregatePublicKey);
  expect(isValid).toBeTruthy();

  const message3 = new TextEncoder().encode(canonicalize({ text: "World" }));
  const privateKey3 = bls.utils.randomPrivateKey();
  const publicKey3 = bls.getPublicKey(privateKey3);
  const signature3 = bls.sign(message3, privateKey3);

  const aggregateSignature3 = bls.aggregateSignatures([
    aggregateSignature,
    signature3,
  ]);

  const isValidBatch = bls.verifyBatch(
    aggregateSignature3,
    [message, message3],
    [aggregatePublicKey, publicKey3]
  );
  expect(isValidBatch).toBeTruthy();
});
