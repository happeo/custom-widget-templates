export const SETTINGS_KEYS = {
  widgetType: "widgetType",
};

export const WIDGET_SETTINGS = [
  {
    placeholder: "Zendesk widget type",
    key: SETTINGS_KEYS.widgetType,
    value: "list",
    options: [
      {
        label: "List tickets",
        value: "list",
      },
      {
        label: "Submit tickets",
        value: "submit",
      },
      {
        label: "Article view",
        value: "article",
      },
      {
        label: "Help Center",
        value: "helpCenter",
      },
    ],
    type: "dropdown",
  },
];
