import { html, LitElement, css } from '@lion/core';
import { OverlayMixin } from '@lion/overlays';

export class LionTooltip extends OverlayMixin(LitElement) {
  constructor() {
    super();
    this._mouseActive = false;
    this._keyActive = false;
    this.__setupRepositionCompletePromise();
  }

  static get styles() {
    return css`
      .arrow {
        position: absolute;
        --tooltip-arrow-width: 12px;
        --tooltip-arrow-height: 8px;
        width: var(--tooltip-arrow-width);
        height: var(--tooltip-arrow-height);
      }
      [x-placement='top'] .arrow {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        bottom: calc(-1 * var(--tooltip-arrow-height));
      }
      [x-placement='right'] .arrow {
        display: flex;
        justify-content: center;
        align-items: center;
        transform: rotate(90deg);
        left: calc(calc(-1 * var(--tooltip-arrow-width)) + 2px);
        height: 100%;
      }
      [x-placement='bottom'] .arrow {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        transform: rotate(180deg);
        top: calc(-1 * var(--tooltip-arrow-height));
      }
      [x-placement='left'] .arrow {
        display: flex;
        justify-content: center;
        align-items: center;
        transform: rotate(-90deg);
        right: calc(calc(-1 * var(--tooltip-arrow-width)) + 2px);
        height: 100%;
      }
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this._overlayContentNode.setAttribute('role', 'tooltip');
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <div id="overlay-content-node-wrapper">
        <slot name="content"> </slot>
        <div class="arrow" data-popper-arrow>
          <slot name="arrow"></slot>
        </div>
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    return {
      placementMode: 'local',
      elementToFocusAfterHide: null,
      hidesOnEsc: true,
      hidesOnOutsideEsc: true,
      popperConfig: {
        placement: 'top', // default
        modifiers: {
          keepTogether: {
            enabled: true,
          },
          arrow: {
            enabled: false,
          },
        },
        onCreate: data => {
          this.__syncFromPopperState(data);
        },
        onUpdate: data => {
          this.__syncFromPopperState(data);
        },
      },
    };
  }

  __setupRepositionCompletePromise() {
    this.repositionComplete = new Promise(resolve => {
      this.__repositionCompleteResolver = resolve;
    });
  }

  __syncFromPopperState(data) {
    if (!data) {
      return;
    }
    if (this.__arrowElement && data.placement !== this.__arrowElement.placement) {
      this.__arrowElement.placement = data.placement;
      this.__repositionCompleteResolver(data.placement);
      this.__setupRepositionCompletePromise();
    }
  }

  _setupOpenCloseListeners() {
    super._setupOpenCloseListeners();
    this.__resetActive = this.__resetActive.bind(this);
    this._overlayCtrl.addEventListener('hide', this.__resetActive);

    this.addEventListener('mouseenter', this._showMouse);
    this.addEventListener('mouseleave', this._hideMouse);

    this._showKey = this._showKey.bind(this);
    this._overlayInvokerNode.addEventListener('focusin', this._showKey);

    this._hideKey = this._hideKey.bind(this);
    this._overlayInvokerNode.addEventListener('focusout', this._hideKey);
  }

  _teardownOpenCloseListeners() {
    super._teardownOpenCloseListeners();
    this._overlayCtrl.removeEventListener('hide', this.__resetActive);
    this.removeEventListener('mouseenter', this._showMouse);
    this.removeEventListener('mouseleave', this._hideMouse);
    this._overlayInvokerNode.removeEventListener('focusin', this._showKey);
    this._overlayInvokerNode.removeEventListener('focusout', this._hideKey);
  }

  __resetActive() {
    this._mouseActive = false;
    this._keyActive = false;
  }

  _showMouse() {
    if (!this._keyActive) {
      this._mouseActive = true;
      this.opened = true;
    }
  }

  _hideMouse() {
    if (!this._keyActive) {
      this.opened = false;
    }
  }

  _showKey() {
    if (!this._mouseActive) {
      this._keyActive = true;
      this.opened = true;
    }
  }

  _hideKey() {
    if (!this._mouseActive) {
      this.opened = false;
    }
  }
}
