import React, { useEffect, useState } from "react";
import widgetSDK from "@happeo/widget-sdk";

const Widget = ({ id /*editMode*/ }) => {
  const [, /*widgetApi*/ setWidgetApi] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    const doInit = async () => {
      // Init API
      const widgetApi = await widgetSDK.api.init(id);

      // Do stuff
      const user = await widgetApi.getCurrentUser();
      setWidgetApi(widgetApi);
      setUser(user);
    };
    doInit();
  }, [id]);

  return (
    <div styled={{ padding: "16px", backgroundColor: "#F7F9FB" }}>
       
      <p style={{ fontSize: "14px", color: "#1A5D8D", marginBottom: "12px" }}>
        {user ? `Hi, ${user.name.fullName}!` : "initializing..."}
      </p>
      <h2
        style={{ fontSize: "20px", lineHeight: "28px", marginBottom: "12px" }}
      >
        Happeo custom widget
      </h2>
      <p>Useful resources</p>
      <ul
        style={{
          marginTop: "16px",
          listStyle: "disc",
          padding: "16px;",
          gap: "8px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <li>
          <p>
            <a
              target="_blank"
              rel="nofollow noopener"
              href="https://github.com/happeo/custom-widget-templates"
            >
              Custom widget templates
            </a>
          </p>
        </li>
        <li>
          <p>
            <a
              target="_blank"
              rel="nofollow noopener"
              href="https://github.com/happeo/widgets-sdk"
            >
              Widget SDK
            </a>
          </p>
        </li>
      </ul>
    </div>
  );
};

export default Widget;
