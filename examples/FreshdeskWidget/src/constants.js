import { LOCALES } from "./locales";

export const SETTINGS_KEYS = {
  widgetId: "widget_id",
  locale: "locale",
  globalHelp: "show_global_help",
  localHelp: "show_button",
  buttonText: "button_text",
  prefillFields: "prefill_fields",
  disableFields: "disable_fields",
  hideFields: "hide_fields",
  hideChoiceFields: "hide_choice_fields",
};

export const WIDGET_SETTINGS = [
  {
    placeholder: "Freshdesk widget id",
    key: SETTINGS_KEYS.widgetId,
    value: "",
    type: "text",
  },
  {
    placeholder: "Locale",
    key: SETTINGS_KEYS.locale,
    value: "browser",
    options: [
      {
        label: "Browser language",
        value: "browser",
      },
      ...Object.keys(LOCALES).map((key) => ({
        label: LOCALES[key],
        value: key,
      })),
    ],
    type: "dropdown",
  },
  {
    placeholder: "Show launcher",
    key: SETTINGS_KEYS.globalHelp,
    value: "TRUE",
    type: "checkbox",
  },
  {
    placeholder: "Show button",
    key: SETTINGS_KEYS.localHelp,
    value: "TRUE",
    type: "checkbox",
  },
  {
    placeholder: "Button text",
    key: SETTINGS_KEYS.buttonText,
    value: "Open support",
    type: "text",
  },
  {
    placeholder: "Prefill fields (JSON)",
    key: SETTINGS_KEYS.prefillFields,
    value: JSON.stringify({
      subject: "Ticket from Happeo",
    }),
    type: "text",
  },
  {
    placeholder: "Disable fields (JSON Array)",
    key: SETTINGS_KEYS.disableFields,
    value: JSON.stringify(["subject"]),
    type: "text",
  },
  {
    placeholder: "Hide fields (JSON Array)",
    key: SETTINGS_KEYS.hideFields,
    value: JSON.stringify(["description"]),
    type: "text",
  },
  {
    placeholder: "Disable fields (JSON)",
    key: SETTINGS_KEYS.hideChoiceFields,
    value: "",
    type: "text",
  },
  {
    placeholder: "Freshdesk widget documentation",
    key: "myLink",
    value: "https://developers.freshdesk.com/widget-api",
    type: "help-link",
  },
];
