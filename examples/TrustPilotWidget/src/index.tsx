import React from "react";
import ReactDOM from "react-dom";
import Widget from "./Widget";

class happeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    const uniqueId = this.getAttribute("uniqueId") || "";
    ReactDOM.render(<Widget id={uniqueId} />, this);
  }
}

const slug = "trustpilot-widget-fphcbwvjoygeifpvmnhc-ac";

window.customElements.get(slug) ||
  window.customElements.define(slug, happeoCustomReactWidget);
