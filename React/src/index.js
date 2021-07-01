import React from "react";
import Widget from "./Widget";

class happeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    const widgetId = this.getAttribute("widgetId") || "";
    const uniqueId = this.getAttribute("uniqueId") || "";
    const editMode = this.getAttribute("editMode") || "";
    ReactDOM.render(
      <Widget
        id={uniqueId}
        widgetId={widgetId}
        editMode={editMode === "true"}
      />,
      this,
    );
  }
}
const slug = "my-widget-slug";

window.customElements.get(slug) ||
  window.customElements.define(slug, happeoCustomReactWidget);
