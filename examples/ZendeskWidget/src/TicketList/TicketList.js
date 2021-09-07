import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { active } from "@happeouikit/colors";
//import Tooltip from "@happeouikit/Tooltip";

import {
  ListStripedContainer,
  ListHeader,
  LiStriped,
  LiCol,
} from "@happeouikit/list";

import { getTickets } from "../actions";
import StatusBadge from "./StatusBadge";
import LoadingTickets from "./LoadingTickets";

const HEADERS = [
  {
    name: "Subject",
    field: "subject",
    width: "40%",
  },
  {
    name: "Requester",
    field: "requester_id",
    width: "30%",
  },
  {
    name: "Requested",
    field: "created_at",
    width: "30%",
  },
];

const TicketList = ({ widgetApi }) => {
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    let mounted = true;
    const get = async () => {
      setError(false);
      setLoading(true);
      try {
        const token = await widgetApi.getJWT();
        const tickets = await getTickets(token);
        if (mounted) setTickets(tickets);
      } catch (error) {
        if (mounted) setError(true);
      }
      setLoading(false);
    };

    if (widgetApi) get();
    return () => {
      mounted = false;
    };
  }, [widgetApi]);

  if (error) {
    return <div>Something went wrong</div>;
  }

  return (
    <ListStripedContainer style={{ flex: 1 }}>
      {loading ? (
        <LoadingTickets />
      ) : (
        <>
          <ListHeader headers={HEADERS} sortDir="asc" />
          {tickets.map((ticket) => {
            const { id, status, url, subject, requester, created_at } = ticket;

            const timestamp = new Date(created_at).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            return (
              <LiStriped key={id}>
                <LiCol width="40%">
                  <StatusBadge status={status} />
                  <StyledLink
                    aria-label={subject}
                    role="button"
                    onClick={() => window.open(url, "_blank").focus()}
                  >
                    <LongText data-for={id} data-tip>
                      {subject}
                    </LongText>
                  </StyledLink>
                </LiCol>
                <LiCol width="30%">{requester.user.email}</LiCol>

                <LiCol width="30%">{timestamp}</LiCol>
              </LiStriped>
            );
          })}
        </>
      )}
    </ListStripedContainer>
  );
};

const LongText = styled.div`
  min-width: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 200px;
`;

const StyledLink = styled.div`
  cursor: pointer;
  width: 100%;
  text-align: left;
  :hover p {
    color: ${active};
    text-decoration: underline;
  }
`;

export default TicketList;
