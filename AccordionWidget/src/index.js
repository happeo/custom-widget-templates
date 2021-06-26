import React from "react";

import Widget from "./Widget";

class happeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    console.log("Connect");
    const mountPoint = document.getElementsByTagName(slug)[0];
    // const mountPoint = document.createElement("span");
    // this.attachShadow({ mode: "open" }).appendChild(mountPoint);
    const widgetId = this.getAttribute("widgetId") || "";
    ReactDOM.render(<Widget id={widgetId} />, mountPoint);
  }
}
const slug = "anteros-test-kgatq4ll9rkqlwpe23de";

window.customElements.get(slug) ||
  window.customElements.define(slug, happeoCustomReactWidget);
