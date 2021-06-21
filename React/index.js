import React from "react";
import ReactDOM from "react-dom";

class happeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement("span");
    this.attachShadow({ mode: "open" }).appendChild(mountPoint);

    const { scopedData } = JSON.parse(this.getAttribute("context"));
    const url =
      "https://www.google.com/search?q=" +
      encodeURIComponent(scopedData.user.primaryEmail);
    ReactDOM.render(
      <a href={url}>{scopedData.user.primaryEmail}</a>,
      mountPoint,
    );
  }
}

customElements.define("mika-testaa1", happeoCustomReactWidget);
