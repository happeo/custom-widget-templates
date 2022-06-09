import React from "react";
import Widget from "./Widget";

class happeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    const uniqueId = this.getAttribute("uniqueId") || "";
    const mode = this.getAttribute("mode") || "";
    ReactDOM.render(<Widget id={uniqueId} editMode={mode === "edit"} />, this);
  }
}
const slug = "mermaidjs-widget-awtqlassnaw2ctox6rfj";

window.customElements.get(slug) ||
  window.customElements.define(slug, happeoCustomReactWidget);
