import React, { useEffect, useState } from "react";
import styled from "styled-components";
import widgetSDK from "@happeo/widget-sdk";
import Mermaid from "./Mermaid";
import example from "./example";

import { LinkExternal } from "@happeouikit/form-elements";
import { margin200, padding300 } from "@happeouikit/layout";
import { navy, gray09 } from "@happeouikit/colors";
import { TextDelta, BodyUI } from "@happeouikit/typography";

const Widget = ({ id, editMode }) => {
  const [widgetApi, setWidgetApi] = useState();
  const [user, setUser] = useState();

  const [settings, setSettings] = useState({
    content: "",
  });

  useEffect(() => {
    const doInit = async () => {
      // Init API
      const widgetApi = await widgetSDK.api.init(id);

      // Do stuff
      const user = await widgetApi.getCurrentUser();
      await widgetApi.declareSettings({}, setSettings);
      setWidgetApi(widgetApi);
      setUser(user);
    };
    doInit();
  }, [id]);

  const onChangeHandler = (event) => {
    const newSettings = { content: event.target.value };
    setSettings(newSettings);
    widgetApi.setSettings(newSettings);
  };

  return (
    <Container className="App">
      {editMode && (
        <div>
          <textarea
            style={{ height: "400px" }}
            value={settings.content}
            onChange={onChangeHandler}
          >
            {settings.content}
          </textarea>
        </div>
      )}
      <Mermaid key={settings.content} chart={settings.content} />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

export default Widget;
