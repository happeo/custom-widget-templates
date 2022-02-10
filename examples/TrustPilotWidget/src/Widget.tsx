import React, {useEffect, useState} from "react";
import styled from "styled-components";
import widgetSDK from "@happeo/widget-sdk";
import { Loader } from "@happeouikit/loaders";
import TrustPilot from "./TrustPilot";
import { padding300 } from "@happeouikit/layout";
import { TextZeta, BodyUI } from "@happeouikit/typography";
import { LinkExternal } from "@happeouikit/form-elements";
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
                <Loader />
        );
    }

    if(!settings.businessUnitId || !settings.templateId) {
        return (
            <div >
                <TextZeta>Trustpilot widget</TextZeta>
                <BodyUI>
                    Please provide your business unit id and template id.
                </BodyUI>
                <BodyUI>
                    To find the Business Unit ID and Template ID, generate a Trustpilot widget as you usually
                    would and find the <b>data-template-id</b> and <b>data-businuessunit-id</b> in the HTML code, and enter them in the panel on the right.
                </BodyUI>
                <BodyUI>
                    Read more about{" "}
                    <LinkExternal href="https://support.trustpilot.com/hc/en-us/articles/360035128794-Introduction-to-TrustBox-widgets">
                        Trustpilot Widgets
                    </LinkExternal>
                    .
                </BodyUI>
            </div>
        )
    }

    return (
        <Container>
            <TrustPilot businessUnitId={settings.businessUnitId} templateId={settings.templateId}/>
        </Container>
    );
};

const Container = styled.div`
  padding: ${padding300};
`;

export default Widget;
