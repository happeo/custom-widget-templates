import { User } from "models/user";
import {
  createKeySymmetricEncryptDecrypt,
  getCryptoKey,
  encryptSymmetric,
  decryptSymmetric,
} from "./kms";

const getKeyNameForOrganisation = (user: User) =>
  `org_key_${user.organisationId || "generic"}`;

const encryptToken = async (user: User, token: string) => {
  try {
    const keyName = getKeyNameForOrganisation(user);
    const cryptoKey = await getCryptoKey(keyName);
    if (!cryptoKey) {
      await createKeySymmetricEncryptDecrypt(keyName);
    }
    return await encryptSymmetric(keyName, JSON.stringify(token));
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const decryptToken = async (user: User, cipher: string) => {
  try {
    const keyName = getKeyNameForOrganisation(user);
    const plaintext = await decryptSymmetric(keyName, cipher);
    return JSON.parse(plaintext as string);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { encryptToken, decryptToken };
