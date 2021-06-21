import React from "react";
import ReactDOM from "react-dom";

import Widget from "./src/Widget";
class happeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement("span");
    this.attachShadow({ mode: "open" }).appendChild(mountPoint);

    const widgetId = this.getAttribute("widgetId");
    const preview = this.getAttribute("preview");

    ReactDOM.render(<Widget preview={preview} id={widgetId} />, mountPoint);
  }
}

window.customElements.define("happeo-custom-widget", happeoCustomReactWidget);
