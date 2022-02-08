export const SETTINGS_KEYS = {
    businessUnitId: "businessUnitId",
    templateId: "templateId",
    businessUnitIdLink: "businessUnitIdLink",
    trustpilotWidgetLink: "trustpilotWidgetLink",
};

export const WIDGET_SETTINGS = [
    {
        placeholder: "Business Unit Id",
        key: SETTINGS_KEYS.businessUnitId,
        value: "",
        type: "text",
    },
    {
        placeholder: "Template Id",
        key: SETTINGS_KEYS.templateId,
        value: "",
        type: "text",
    },
    {
        placeholder: "Read more about business unit id",
        key: "businessUnitIdLink",
        value: "https://documentation-apidocumentation.trustpilot.com/faq#q2",
        type: "help-link",
    },
    {
        placeholder: "Read more about Trustpilot widgets",
        key: "trustpilotWidgetLink",
        value: "https://support.trustpilot.com/hc/en-us/articles/360035128794-Introduction-to-TrustBox-widgets",
        type: "help-link",
    }
];