import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import debounce from "lodash.debounce";

import widgetSDK from "@happeo/widget-sdk";
import { Dropzone } from "@happeouikit/file-picker";
import { Loader } from "@happeouikit/loaders";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ResizableBox } from "react-resizable";
import { parseStringJSON, getImageSize, calculateAspectRatioFit } from "./utils";
import { WIDGET_SETTINGS, MAX_HEIGHT, MAX_WIDTH } from "./constants";

const ImageUploadWidget = ({ id, editMode }) => {
  const [initialized, setInitialized] = useState(false);
  const [widgetApi, setWidgetApi] = useState();
  const [image, setImage] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [settings, setSettings] = useState({});

  const handleChange = useCallback(
    async (files) => {
      widgetApi.uploadImage({
        files: Array.from(files),
        startUpload: (/*entry*/) => setLoading(true),
        updateUploadProgress: async (entry) => {
          if (!entry.uploading) {
            const initialSize = await getImageSize(entry, MAX_WIDTH, MAX_HEIGHT);
            const image = { ...entry, ...initialSize };
            widgetApi.setContent(JSON.stringify(image));
            setImage(image);
            setLoading(false);
          }
        },
        onUploadError: (/*id, error*/) => setError("Error uploading image"),
      });
    },
    [widgetApi, setImage]
  );

  useEffect(() => {
    const doInit = async () => {
      // Init API, use uniqueId for the initialisation as this widget may be present multiple times in a page
      const api = await widgetSDK.api.init(id);

      const widgetContent = await api.getContent();

      setImage(parseStringJSON(widgetContent, undefined));
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

  const url = image && image.uri;
  const justifyContent = settings.justifyContent || "flex-start";
  return (
    <Container>
      {error ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontWeight: "bold",
          }}
        >
          Something went wrong.
        </div>
      ) : editMode ? (
        loading ? (
          <Loader />
        ) : (
          <Dropzone
            onSelected={handleChange}
            inputProps={{
              multiple: false,
              accept: "image/png, image/jpeg",
            }}
          >
            <InnerDropzone
              name={"Upload image"}
              image={image}
              widgetApi={widgetApi}
              justifyContent={justifyContent}
            />
          </Dropzone>
        )
      ) : (
        <div style={{ display: "flex", flex: 1, justifyContent }}>
          <LazyLoadImage
            width={image && image.width ? Math.min(image.width, MAX_WIDTH) : 100}
            height={image && image.height ? Math.min(image.height, MAX_WIDTH) : 100}
            alt={url}
            effect="opacity"
            src={url}
          />
        </div>
      )}
    </Container>
  );
};

const InnerDropzone = ({ name, image, clickUpload, widgetApi, justifyContent }) => {
  const [currentSize, setCurrentSize] = useState();

  const handleResize = useCallback(
    (event, { size }) => {
      setCurrentSize(size);

      const debouncedSave = debounce(
        () => widgetApi.setContent(JSON.stringify({ ...image, ...size })),
        1000
      );
      debouncedSave();
    },
    [currentSize]
  );

  useEffect(() => {
    if (image && image.width && image.height)
      setCurrentSize({ width: image.width || 100, height: image.height || 100 });
  }, [image]);

  const url = image && image.uri;

  const maxAspectRatioSize =
    currentSize &&
    calculateAspectRatioFit(
      currentSize.width,
      currentSize.height,
      MAX_WIDTH,
      MAX_HEIGHT
    );

  const minAspectRatioSize =
    currentSize &&
    calculateAspectRatioFit(currentSize.width, currentSize.height, 100, 100);
  return (
    <div style={{ height: "100%" }}>
      {url ? (
        <ResizeContainer style={{ display: "flex", justifyContent }}>
          {currentSize && (
            <ResizableBox
              minConstraints={[
                Math.min(100, minAspectRatioSize.width),
                Math.min(100, minAspectRatioSize.height),
              ]}
              maxConstraints={[
                Math.min(MAX_WIDTH, maxAspectRatioSize.width),
                Math.min(MAX_HEIGHT, maxAspectRatioSize.height),
              ]}
              height={currentSize.height}
              width={currentSize.width}
              lockAspectRatio={true}
              onResize={handleResize}
            >
              <Image alt={name} src={url} onClick={clickUpload} />
            </ResizableBox>
          )}
        </ResizeContainer>
      ) : (
        <AddIconInitial type="button" onClick={clickUpload}>
          <Text>{"Upload image"}</Text>
        </AddIconInitial>
      )}
    </div>
  );
};

const ResizeContainer = styled.div`
  padding: 4px;
`;

const Container = styled.div`
  display: flex;
  height: auto;
  .react-resizable {
    position: relative;
    border: dashed 2px lightgrey;
  }
  .react-resizable-handle {
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: 0;
    right: 0;
    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+");
    background-position: bottom right;
    padding: 0 3px 3px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: se-resize;
  }
`;

const AddIconInitial = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  margin: 0;
  padding: 0;
  overflow: visible;
  color: inherit;
  font: inherit;
  background-color: #fff;
  cursor: pointer;
  :hover {
    background-color: #fff;
  }
`;

const Image = styled.img`
  cursor: pointer;
  width: 100%;
  height: auto;
`;

const Text = styled.div`
  font-size: 16px;
  font-weight: lighter;
`;

export default ImageUploadWidget;
