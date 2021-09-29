import { KeyManagementServiceClient } from "@google-cloud/kms";
import { PROJECT_NAME, KMS_LOCATION, KEYRING_NAME } from "../constants";
import { BadRequest, Unauthorized, InternalServerError } from "http-errors";
const crc32c = require("fast-crc32c");
const { NODE_ENV } = process.env;
const DAY_IN_SECONDS = 3600 * 24;
const ROTATION_DAYS = 30 * 3; // 3 months
const ROTATION_PERIOD = DAY_IN_SECONDS * ROTATION_DAYS;

const client = new KeyManagementServiceClient({
  ...(NODE_ENV === "local"
    ? {
        credentials: require("../../.secrets/service-account.json"),
      }
    : {}),
});
const locationName = client.locationPath(PROJECT_NAME, KMS_LOCATION);
const keyRingLocation = client.keyRingPath(
  PROJECT_NAME,
  KMS_LOCATION,
  KEYRING_NAME,
);

async function getKeyRing() {
  try {
    const [keyRing] = await client.getKeyRing({
      name: keyRingLocation,
    });

    return keyRing;
  } catch (error: any) {
    if (error.code === 5) {
      // Not found > create new key ring
      return null;
    }
    throw new InternalServerError("keyring_not_found");
  }
}

async function createKeyRing() {
  try {
    const [keyRing] = await client.createKeyRing({
      parent: locationName,
      keyRingId: KEYRING_NAME,
    });

    console.log(`[Encryption] Created new key ring: ${keyRing.name}`);
    return keyRing;
  } catch (error) {
    console.error(error);
    throw new InternalServerError("cannot_create_keyring");
  }
}

async function initKeyRing() {
  const existingKeyRing = await getKeyRing();
  if (existingKeyRing) {
    console.log("[Encryption] Key ring ready");
    return;
  }

  await createKeyRing();
  console.log("[Encryption] Key ring ready");
}

async function getCryptoKey(cryptoKeyId: string) {
  try {
    const name = client.cryptoKeyPath(
      PROJECT_NAME,
      KMS_LOCATION,
      KEYRING_NAME,
      cryptoKeyId,
    );
    const [key] = await client.getCryptoKey({
      name,
    });
    return key;
  } catch (error: any) {
    if ([5, 9].includes(error.code)) {
      // Not found > create new key ring
      return null;
    }
    console.error(error);
    throw new Unauthorized("cannot_retreive_token");
  }
}

async function createKeySymmetricEncryptDecrypt(cryptoKeyId: string) {
  const [key] = await client.createCryptoKey({
    parent: keyRingLocation,
    cryptoKeyId,
    cryptoKey: {
      rotationPeriod: {
        seconds: ROTATION_PERIOD,
      },
      nextRotationTime: {
        seconds: Date.now() / 1000 + ROTATION_PERIOD,
      },
      purpose: "ENCRYPT_DECRYPT",
      versionTemplate: {
        algorithm: "GOOGLE_SYMMETRIC_ENCRYPTION",
      },
    },
  });

  console.log(`[Encryption] Created symmetric key: ${key.name}`);
  return key;
}

async function encryptSymmetric(keyName: string, dataToEncrypt: string) {
  if (typeof dataToEncrypt !== "string") {
    throw new BadRequest("only_string_allowed");
  }

  const name = client.cryptoKeyPath(
    PROJECT_NAME,
    KMS_LOCATION,
    KEYRING_NAME,
    keyName,
  );
  const plaintextBuffer = Buffer.from(dataToEncrypt);
  const plaintextCrc32c = crc32c.calculate(plaintextBuffer);
  const [encryptResponse] = await client.encrypt({
    name,
    plaintext: plaintextBuffer,
    plaintextCrc32c: {
      value: plaintextCrc32c,
    },
  });

  const ciphertext = encryptResponse.ciphertext;

  // Optional, but recommended: perform integrity verification on encryptResponse.
  // For more details on ensuring E2E in-transit integrity to and from Cloud KMS visit:
  // https://cloud.google.com/kms/docs/data-integrity-guidelines
  if (!encryptResponse.verifiedPlaintextCrc32c) {
    throw new InternalServerError("Encrypt: request corrupted in-transit");
  }
  if (
    crc32c.calculate(ciphertext) !==
    Number(encryptResponse.ciphertextCrc32c?.value)
  ) {
    throw new InternalServerError("Encrypt: response corrupted in-transit");
  }
  return ciphertext;
}

async function decryptSymmetric(keyName: string, ciphertext: string) {
  try {
    const name = client.cryptoKeyPath(
      PROJECT_NAME,
      KMS_LOCATION,
      KEYRING_NAME,
      keyName,
    );
    const ciphertextCrc32c = crc32c.calculate(ciphertext);

    const [decryptResponse] = await client.decrypt({
      name,
      ciphertext: ciphertext,
      ciphertextCrc32c: {
        value: ciphertextCrc32c,
      },
    });

    // Optional, but recommended: perform integrity verification on decryptResponse.
    // For more details on ensuring E2E in-transit integrity to and from Cloud KMS visit:
    // https://cloud.google.com/kms/docs/data-integrity-guidelines
    if (
      crc32c.calculate(decryptResponse.plaintext) !==
      Number(decryptResponse.plaintextCrc32c?.value)
    ) {
      throw new InternalServerError("Decrypt: response corrupted in-transit");
    }

    const plaintext = decryptResponse.plaintext?.toString();
    return plaintext;
  } catch (error) {
    console.error(error);
    throw new Unauthorized("cannot_retreive_token");
  }
}

export {
  initKeyRing,
  getCryptoKey,
  createKeySymmetricEncryptDecrypt,
  encryptSymmetric,
  decryptSymmetric,
};
