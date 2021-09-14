import React from "react";
import ZendeskWidget from "./ZendeskWidget";

class happeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    const uniqueId = this.getAttribute("uniqueId") || "";
    const mode = this.getAttribute("mode") || "";

    ReactDOM.render(
      <ZendeskWidget id={uniqueId} editMode={mode === "edit"} />,
      this
    );
  }
}

const slug = "add-your-slug-here";

window.customElements.get(slug) ||
  window.customElements.define(slug, happeoCustomReactWidget);
