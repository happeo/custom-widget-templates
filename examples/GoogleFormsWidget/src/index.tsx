import React from "react";
import ReactDOM from "react-dom";
import GoogleFormsWidget from "./GoogleFormsWidget";

class happeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    const uniqueId = this.getAttribute("uniqueId") || "";
    const mode = this.getAttribute("mode") || "";
    const location = this.getAttribute("location") || "";
    const trigger = this.getAttribute("trigger") || "";

    ReactDOM.render(
      <GoogleFormsWidget
        id={uniqueId}
        editMode={mode === "edit"}
        location={location}
        trigger={trigger}
      />,
      this,
    );
  }
}

const slug = "insert-your-slug-here";

window.customElements.get(slug) ||
  window.customElements.define(slug, happeoCustomReactWidget);
