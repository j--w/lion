import { css, html, LitElement } from '@lion/core';

export class LionTooltipArrow extends LitElement {
  static get properties() {
    return {
      placement: { type: String, reflect: true },
    };
  }

  static get styles() {
    return css`
      :host svg {
        display: block;
      }
    `;
  }

  /* IE11 will not render the arrow without this method. */
  render() {
    return html`
      <svg viewBox="0 0 12 8">
        <path d="M 0,0 h 12 L 6,8 z"></path>
      </svg>
    `;
  }
}
