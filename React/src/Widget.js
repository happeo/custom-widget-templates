import React, { useState, useEffect } from "react";
import { init, getWidgetContext } from "@happeo/widget-sdk";

const Widget = ({ id, preview }) => {
  const [initialized, setInitialized] = useState(true);

  useEffect(() => {
    const doInit = async () => {
      await init(id);
      setInitialized(true);
    };
    doInit();
  }, [id]);

  return (
    <div>
      {preview && "Showing preview"}
      <div>{initialized ? "Loading..." : "ready"}</div>
    </div>
  );
};

export default Widget;
