import React from "react";
import Widget from "./Widget";

class happeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.getElementsByTagName(slug)[0];
    const widgetId = this.getAttribute("widgetId") || "";
    const editMode = this.getAttribute("editMode") || "";
    ReactDOM.render(
      <Widget id={widgetId} editMode={editMode === "true"} />,
      mountPoint,
    );
  }
}
const slug = "anteros-test-kgatq4ll9rkqlwpe23de";

window.customElements.get(slug) ||
  window.customElements.define(slug, happeoCustomReactWidget);
