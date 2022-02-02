import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import widgetSDK from "@happeo/widget-sdk";
import { IconHelp } from "@happeouikit/icons";
import { padding300 } from "@happeouikit/layout";
import { ButtonPrimary } from "@happeouikit/buttons";
import { gray09 } from "@happeouikit/colors";
import { TextZeta, BodyUI } from "@happeouikit/typography";
import { SETTINGS_KEYS, WIDGET_SETTINGS } from "./constants";
import { applySettings, loadScript, validateJSON } from "./utils";

const FreshdeskWidget = ({ id, editMode }) => {
  const [initialized, setInitialized] = useState(false);
  const [settings, setSettings] = useState({});
  const [user, setUser] = useState({});
  const requiresMount = useRef(false);

  useEffect(() => {
    const doInit = async () => {
      // Init API, use uniqueId for the initialisation as this widget may be present multiple times in a page
      const api = await widgetSDK.api.init(id);

      // After init, declare settings that are displayed to the user, add setSettings as the callback
      api.declareSettings(WIDGET_SETTINGS, setSettings);

      const user = await api.getCurrentUser();
      setUser(user);
      setWidgetApi(api);
      setInitialized(true);
    };
    doInit();
  }, [editMode, id]);

  useEffect(() => {
    if (!Object.keys(settings).length || !Object.keys(user).length) {
      return;
    }

    window.fwSettings = {
      widget_id: settings[SETTINGS_KEYS.widgetId],
      locale:
        settings[SETTINGS_KEYS.locale] !== "browser" &&
        settings[SETTINGS_KEYS.locale],
    };

    loadScript(settings[SETTINGS_KEYS.widgetId]).then(
      applySettings(0, () => {
        // Mount if necessary, if not checked this will crash
        if (requiresMount.current) {
          window.FreshworksWidget("boot");
        }

        // Apply identity
        window.FreshworksWidget("identify", "ticketForm", {
          name: user.name?.fullName,
          email: user.primaryEmail,
        });

        // Set launcher visibility
        if (settings[SETTINGS_KEYS.globalHelp] === "FALSE") {
          window.FreshworksWidget("hide", "launcher");
        } else {
          window.FreshworksWidget("show", "launcher");
        }

        // Apply prefilled data
        const prefillJson = validateJSON(settings[SETTINGS_KEYS.prefillFields]);
        if (prefillJson) {
          window.FreshworksWidget("prefill", "ticketForm", prefillJson);
        }

        // Apply disabled data
        const disableJson = validateJSON(settings[SETTINGS_KEYS.disableFields]);
        if (disableJson) {
          window.FreshworksWidget("disable", "ticketForm", disableJson);
        }

        // Apply hide data
        const hideJson = validateJSON(settings[SETTINGS_KEYS.hideFields]);
        if (hideJson) {
          window.FreshworksWidget("hide", "ticketForm", hideJson);
        }

        // Apply disabled choice data
        const disableChoiceJson = validateJSON(
          settings[SETTINGS_KEYS.hideChoiceFields],
        );
        if (disableChoiceJson) {
          window.FreshworksWidget("hideChoices", "ticketForm", disableJson);
        }
      }),
    );

    return () => {
      // When this unmounts, destroy and set requiresMount to true
      window.FreshworksWidget("destroy");
      requiresMount.current = true;
    };
  }, [settings, user]);

  if (!initialized) {
    // We don't want to show any loaders
    return null;
  }

  return (
    <Container>
      {editMode && settings[SETTINGS_KEYS.localHelp] !== "TRUE" && (
        <EditContainer>
          <TextZeta>Zendesk widget</TextZeta>
          <BodyUI>
            Click to configure. This message will disappear when exiting page
            edit -mode.
          </BodyUI>
        </EditContainer>
      )}
      {settings[SETTINGS_KEYS.localHelp] === "TRUE" && (
        <ButtonPrimary
          icon={IconHelp}
          text={settings[SETTINGS_KEYS.buttonText]}
          onClick={() => {
            window.FreshworksWidget("open", "ticketForm");
          }}
        />
      )}
    </Container>
  );
};

const Container = styled.div``;
const EditContainer = styled.div`
  padding: ${padding300};
  background-color: ${gray09};
`;

export default FreshdeskWidget;
