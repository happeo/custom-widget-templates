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
import { getVideoId, decodeHtmlEntities } from "./utils";
import Logo from "./components/Logo";
import Navigation from "./components/Navigation";
import type { default as WidgetApi } from "@happeo/widget-sdk/dist/api";

interface Settings {
  videoUrl: string;
  videoId: string;
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

const YoutubeWidget = ({ id, editMode, trigger }: Props) => {
  const [initialized, setInitialized] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    videoUrl: "",
    videoId: "",
  });
  const [widgetApi, setWidgetApi] = useState<WidgetApi>();
  const [isValid, setIsValid] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(false);

  const acceptSettings = useCallback(
    () => widgetApi!.setSettings(settings!),
    [widgetApi, settings],
  );

  const onUrlChanged = useCallback(
    (url) => {
      const valid = !!getVideoId(url);

      setIsValid(valid);

      setSettings((prev) => {
        if (valid) debounceFn(url, widgetApi, { ...prev, videoUrl: url });
        return { ...prev, videoUrl: url };
      });
      setIsDirty(true);
    },
    [widgetApi],
  );

  useEffect(() => {
    if (trigger) onUrlChanged(trigger);
  }, [trigger]);

  const scrapeDebounce = async (url, api, settings) => {
    const decodedUrl = decodeHtmlEntities(url).replace(/\\/gi, "");

    setLoading(true);
    const { data } = await api.metaScaperExtract(decodedUrl);
    const videoId = getVideoId(decodedUrl);
    setLoading(false);
    setSettings({
      ...settings,
      videoId,
      title: data?.data?.title || "",
      description: data?.data?.description || "",
      url: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail: {
        url: data.data.image,
      },
    });
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
                Youtube
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
                Add Youtube video by URL
              </TextDelta>

              <FormLabel htmlFor="youtube-url-url">Enter url</FormLabel>
              <Input
                id="youtube-url-input"
                value={settings.videoUrl}
                autoComplete="off"
                state={!isValid && "error"}
                errorMessage={!isValid && "URL not valid Youtube url."}
                onChange={({
                  target: { value },
                }: React.ChangeEvent<HTMLInputElement>) => {
                  onUrlChanged(value);
                }}
              />
              <Flex style={{ flex: 1 }}>
                <Flex
                  style={{
                    flexDirection: "column",
                    marginTop: "32px",
                    width: "100%",
                    minHeight: "315px",
                    background: gray09,
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  {loading && <Loader />}
                  {!loading && isValid && settings.videoId && (
                    <iframe
                      height="100%"
                      src={`https://www.youtube.com/embed/${settings.videoId}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
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

  if (!settings.videoId) {
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
        backgroundColor: "#181818",
      }}
    >
      <iframe
        width="100%"
        height={!settings.embed ? 562.5 : 315}
        src={`https://www.youtube.com/embed/${settings.videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
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

export default YoutubeWidget;
