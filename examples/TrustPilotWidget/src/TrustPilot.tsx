import React from 'react';
import { alert } from "@happeouikit/colors";
import { TextZeta, BodyUI } from "@happeouikit/typography";
import { LinkExternal } from "@happeouikit/form-elements";

import styled from "styled-components";

const TrustBox = ({businessUnitId= "", templateId= ""}) => {
    // Create a reference to the <div> element which will represent the TrustBox
    const ref = React.useRef(null);
    React.useEffect(() => {
        // If window.Trustpilot is available it means that we need to load the TrustBox from our ref.
        // If it's not, it means the script you pasted into <head /> isn't loaded  just yet.
        // When it is, it will automatically load the TrustBox.
        if (window.Trustpilot) {
            window.Trustpilot.loadFromElement(ref.current, true);
        }
    }, [businessUnitId, templateId]);

    if(businessUnitId && templateId) {
        return (
            <div
                ref={ref} // We need a reference to this element to load the TrustBox in the effect.
                className="trustpilot-widget" // Renamed this to className.
                data-template-id={templateId}
                data-businessunit-id={businessUnitId}
                data-locale="en-GB"
                data-style-width="100%"
                data-style-height="100%"
                data-theme="light"
            >
                <a href="https://www.trustpilot.com/review/example.com" target="_blank" rel="noopener"> Trustpilot
                </a>
            </div>
        );
    }
    return (
        <div>
            <TextZeta>Trustpilot widget</TextZeta>
            <BodyUI>
                Please provide your business unit id and template id.
                Read more about{" "}
                <LinkExternal href="https://support.trustpilot.com/hc/en-us/articles/360035128794-Introduction-to-TrustBox-widgets">
                    Trustpilot Widgets
                </LinkExternal>
                .
            </BodyUI>
        </div>

    )





};
const Error = styled.div`
  color: ${alert};
`;
export default TrustBox;