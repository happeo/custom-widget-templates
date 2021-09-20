import React from "react";
import styled from "styled-components";
import { TextDelta, BodyUI } from "@happeouikit/typography";
import { gray04, gray07, gray09 } from "@happeouikit/colors";
import { IconTrendingDown } from "@happeouikit/icons";
import { padding200, margin300, margin400 } from "@happeouikit/layout";

const ErrorMessage = ({ error }) => {
  return (
    <Container>
      <TypeIcon>
        <IconTrendingDown />
      </TypeIcon>
      <StyledTextDelta>Something is wrong</StyledTextDelta>
      <StyledBodyUI>
        We received an error from the server. Details below.
      </StyledBodyUI>
      <pre style={{ backgroundColor: gray09, padding: padding200 }}>
        <code style={{ whiteSpace: "pre-wrap" }}>{error}</code>
      </pre>
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
  margin-bottom: 16px;
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

export default ErrorMessage;
