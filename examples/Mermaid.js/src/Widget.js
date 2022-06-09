import React, { useEffect, useState } from "react";
import styled from "styled-components";
import widgetSDK from "@happeo/widget-sdk";
import Mermaid from "./Mermaid";
import example from "./example";

import { LinkExternal } from "@happeouikit/form-elements";
import { margin200, padding300 } from "@happeouikit/layout";
import { navy, gray09 } from "@happeouikit/colors";
import { TextDelta, BodyUI } from "@happeouikit/typography";

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

  const [mermaid, setMermaid] = useState("");

  const onChangeHandler = (event) => {
    setMermaid(event.target.value);
  };

  return (
    <div className="App">
      <textarea style={{ height: "400px" }} onChange={onChangeHandler}>
        {mermaid}
      </textarea>
      <h1>React Mermaid Example</h1>
      <pre>{mermaid}</pre>
      <Mermaid key={mermaid} chart={mermaid} />
    </div>
  );
};

const Container = styled.div`
  padding: ${padding300};
  background-color: ${gray09};
`;
const StyledUl = styled.ul`
  list-style: disc;
  padding: ${padding300};
`;

export default Widget;
