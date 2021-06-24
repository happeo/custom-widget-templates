const React = window.React;
const ReactDOM = window.ReactDOM;

import Widget from "./Widget";

class happeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.getElementsByTagName(slug)[0];
    const widgetId = this.getAttribute("widgetId") || "";
    ReactDOM.render(<Widget id={widgetId} />, mountPoint);
  }
}

const slug = "custom-widget-slug";

window.customElements.get(slug) ||
  window.customElements.define(slug, happeoCustomReactWidget);
