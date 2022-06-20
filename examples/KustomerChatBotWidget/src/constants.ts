export const SETTINGS_KEYS = {
  apiKey: "apiKey",
  brandId: "brandId",
  helpLink: "helpLink",
};

export const WIDGET_SETTINGS = [
  {
    placeholder: "Kustomer Api Key",
    key: SETTINGS_KEYS.apiKey,
    value: "",
    type: "text",
  },
  {
    placeholder: "Brand Id",
    key: SETTINGS_KEYS.brandId,
    value: "",
    type: "text",
  },
  {
    placeholder: "Read more about configuring ChatBot",
    key: SETTINGS_KEYS.helpLink,
    value: "https://kustomer.kustomer.help/chat-sdk-SyRjnij0P",
    type: "help-link",
  },
];
