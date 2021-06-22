import React from "react";
import ReactDOM from "react-dom";

import Widget from "./Widget";

class happeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement("span");
    this.attachShadow({ mode: "open" }).appendChild(mountPoint);

    const widgetId = this.getAttribute("widgetId") || "";
    const preview = Boolean(this.getAttribute("preview"));

    ReactDOM.render(<Widget preview={preview} id={widgetId} />, mountPoint);
  }
}

window.customElements.define("mika-testaa-74a18702", happeoCustomReactWidget);
