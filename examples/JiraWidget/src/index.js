import React from "react";
import JiraWidget from "./JiraWidget";

class happeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    const uniqueId = this.getAttribute("uniqueId") || "";
    const mode = this.getAttribute("mode") || "";
    const location = this.getAttribute("location") || "";
    const query = this.getAttribute("query") || "";

    ReactDOM.render(
      <JiraWidget
        id={uniqueId}
        editMode={mode === "edit"}
        location={location}
        query={query}
      />,
      this,
    );
  }
}

const slug = "jiraissues-iguqcpwt3vtrpqsouzeu";

window.customElements.get(slug) ||
  window.customElements.define(slug, happeoCustomReactWidget);
