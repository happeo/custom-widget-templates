export const SETTINGS_KEYS = {
  location: "location",
  apiKey: "apiKey",
};

export const WIDGET_SETTINGS = [
  {
    placeholder: "Location",
    key: SETTINGS_KEYS.location,
    value: "Helsinki",
    type: "text",
  },
  {
    placeholder: "OpenWeather API key",
    key: SETTINGS_KEYS.apiKey,
    value: "",
    type: "text",
  },
];
