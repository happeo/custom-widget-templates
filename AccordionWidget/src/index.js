import React from "react";
import AccordionWidget from "./AccordionWidget";

class happeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    const widgetId = this.getAttribute("widgetId") || "";
    const uniqueId = this.getAttribute("uniqueId") || "";
    const editMode = this.getAttribute("editMode") || "";
    ReactDOM.render(
      <AccordionWidget
        id={uniqueId}
        widgetId={widgetId}
        editMode={editMode === "true"}
      />,
      this,
    );
  }
}
const slug = "anteros-test-kgatq4ll9rkqlwpe23de";

window.customElements.get(slug) ||
  window.customElements.define(slug, happeoCustomReactWidget);
