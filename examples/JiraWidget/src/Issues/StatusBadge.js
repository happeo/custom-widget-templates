import React from "react";
import styled from "styled-components";
import { Tooltip } from "@happeouikit/tooltip";
import { Badge } from "@happeouikit/form-elements";
import { gray04, gray07, success } from "@happeouikit/colors";
import { BodyUI } from "@happeouikit/typography";

const StatusBadge = ({ item, key }) => {
  if (!item) return null;

  const getColor = (color) => {
    if (!color) {
      return gray07;
    }
    if (color.includes("green")) {
      return success;
    }
    if (color.includes("-")) {
      return color.split("-")[1];
    }
    return color;
  };

  return (
    <Badge
      text={item.name}
      color={getColor(item.statusCategory?.colorName)}
      applyCustomStylings={(text) => (
        <BodyUI
          style={{
            color: gray04,
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </BodyUI>
      )}
    />
  );
};

export default StatusBadge;
