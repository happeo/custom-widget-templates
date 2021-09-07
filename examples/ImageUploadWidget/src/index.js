import React from "react";
import ImageUploadWidget from "./ImageUploadWidget";

class happeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    const uniqueId = this.getAttribute("uniqueId") || "";
    const mode = this.getAttribute("mode") || "";
    ReactDOM.render(
      <ImageUploadWidget
        id={uniqueId}
        editMode={mode === "edit"}
      />,
      this
    );
  }
}

const slug = "add-slug-here";

window.customElements.get(slug) ||
  window.customElements.define(slug, happeoCustomReactWidget);
