import { css, html, LitElement } from '@lion/core';

export class LionTooltipArrow extends LitElement {
  static get properties() {
    return {
      placement: { type: String, reflect: true },
    };
  }

  static get styles() {
    return css`
      :host {
        position: absolute;
        --tooltip-arrow-width: 12px;
        --tooltip-arrow-height: 8px;
        width: var(--tooltip-arrow-width);
        height: var(--tooltip-arrow-height);
      }

      :host svg {
        display: block;
      }
    `;
  }

  /* IE11 will not render the arrow without this method. */
  render() {
    return html`
      <svg class="arrow__graphic" viewBox="0 0 12 8">
        <path d="M 0,0 h 12 L 6,8 z"></path>
      </svg>
    `;
  }
}
