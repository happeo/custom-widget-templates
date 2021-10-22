import React from "react";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";

const STATUSES = {
  new: {
    text: "New",
    abbr: "N",
    backgroundColor: "rgb(255, 182, 72)",
    color: "rgb(112, 59, 21)",
  },
  open: {
    text: "Open",
    abbr: "O",
    backgroundColor: "rgb(227, 79, 50)",
    color: "#fff",
  },
  pending: {
    text: "Pending",
    abbr: "P",
    backgroundColor: "rgb(48, 145, 236)",
    color: "#fff",
  },
  solved: {
    text: "Solved",
    abbr: "S",
    backgroundColor: "rgb(135, 146, 157)",
    color: "#fff",
  },
};

const StateBadge = ({ status }) => {
  const statusStyle = STATUSES[status];
  if (!statusStyle) return null;

  return (
    <div>
      <StatusBadge data-for={status} data-tip style={{ ...statusStyle }}>
        {statusStyle.abbr}
      </StatusBadge>
      <ReactTooltip id={status} place="bottom">
        {statusStyle.text}
      </ReactTooltip>
    </div>
  );
};

const StatusBadge = styled.div`
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  margin-right: 8px;
  padding: 2px 5px 3px 5px;
`;
export default StateBadge;
