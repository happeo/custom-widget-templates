import React from "react";
import styled from "styled-components";
import { TextDelta, BodyUI } from "@happeouikit/typography";
import { gray04, gray07 } from "@happeouikit/colors";
import { IconSettings } from "@happeouikit/icons";
import { margin300, margin400 } from "@happeouikit/layout";

const SetupMessage = ({ editMode }) => {
  return (
    <Container>
      <TypeIcon>
        <IconSettings />
      </TypeIcon>
      <StyledTextDelta>Jira widget</StyledTextDelta>
      <StyledBodyUI>
        {editMode
          ? "Configure Jira widget from the right side panel."
          : "This widget needs to be configured. Please open pages edit mode to continue."}
      </StyledBodyUI>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 550px;
  margin: auto;
`;

const StyledTextDelta = styled(TextDelta)`
  margin: ${margin400} 0 ${margin300} 0;
  text-align: center;
`;

const StyledBodyUI = styled(BodyUI)`
  margin-bottom: 34px;
  text-align: center;
  color: ${gray04};
`;

const TypeIcon = styled.div`
  display: inherit;

  svg {
    fill: ${gray07};
    width: 72px;
    height: 72px;
  }
`;

export default SetupMessage;
