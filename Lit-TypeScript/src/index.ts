import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import widgetSDK from "@happeo/widget-sdk";
import type { User } from "@happeo/widget-sdk/dist/interfaces";

// Create a class for the element
class happeoCustomWidget extends LitElement {
  @property({ type: String })
  uniqueId = "";

  @property({ type: String })
  mode = "view";

  @state()
  private user?: User;

  connectedCallback() {
    super.connectedCallback();
    this.doInit();
  }

  async doInit() {
    // Init API
    const widgetApi = await widgetSDK.api.init(this.uniqueId);

    // Do stuff
    this.user = await widgetApi.getCurrentUser();
    console.log("I am all good and ready to go!", this.user);
  }

  render() {
    return html`
      <div class="wrapper">
        <h1>
          Happeo custom widget ${this.mode === "edit" ? "[edit mode]" : ""}
        </h1>
        <p>
          ${(this.user && html`Hi, ${this.user.name.fullName}!`) ||
          html`initializing...`}
        </p>
        <p>Useful resources</p>
        <ul>
          <li>
            <p>
              <a
                href="https://github.com/happeo/custom-widget-templates"
                target="_blank"
                >Custom widget templates</a
              >
            </p>
          </li>
          <li>
            <p>
              <a href="https://github.com/happeo/widgets-sdk" target="_blank"
                >Widget SDK</a
              >
            </p>
          </li>
          <li>
            <p>
              <a href="https://uikit.happeo.com/" target="_blank"
                >Happeo UI kit</a
              >
            </p>
          </li>
        </ul>
      </div>
    `;
  }

  static styles = css`
    .wrapper {
      position: relative;
    }
    p {
      font-size: 16px;
    }
    h1,
    p + p {
      margin-top: 4px;
    }
  `;
}

// Define the new element
const slug = "my-widget-slug";

window.customElements.get(slug) ||
  window.customElements.define(slug, happeoCustomWidget);
