import React, { useState, useEffect } from "react";
import styled from "styled-components";

import widgetSDK from "@happeo/widget-sdk";
import { WIDGET_SETTINGS } from "./constants";

import { TicketList } from "./TicketList";
import { SubmitTicket } from "./SubmitTicket";

const ZendeskWidget = ({ id, editMode }) => {
  const [initialized, setInitialized] = useState(false);
  const [widgetApi, setWidgetApi] = useState();
  const [settings, setSettings] = useState({ widgetType: "list" });

  useEffect(() => {
    const doInit = async () => {
      // Init API, use uniqueId for the initialisation as this widget may be present multiple times in a page
      const api = await widgetSDK.api.init(id);

      // After init, declare settings that are displayed to the user, add setSettings as the callback
      api.declareSettings(WIDGET_SETTINGS, setSettings);
      setWidgetApi(api);
      setInitialized(true);
    };
    doInit();
  }, [editMode, id]);

  if (!initialized) {
    // We don't want to show any loaders
    return null;
  }

  return (
    <Container>
      {settings.widgetType !== "submit" && <TicketList widgetApi={widgetApi} />}
      {settings.widgetType === "submit" && (
        <SubmitTicket widgetApi={widgetApi} editMode={editMode} />
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex: 1;
`;

export default ZendeskWidget;
