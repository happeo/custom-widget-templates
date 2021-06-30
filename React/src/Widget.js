import React, { useEffect } from "react";
import styled from "styled-components";
import widgetSDK from "@happeo/widget-sdk";

import { LinkExternal } from "@happeouikit/form-elements";
import { padding300 } from "@happeouikit/layout";
import { gray09 } from "@happeouikit/colors";

const { happeo } = widgetSDK;

const Widget = ({ id, editMode }) => {
  useEffect(() => {
    const doInit = async () => {
      // Init API
      await happeo.init(id);

      // Do stuff
    };
    doInit();
  }, [editMode, id]);

  return (
    <Container>
      <TextDelta>Happeo custom widget</TextDelta>
      <BodyUI>Useful resources</BodyUI>
      <ul>
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
      </ul>
    </Container>
  );
};

const Container = styled.div`
  padding: ${padding300};
  background-color: ${gray09};
`;

export default Widget;
