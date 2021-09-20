import React from "react";
import { FilterMenu } from "@happeouikit/menus";
import { IconFilter } from "@happeouikit/icons";
import { Tooltip } from "@happeouikit/tooltip";
import { AVAILABLE_COLUMNS } from "../constants";

const ColumnsFilter = ({ onChangeFilter, selectedColumns }) => {
  return (
    <Wrapper data-for="columns-filter" data-tip="Filter columns">
      <FilterMenu
        aria-label="Filter columns"
        actions={AVAILABLE_COLUMNS.map((item) => ({
          ...item,
          name: item.label,
          type: item.field,
          callback: onChangeFilter,
        }))}
        icon={IconFilter}
        selected={selectedColumns}
      />
      <Tooltip id="columns-filter" />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  // Fix selected indicator width
  > div > span {
    width: auto;
  }
`;

export default ColumnsFilter;
