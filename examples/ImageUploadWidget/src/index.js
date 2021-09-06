import React from "react";
import ImageUploadWidget from "./ImageUploadWidget";

class happeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    const widgetId = this.getAttribute("widgetId") || "";
    const uniqueId = this.getAttribute("uniqueId") || "";
    const editMode = this.getAttribute("editMode") || "";
    ReactDOM.render(
      <ImageUploadWidget
        id={uniqueId}
        widgetId={widgetId}
        editMode={editMode === "true"}
      />,
      this
    );
  }
}

const slug = "add-slug-here";

window.customElements.get(slug) ||
  window.customElements.define(slug, happeoCustomReactWidget);
