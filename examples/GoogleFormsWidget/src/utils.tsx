import { decode } from "html-entities";

export const decodeHtmlEntities = (data: string) => decode(data);

export const getGoogleId = (text: string) => {
  const results = text.match(/[-\w]{25,}/);
  return results && results[0];
};
