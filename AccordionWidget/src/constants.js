import { gray08, gray09 } from "@happeouikit/colors";

export const SETTINGS_KEYS = {
  headerBackgroundColor: "headerBackgroundColor",
  contentBackgroundColor: "contentBackgroundColor",
};

export const WIDGET_SETTINGS = [
  {
    placeholder: "Header background color",
    key: SETTINGS_KEYS.headerBackgroundColor,
    value: gray08,
    type: "color",
  },
  {
    placeholder: "Content background color",
    key: SETTINGS_KEYS.contentBackgroundColor,
    value: gray09,
    type: "color",
  },
];
