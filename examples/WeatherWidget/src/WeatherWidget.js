import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import widgetSDK from "@happeo/widget-sdk";
import { WIDGET_SETTINGS } from "./constants";
import debounce from "lodash.debounce";
import { shadowGray06 } from "@happeouikit/colors";
import { radius500 } from "@happeouikit/theme";
import Skeleton from "react-loading-skeleton";

const WeatherWidget = ({ id, editMode }) => {
  const [initialized, setInitialized] = useState(false);
  const [settings, setSettings] = useState({
    location: "kokkola",
    apiKey: "c4f55855bfd7e7dc4ffa53bd2cc65ab2",
  });
  const [widgetApi, setWidgetApi] = useState();
  const [weatherData, setWeatherData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const get = async () => {
      setError(false);
      setLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${settings.location}&appid=${settings.apiKey}&units=metric`
      );
      const data = await response.json();
      if (response.ok) {
        setWeatherData(data);
        setLoading(false);
      } else {
        const error = new Error(
          `HTTP ${response.status} ${response.statusText}: ${JSON.stringify(
            data
          )}`
        );

        if (!editMode) {
          widgetApi.reportError(error);
        }
        setError(true);
        setLoading(false);
      }
    };
    if (widgetApi && settings.location && settings.apiKey) get();
  }, [settings, widgetApi, editMode]);

  const settingsChanged = useCallback(debounce(setSettings, 1000), []);

  useEffect(() => {
    const doInit = async () => {
      // Init API, use uniqueId for the initialisation as this widget may be present multiple times in a page
      const api = await widgetSDK.api.init(id);

      // After init, declare settings that are displayed to the user, add setSettings as the callback
      api.declareSettings(WIDGET_SETTINGS, settingsChanged);
      setWidgetApi(api);
      setInitialized(true);
    };
    doInit();
  }, [editMode, id]);

  if (!initialized) {
    // We don't want to show any loaders
    return null;
  }

  const weather = weatherData && weatherData.weather[0];
  const temperature = weatherData && weatherData.main.temp;
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
          <div
            style={{
              marginTop: "4px",
              fontWeight: "normal",
            }}
          >
            Please check your location or API key.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flex: 1 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 2,
              justifyContent: "center",
            }}
          >
            <Location>
              {loading ? <Skeleton width="80%" /> : settings.location}
            </Location>
            <Temperature>
              {loading ? (
                <Skeleton width="50%" />
              ) : (
                `${Math.round(temperature)}°C`
              )}
            </Temperature>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
            }}
          >
            {loading ? (
              <Skeleton circle={true} width="60px" height="60px" />
            ) : (
              <img
                src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                width="100px"
                height="100px"
                alt={weather.main}
              />
            )}
          </div>
        </div>
      )}
    </Container>
  );
};

const Location = styled.div`
  font-size: 24px;
  font-weight: lighter;
`;

const Temperature = styled.div`
  font-size: 48px;
  font-weight: lighter;
`;

const Container = styled.div`
  display: flex;
  width: 300px;
  min-height: 148px;
  max-width: 100%;
  box-shadow: 0 2px 8px 0 ${shadowGray06};
  border-radius: ${radius500};
  padding: 24px;
`;

export default WeatherWidget;
