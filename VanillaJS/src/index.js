import WidgetSDK from "@happeo/widget-sdk";

// Create a class for the element
class happeoCustomWidget extends HTMLElement {
  constructor() {
    // Always call super first in constructor
    super();

    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });

    // Create spans
    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", "wrapper");

    wrapper.id = "root";

    const title = document.createElement("h1");
    title.innerText = "Happeo custom widget";

    const text = document.createElement("p");
    text.innerText = "Useful resources";

    const list = document.createElement("ul");
    const item1 = document.createElement("li");
    const item2 = document.createElement("li");
    const item3 = document.createElement("li");

    item1.innerHTML =
      '<p><a href="https://github.com/happeo/custom-widget-templates" target="_blank">Custom widget templates</a></p>';
    item2.innerHTML =
      '<p><a href="https://github.com/happeo/widgets-sdk" target="_blank">Widget SDK</a></p>';
    item3.innerHTML =
      '<p><a href="https://uikit.happeo.com/" target="_blank">Happeo UI kit</a></p>';

    list.appendChild(item1);
    list.appendChild(item2);
    list.appendChild(item3);

    // Create some CSS to apply to the shadow dom
    const style = document.createElement("style");

    style.textContent = `
          .wrapper {
            position: relative;
          }
          p {
            font-size: 16px;
          }
          h1, p + p {
            margin-top: 4px;
          }
        `;

    // Attach the created elements to the shadow dom
    shadow.appendChild(wrapper);
    wrapper.appendChild(title);
    wrapper.appendChild(text);
    wrapper.appendChild(list);
  }

  connectedCallback() {
    this.doInit();
  }

  async doInit() {
    // Init API
    const widgetApi = await WidgetSDK.api.init(this.getAttribute("uniqueId"));

    // Use the SDK to get user and display it
    this.user = await widgetApi.getCurrentUser();

    const wrapper = this.shadowRoot.querySelector("#root");
    const user = document.createElement("p");
    user.innerText = `Hello ${this.user.name.fullName}!`;
    wrapper.appendChild(user);
  }
}

// Define the new element
const slug = "my-widget-slug";

window.customElements.get(slug) ||
  window.customElements.define(slug, happeoCustomWidget);
