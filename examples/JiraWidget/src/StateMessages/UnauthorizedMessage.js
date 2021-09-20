import React from "react";
import styled from "styled-components";
import { TextDelta, BodyUI } from "@happeouikit/typography";
import { ButtonPrimary } from "@happeouikit/buttons";
import { gray04, gray07 } from "@happeouikit/colors";
import { IconLock } from "@happeouikit/icons";
import { margin300, margin400 } from "@happeouikit/layout";
import { HELP_URL } from "../constants";

const UnauthorizedMessage = ({ authorize }) => {
  return (
    <Container>
      <TypeIcon>
        <IconLock />
      </TypeIcon>
      <StyledTextDelta>Jira integration is not authorized</StyledTextDelta>
      <StyledBodyUI>
        {
          "In order to use Jira integration, you need to authorize the Happeo Jira integration. Click button below to start authorization."
        }
        <a href={HELP_URL} target="_blank" rel="noopener noreferrer">
          Read more
        </a>
      </StyledBodyUI>
      <ButtonPrimary text={"Authorize Jira"} size="small" onClick={authorize} />
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

export default UnauthorizedMessage;
