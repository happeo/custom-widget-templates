import React from "react";
import useScript from "./useScript";

const BUNDLE_CDN = "https://cdn.kustomerapp.com/chat-web/widget.js";

const ChatBot = ({ brandId, apiKey }) => {
  const status = useScript({
    src: BUNDLE_CDN,
    apiKey,
  });

  React.useEffect(() => {
    if (window.Kustomer && status === "ready") {
      window.Kustomer.start({ brandId });
    }
  }, [brandId, status]);

  return null;
};

export default ChatBot;
