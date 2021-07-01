import React, { useEffect } from "react";
import styled from "styled-components";
import widgetSDK from "@happeo/widget-sdk";

import { LinkExternal } from "@happeouikit/form-elements";
import { margin200, padding300 } from "@happeouikit/layout";
import { gray09 } from "@happeouikit/colors";
import { TextDelta, BodyUI } from "@happeouikit/typography";

const { happeo } = widgetSDK;

const Widget = ({ id, editMode }) => {
  useEffect(() => {
    const doInit = async () => {
      // Init API
      await happeo.init(id);

      // Do stuff
      await happeo.user.getCurrentUser();
      console.log("I am all good and ready to go!");
    };
    doInit();
  }, [editMode, id]);

  return (
    <Container>
      <TextDelta style={{ marginBottom: margin200 }}>
        Happeo custom widget
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
