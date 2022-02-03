import React from "react";
import ReactDOM from "react-dom";
import Widget from "./Widget";

class happeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    const uniqueId = this.getAttribute("uniqueId") || "";
    ReactDOM.render(<Widget id={uniqueId} />, this);
  }
}
const slug = "my-test-for-customer-call-lpnop1xmyocd6bypwwoo";

window.customElements.get(slug) ||
  window.customElements.define(slug, happeoCustomReactWidget);
