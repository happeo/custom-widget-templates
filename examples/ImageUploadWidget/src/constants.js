export const MAX_WIDTH = 900;
export const MAX_HEIGHT = 900;

export const SETTINGS_KEYS = {
  justifyContent: "justifyContent",
};

export const WIDGET_SETTINGS = [
  {
    placeholder: "Align",
    key: SETTINGS_KEYS.justifyContent,
    value: "flex-start",
    options: [
      {
        label: "Start",
        value: "flex-start",
      },
      {
        label: "Center",
        value: "center",
      },
      {
        label: "End",
        value: "flex-end",
      },
    ],
    type: "dropdown",
  },
];
