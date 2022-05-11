import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import widgetSDK from "@happeo/widget-sdk";
import { ButtonPrimary, ButtonSecondary } from "@happeouikit/buttons";
import { gray01, gray09 } from "@happeouikit/colors";
import { Input } from "@happeouikit/form-elements";
import { Loader } from "@happeouikit/loaders";
import { TextDelta } from "@happeouikit/typography";

import { WIDGET_SETTINGS } from "./constants";
import { getGoogleId, decodeHtmlEntities } from "./utils";
import Logo from "./components/Logo";
import Navigation from "./components/Navigation";
import type { default as WidgetApi } from "@happeo/widget-sdk/dist/api";

const GOOGLE_FORM_BASE_URL = "https://docs.google.com/forms/d/e";

interface Settings {
  formInput: string;
  formId: string;
  embed?: boolean;
  title?: string;
  thumbnail?: { url: string };
}

interface Props {
  id: string;
  editMode: boolean;
  location: string;
  trigger?: string;
}

const GoogleFormsWidget = ({ id, editMode, trigger }: Props) => {
  const [initialized, setInitialized] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    formInput: "",
    formId: "",
  });
  const [widgetApi, setWidgetApi] = useState<WidgetApi>();
  const [isValid, setIsValid] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(false);

  const acceptSettings = useCallback(
    () => widgetApi!.setSettings(settings!),
    [widgetApi, settings],
  );

  const onInputChanged = useCallback(
    (text) => {
      const valid = !!getGoogleId(text);
      setIsValid(valid);

      setSettings((prev) => {
        if (valid) debounceFn(text, widgetApi, { ...prev, formInput: text });
        return { ...prev, formInput: text };
      });
      setIsDirty(true);
    },
    [widgetApi],
  );

  const scrapeDebounce = async (text, api, settings) => {
    const formId = getGoogleId(text);
    const language = "en";
    const url = `${GOOGLE_FORM_BASE_URL}/${formId}/viewform?usp=sf_link&hl=${language}`;
    setLoading(true);
    const { data } = await api.metaScaperExtract(url);

    setLoading(false);

    const newSettings = {
      ...settings,
      formId,
      title: data?.data?.title || "",
      description: data?.data?.title || "",
      url,
      thumbnail: {
        url: data.data.image,
      },
    };
    setSettings(newSettings);

    if (trigger) {
      api!.setSettings(newSettings);
    }
  };

  const debounceFn = useCallback(
    debounce(
      (value, api, settings) => scrapeDebounce(value, api, settings),
      200,
    ),
    [],
  );

  useEffect(() => {
    const doInit = async () => {
      // Init API, use uniqueId for the initialisation as this widget may be present multiple times in a page
      const api = await widgetSDK.api.init(id);

      // After init, declare settings that are displayed to the user, add setSettings as the callback
      await api.declareSettings(WIDGET_SETTINGS, setSettings);
      setWidgetApi(api as WidgetApi);

      setInitialized(true);
    };
    doInit();
  }, [editMode, id]);

  useEffect(() => {
    if (trigger && initialized) onInputChanged(trigger);
  }, [trigger, initialized]);

  if (!initialized) {
    return (
      <Flex>
        <Loader size="medium" />
      </Flex>
    );
  }

  if (editMode) {
    return (
      <>
        <Flex style={{ height: "100%" }}>
          <ContainerLeft>
            <Flex style={{ flexDirection: "column" }}>
              <Logo />
              <TextDelta bold style={{ marginTop: "16px" }}>
                Google Forms
              </TextDelta>
            </Flex>
            {<Navigation />}
          </ContainerLeft>

          <ContainerRight>
            <Flex
              style={{
                flexDirection: "column",
                marginTop: "16px",
                width: "100%",
              }}
            >
              <TextDelta bold style={{ marginBottom: "24px" }}>
                Add Google forms by URL/Embed
              </TextDelta>

              <FormLabel htmlFor="form-input">
                Enter Google Forms url or embed string
              </FormLabel>
              <Input
                id="form-input"
                value={settings.formInput || ""}
                autoComplete="off"
                state={!isValid && "error"}
                errorMessage={!isValid && "Not valid Google Form input"}
                onChange={({
                  target: { value },
                }: React.ChangeEvent<HTMLInputElement>) => {
                  onInputChanged(value);
                }}
              />
              <Flex style={{ flex: 1 }}>
                <Flex
                  style={{
                    flexDirection: "column",
                    marginTop: "32px",
                    width: "100%",
                    height: "400px",
                    background: gray09,
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  {loading && <Loader />}
                  {!loading && isValid && settings.formId && (
                    <iframe
                      src={`${GOOGLE_FORM_BASE_URL}/${settings.formId}/viewform?embedded=true`}
                      width="100%"
                      height="600"
                      frameBorder="0"
                    >
                      Loading…
                    </iframe>
                  )}
                </Flex>
              </Flex>
              <Flex
                style={{
                  justifyContent: "flex-end",
                  marginTop: "16px",
                }}
              >
                <ButtonPrimary
                  disabled={!isDirty || !isValid || loading}
                  onClick={acceptSettings}
                  text="Add to post"
                />
              </Flex>
            </Flex>
          </ContainerRight>
        </Flex>
      </>
    );
  }

  if (!settings.formId) {
    return (
      <Flex style={{ alignItems: "center", height: "100%" }}>
        <Loader size="medium" />
      </Flex>
    );
  }

  return (
    <Flex
      style={{
        alignItems: "center",
        height: "100%",
      }}
    >
      <iframe
        width="100%"
        height={!settings.embed ? "100%" : 315}
        src={`${GOOGLE_FORM_BASE_URL}/${settings.formId}/viewform?embedded=true`}
        frameBorder="0"
      ></iframe>
    </Flex>
  );
};

const ContainerLeft = styled.div`
  display: flex;
  padding: 24px 32px;
  flex: 2;
  background-color: ${gray09};
  border-radius: 6px 0 0 6px;
  height: 100%;
  min-width: 260px;
  flex-direction: column;
  @media (max-width: 768px) {
    display: none;
  }
`;

export const FormLabel = styled.label`
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 8px;
  display: block;
  color: ${gray01};
`;

const Flex = styled.div`
  display: flex;
`;

const ContainerRight = styled.div`
  display: flex;
  padding: 24px;
  flex: 7;
`;

export default GoogleFormsWidget;
