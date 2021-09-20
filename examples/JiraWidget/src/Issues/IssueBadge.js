import React from "react";
import styled from "styled-components";
import { Tooltip } from "@happeouikit/tooltip";

const IssueBadge = ({ item, key }) => {
  if (!item) return null;

  const altText = `${item.name}${
    item.description ? ` - ${item.description}` : ""
  }`;

  return (
    <>
      <TypeImage
        src={item.iconUrl}
        data-tip={altText}
        data-for={`${key}_${item.name}`}
        alt={item.name}
      />
      <Tooltip id={`${key}_${item.name}`} />
    </>
  );
};

const TypeImage = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;
export default IssueBadge;
