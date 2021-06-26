import { html, css } from 'lit-element';
import { types } from '@curvenote/runtime';
import { BaseComponent, withRuntime } from './base';

export const ButtonSpec = {
  name: 'button',
  description: 'Input button element',
  properties: {
    label: { type: types.PropTypes.string, default: 'Click Here' },
    disabled: { type: types.PropTypes.boolean, default: false },
  },
  events: {
    click: { args: [] },
  },
};

const litProps = {
  dense: { type: Boolean, reflect: true },
};

@withRuntime(ButtonSpec, litProps)
class Button extends BaseComponent<typeof ButtonSpec> {
  dense = false;

  render() {
    const { label, disabled } = this.$runtime!.state;
    const { dense } = this;
    return html`<button
      type="button"
      class="${dense ? 'dense' : ''}"
      ?disabled="${disabled}"
      @click="${() => this.$runtime?.dispatchEvent('click')}"
    >
      ${label}
    </button>`;
  }

  static get styles() {
    return css`
      button {
        cursor: pointer;
        padding: 5px;
      }
      button.dense {
        padding: 0px;
      }
    `;
  }
}

export default Button;
