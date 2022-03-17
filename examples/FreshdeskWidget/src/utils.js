const getElementId = (widgetId) => `#freshdesk-import-${widgetId}`;

export const loadScript = (widgetId, widgetUrl) =>
    new Promise(async (resolve, reject) => {
        const id = getElementId(widgetId);
        const el = document.getElementById(id);
        if (el) {
            return;
        }
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.id = id;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = () => {
            const errEl = document.getElementById(id);
            if (errEl) {
                errEl.parentNode.removeChild(errEl);
            }
            reject();
        };
        const euFreshDesk = widgetId && !widgetUrl;
        const comboFreshdeskAndUrl = widgetId && widgetUrl && widgetUrl.includes(widgetId);
        if (euFreshDesk) {
            script.src = `https://euc-widget.freshworks.com/widgets/${widgetId}.js`;
        }
        if(comboFreshdeskAndUrl) {
            script.src = widgetUrl;
        }
        if(script.src){
            document.getElementsByTagName("head")[0].appendChild(script);
        } else {
            // if src is not set reject for cleanup in the parent
            const errEl = document.getElementById(id);
            if (errEl) {
                errEl.parentNode.removeChild(errEl);
            }
            reject();
        }
    });

export const validateJSON = (json = "") => {
    try {
        return JSON.parse(json);
    } catch (error) {
        return null;
    }
};

export const applySettings = (count = 0, fn) => {
    if (count > 10) {
        return;
    }
    if (!window.FreshworksWidget) {
        return setTimeout(() => applySettings(count++, fn), 50);
    }

    fn();
};
