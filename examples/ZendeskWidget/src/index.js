import React from "react";
import ZendeskWidget from "./ZendeskWidget";

class happeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    const widgetId = this.getAttribute("widgetId") || "";
    const uniqueId = this.getAttribute("uniqueId") || "";
    const editMode = this.getAttribute("editMode") || "";
    ReactDOM.render(
      <ZendeskWidget
        id={uniqueId}
        widgetId={widgetId}
        editMode={editMode === "true"}
      />,
      this
    );
  }
}

const slug = "zendesk-poc-vn8cvdsypdpztt5el25g";

window.customElements.get(slug) ||
  window.customElements.define(slug, happeoCustomReactWidget);
