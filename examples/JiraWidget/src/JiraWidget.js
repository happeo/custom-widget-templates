import React, { useState, useEffect } from "react";
import styled from "styled-components";
import widgetSDK from "@happeo/widget-sdk";

import { BASE_URL, POPUP_PARAMS, WIDGET_SETTINGS } from "./constants";
import { IssueList, LoadingIssues } from "./Issues";
import { UnauthorizedMessage } from "./StateMessages";

const JiraWidget = ({ id, editMode, query, location }) => {
  const [initialized, setInitialized] = useState(false);
  const [widgetApi, setWidgetApi] = useState();
  const [unauthorized, setUnauthorized] = useState(false);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const doInit = async () => {
      const api = await widgetSDK.api.init(id);
      setWidgetApi(api);
      setInitialized(true);
      api.declareSettings(WIDGET_SETTINGS, setSettings);
    };
    doInit();
  }, [editMode, id]);

  const retryAuthorization = () => {
    setUnauthorized(false);
    setInitialized(true);
  };

  useEffect(() => {
    if (!unauthorized) {
      return () => {
        window.removeEventListener("focus", retryAuthorization);
      };
    }
  }, [unauthorized]);

  const startAuthorization = async () => {
    const token = await widgetApi.getJWT();
    const url = `${BASE_URL}/oauth/begin?token=${token}&origin=${window.origin}`;
    const params = POPUP_PARAMS;
    const popup = window.open(url, "auth", params);
    window.addEventListener("focus", retryAuthorization);
    window._h = (status) => {
      popup.close();
      if (status === "success") {
        setUnauthorized(false);
        setInitialized(true);
      }
      window._h = null;
    };
  };

  if (unauthorized) {
    return (
      <Container>
        <UnauthorizedMessage authorize={startAuthorization} />
      </Container>
    );
  }

  if (!initialized || !Object.keys(settings).length === 0) {
    return (
      <Container>
        <LoadingIssues />
      </Container>
    );
  }

  return (
    <Container>
      <IssueList
        widgetApi={widgetApi}
        settings={settings}
        query={query}
        editMode={editMode}
        setUnauthorized={setUnauthorized}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex: 1;
  min-height: 100px;
`;

export default JiraWidget;
