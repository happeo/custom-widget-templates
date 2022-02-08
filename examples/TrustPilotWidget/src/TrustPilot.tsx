import React from 'react';

const TrustBox = ({businessUnitId= "5ddd3f26dcc430000159acff", templateId= "5419b6a8b0d04a076446a9ad"}) => {
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

    return (
        <div
            ref={ref} // We need a reference to this element to load the TrustBox in the effect.
            className="trustpilot-widget" // Renamed this to className.
            // carrousel template
            // data-template-id="53aa8912dec7e10d38f59f36"
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
};
export default TrustBox;