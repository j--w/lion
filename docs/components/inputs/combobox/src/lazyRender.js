import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';

/**
 * In order to speed up the first meaningful paint, use this directive
 * on content that is:
 * - (visually) hidden
 * - out of the page flow (having position: 'absolute|fixed')
 *
 * A good practice would be to use it in overlays,
 * For hidden tab panels, collapsible content etc. it's also useful
 * @example
 *  <lion-combobox name="combo" label="Combo">
 *   ${lazyRender(
 *     largeListOfData.map(entry => html` <expensive-option>${entry}</expensive-option> `),
 *   )}
 * </lion-combobox>
 */
export const lazyRender = directive(
  class extends AsyncDirective {
    render(tplResult) {
      setTimeout(() => {
        this.setValue(tplResult);
      });
    }
  },
);

// export const lazyRender = () => {};
