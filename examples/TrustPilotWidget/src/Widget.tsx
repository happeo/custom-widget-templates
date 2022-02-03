import React, {useEffect, useState} from "react";
import styled from "styled-components";
import widgetSDK from "@happeo/widget-sdk";
import TrustPilot from "./TrustPilot";
import {padding300} from "@happeouikit/layout";
import {gray09} from "@happeouikit/colors";
import {WIDGET_SETTINGS} from "./constants";

interface Props {
    id: string;
}

interface WidgetAPI {
    setSettings: (settings: object) => Promise<void>;

    getSettings(): Promise<{ [key: string]: any }>;

    declareSettings(_: object, callback: Function): Promise<void>;
}

const Widget = ({id}: Props) => {
    const [initialized, setInitialized] = useState(false);
    const [settings, setSettings] = useState({
        businessUnitId: "",
        templateId: ""
    });

    useEffect(() => {
        const doInit = async () => {
            // Init API
            const api = (await widgetSDK.api.init(id)) as WidgetAPI;

            await api.declareSettings(WIDGET_SETTINGS, setSettings);

            setInitialized(true);
        };
        doInit();
    }, [id]);

    useEffect(() => {
        const script = document.createElement('script');

        script.async = true;
        script.src = "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js";
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, [id]);

    if (!initialized) {

        return (
            <>
                <h3>Loading ...</h3>
            </>
        );
    }

    return (
        <Container>
            <TrustPilot businessUnitId={settings.businessUnitId} templateId={settings.templateId}/>
        </Container>
    );
};

const Container = styled.div`
  padding: ${padding300};
  background-color: ${gray09};
`;

export default Widget;
