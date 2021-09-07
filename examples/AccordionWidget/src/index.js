import React from "react";
import AccordionWidget from "./AccordionWidget";

class happeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    const uniqueId = this.getAttribute("uniqueId") || "";
    const mode = this.getAttribute("mode") || "";
    ReactDOM.render(
      <AccordionWidget id={uniqueId} editMode={mode === "edit"} />,
      this,
    );
  }
}
const slug = "slug-here";

window.customElements.get(slug) ||
  window.customElements.define(slug, happeoCustomReactWidget);
