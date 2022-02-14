import { AnimeFillerListResponse } from "./utils";

const template = document.createElement("template");
template.innerHTML = `
  <style>
    div {
      color: white;
      position: absolute;
      bottom: 0;
      right: 0;
      text-transform: uppercase;
      padding: 1px 5px;
      border-radius:5px;
      display: block;
    }
  </style>

  <div></div>
`;

export class EpisodeTag extends HTMLElement {
  fillerInfo: AnimeFillerListResponse[0];
  container: HTMLDivElement;

  constructor({ fillerInfo }: { fillerInfo: AnimeFillerListResponse[0] }) {
    super();
    this.fillerInfo = fillerInfo;
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.appendChild(template.content.cloneNode(true));

    this.container = this.shadowRoot!.querySelector("div")!;

    this.container.innerHTML = this.fillerInfo.type;

    this.container.style.backgroundColor =
      this.fillerInfo.type === "Filler" ? "red" : "green";
  }
}

window.customElements.define("paf-episode-tag", EpisodeTag);
