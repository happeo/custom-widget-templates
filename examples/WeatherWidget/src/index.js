import React from "react";
import WeatherWidget from "./WeatherWidget";

class happeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    const uniqueId = this.getAttribute("uniqueId") || "";
    const mode = this.getAttribute("mode") || "";
    ReactDOM.render(
      <WeatherWidget
        id={uniqueId}
        widgetId={widgetId}
        editMode={mode === "edit"}
      />,
      this
    );
  }
}

const slug = "add-slug-here";

window.customElements.get(slug) ||
  window.customElements.define(slug, happeoCustomReactWidget);
