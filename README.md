# Identity

This project aims to define and implement a system where users can have a unique identity represented by a current public key with the following properties:

- key rotation
- key recovery
- multi-device support

## Components

- User
- User Epoch
- Device

A **User** has a unique identifier which is the `public_key` of the first epoch. It must be accompanied by a signature which includes all the user and first user epoch data to verify the proof of ownership fo the `private_key` and all the relevant data e.g. user `email`.
A **User Epoch** is a version of a user with a unique `public_key`.
A **Device** is a a separate set of private/public keys that has access to a user epoch.

## Rough ideas

- Each Epoch has a content section where public keys (encryption and signing) are stored.
- You want clear distinction between the key that can evolve epoch and the epoch content, because there might be a lot of devices (web session) that are temporary and should not be able to evolve the epoch.
- The epoch private key could be splitted into multiple shares and then distributed to multiple devices. Depending on the application and which and how many devices are added a different set of devices are responsible to evolve the epoch.
- In a distributed setup the only way I can envision this to work is that more than 50% of the splitted key parts are necessary to evolve to the next epoch. Because in this case they will have the new epoch and you can't have a fork without a malicious device.

## Issues

- How to avoid sharing keys and ideally leverage features of systems to only encrypt/sign, but the key can't leave the system e.g. passkeys in the browser.

### User Epoch

## Building Blocks

## Key-Evolving Forward-Secure Signature Scheme

This repository implements a key-evolving forward-secure signature scheme using BLS (Boneh-Lynn-Shacham) signatures. The primary goal is to minimize the amount of data needed to verify multiple new epochs based on an existing one, ensuring efficient and secure signature management over time.

### Table of Contents

- [How the Scheme Works](#how-the-scheme-works)
  - [Key Concepts](#key-concepts)
  - [Epoch Creation](#epoch-creation)
  - [Epoch Verification](#epoch-verification)
  - [Batch Verification of Epochs](#batch-verification-of-epochs)
- [Usage](#usage)
  - [Installation](#installation)
  - [Creating Epochs](#creating-epochs)
  - [Verifying Epochs](#verifying-epochs)
  - [Batch Verifying Multiple Epochs](#batch-verifying-multiple-epochs)
- [Testing](#testing)
- [Dependencies](#dependencies)
- [Conclusion](#conclusion)

### How the Scheme Works

#### Key Concepts

- **Epoch**: A version in which a specific key pair (private and public key) is used.
- **Forward Security**: Security property where past communications or data remain secure even if current keys are compromised.
- **Signature Aggregation**: Combining multiple signatures into a single signature that can be verified against the aggregated public keys.

#### Epoch Creation

1. **Initial Epoch**:

   - Generate a new key pair (private and public key).
   - Set the epoch number to `0`.
   - Sign the epoch data with the private key.
   - The epoch data includes:
     - `epoch`: `0`
     - `publicKey`: The newly generated public key.

2. **Subsequent Epochs**:
   - Generate a new key pair.
   - Increment the epoch number.
   - Sign the epoch data with both the previous and the new private keys.
   - Aggregate the two signatures into one.
   - The epoch data includes:
     - `epoch`: Incremented epoch number.
     - `previousPublicKey`: Public key from the previous epoch.
     - `publicKey`: The newly generated public key.

#### Epoch Verification

1. **Initial Epoch**:

   - Verify the signature against the epoch data and the public key included in the epoch.

2. **Subsequent Epochs**:
   - Verify that the `previousPublicKey` matches the known public key.
   - Aggregate the `previousPublicKey` and the current `publicKey`.
   - Verify the aggregated signature against the epoch data and the aggregated public key.

#### Batch Verification of Epochs

- Efficiently verify multiple epochs by:
  - Aggregating messages and public keys for all epochs.
  - Using batch verification to verify the aggregated signature against the aggregated public keys and messages.
- Reduces the amount of data and computational overhead needed for verification.

### Usage

#### Creating Epochs

Initial Epoch

```javascript
import { createEpoch } from "./createEpoch.js";

const { epoch, privateKey, signature } = createEpoch();
```

Subsequent Epochs

```javascript
const {
  epoch: nextEpoch,
  privateKey: nextPrivateKey,
  signature: nextSignature,
} = createEpoch({
  prevEpoch: epoch,
  prevEpochPrivateKey: privateKey,
});
```

#### Verifying Epochs

Verifying Initial Epoch

```javascript
import { verifyEpoch } from "./verifyEpoch.js";

const isValid = verifyEpoch({
  epoch,
  signature,
});
```

Verifying Subsequent Epochs

```javascript
const isValid = verifyEpoch({
  knownPublicKey: epoch.publicKey, // Public key from the previous epoch
  epoch: nextEpoch,
  signature: nextSignature,
});
```

#### Batch Verifying Multiple Epochs

```javascript
import { verifyEpochs } from "./verifyEpochs.js";
import { bls12_381 as bls } from "@noble/curves/bls12-381";

// Assume you have an array of epochs and their signatures
const epochs = [epoch2, epoch3, epoch4];
const signatures = [epoch2.signature, epoch3.signature, epoch4.signature];

// Aggregate signatures
const aggregatedSignature = bls.aggregateSignatures(signatures);

// Extract public keys from epochs
const publicKeys = epochs.map((e) => e.publicKey);

const isValid = verifyEpochs({
  knownEpoch: epoch1, // Starting from a known epoch
  publicKeys,
  signature: aggregatedSignature,
});
```
