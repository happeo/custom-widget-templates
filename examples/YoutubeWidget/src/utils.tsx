import { decode } from "html-entities";

export const decodeHtmlEntities = (data: string) => decode(data);

export const validateUrl = (url) => {
  const results = url.match("v=([a-zA-Z0-9]+)&?");
  const videoId = results && results[1];
  return videoId.length > 0;
};

export const getVideoId = (url) => {
  var p =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if (url.match(p)) {
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    }
  }
};
