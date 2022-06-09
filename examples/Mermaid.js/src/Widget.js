import React, { useEffect, useState } from "react";
import styled from "styled-components";
import widgetSDK from "@happeo/widget-sdk";

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

  return (
    <Container>
      <BodyUI style={{ color: navy, marginBottom: margin200 }}>
        {user ? `Hi, ${user.name.fullName}!` : "initializing..."}
      </BodyUI>

      <TextDelta style={{ marginBottom: margin200 }}>
        MermaidJs custom widget
      </TextDelta>

      <BodyUI>Useful resources</BodyUI>
      <StyledUl>
        <li>
          <BodyUI>
            <LinkExternal href="https://github.com/happeo/custom-widget-templates">
              Custom widget templates
            </LinkExternal>
          </BodyUI>
        </li>
        <li>
          <BodyUI>
            <LinkExternal href="https://github.com/happeo/widgets-sdk">
              Widget SDK
            </LinkExternal>
          </BodyUI>
        </li>
        <li>
          <BodyUI>
            <LinkExternal href="https://uikit.happeo.com/">
              Happeo UI kit
            </LinkExternal>
          </BodyUI>
        </li>
      </StyledUl>
    </Container>
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
