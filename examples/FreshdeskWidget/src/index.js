import FreshdeskWidget from "./FreshdeskWidget";

class happeoCustomReactWidget extends HTMLElement {
  connectedCallback() {
    const uniqueId = this.getAttribute("uniqueId") || "";
    const mode = this.getAttribute("mode") || "";

    ReactDOM.render(
      <FreshdeskWidget id={uniqueId} editMode={mode === "edit"} />,
      this,
    );
  }
}
const slug = "freshdesk-help-kk12b18hooxihmxbad15";

window.customElements.get(slug) ||
  window.customElements.define(slug, happeoCustomReactWidget);

!(function () {
  if ("function" != typeof window.FreshworksWidget) {
    var n = function () {
      n.q.push(arguments);
    };
    (n.q = []), (window.FreshworksWidget = n);
  }
})();
