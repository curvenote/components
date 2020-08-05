import '@material/mwc-button';
import { html, css } from 'lit-element';
import { types } from '@iooxa/runtime';
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
  raised: { type: Boolean, reflect: true },
  outlined: { type: Boolean, reflect: true },
  unelevated: { type: Boolean, reflect: true },
  dense: { type: Boolean, reflect: true },
};

@withRuntime(ButtonSpec, litProps)
class Button extends BaseComponent<typeof ButtonSpec> {
  raised = false;

  outlined = false;

  unelevated = false;

  dense = false;

  render() {
    const { label, disabled } = this.$runtime!.state;
    const {
      raised, outlined, unelevated, dense,
    } = this;
    return html`<mwc-button ?raised="${raised}" ?outlined="${outlined}" ?unelevated="${unelevated}" ?dense="${dense}" ?disabled="${disabled}" label="${label}" @click="${() => this.$runtime?.dispatchEvent('click')}"></mwc-button>`;
  }

  static get styles() {
    return css`
    :host{
      white-space: normal;
    }`;
  }
}

export default Button;
