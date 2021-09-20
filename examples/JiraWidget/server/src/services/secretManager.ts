import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { SECRETS_PROJECT } from "../constants";
const { NODE_ENV } = process.env;

const client = new SecretManagerServiceClient({
  ...(NODE_ENV === "local"
    ? {
        credentials: require("../../.secrets/service-account.json"),
      }
    : {}),
});

const getSecret = async (secretId: string) => {
  try {
    const [accessResponse] = await client.accessSecretVersion({
      name: `${SECRETS_PROJECT}/secrets/${secretId}/versions/latest`,
    });

    if (
      !accessResponse ||
      !accessResponse.payload ||
      !accessResponse.payload.data
    ) {
      return null;
    }
    const responsePayload = accessResponse.payload.data.toString();

    return responsePayload;
  } catch (error) {
    return null;
  }
};

export { getSecret };
