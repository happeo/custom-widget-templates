import React from "react";
import styled from "styled-components";

const Navigation = () => {
  return (
    <Flex style={{ flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <Flex
        style={{ flexDirection: "column", overflow: "hidden", flex: 1 }}
      ></Flex>
      <Flex></Flex>
    </Flex>
  );
};

const Flex = styled.div`
  display: flex;
`;

export default Navigation;
