import { css, html, PropertyValues } from 'lit-element';
import { types } from '@curvenote/runtime';
import { BaseComponent, withRuntime, onBindChange } from './base';
import { HTMLElementEvent } from '../types';

export const CheckboxSpec = {
  name: 'checkbox',
  description: 'Inline text that drags a value inside a range',
  properties: {
    value: { type: types.PropTypes.boolean, default: false },
    label: { type: types.PropTypes.string, default: '' },
  },
  events: {
    change: { args: ['value'] },
  },
};

@withRuntime(CheckboxSpec, { bind: { type: String, reflect: true } })
class Checkbox extends BaseComponent<typeof CheckboxSpec> {
  updated(updated: PropertyValues) {
    onBindChange(updated, this, 'change');
  }

  static get styles() {
    return css`
      label,
      input {
        cursor: pointer;
      }
    `;
  }

  render() {
    const { value, label } = this.$runtime!.state;
    const change = (evt: HTMLElementEvent<HTMLInputElement>) => {
      this.$runtime?.dispatchEvent('change', [evt.target.checked]);
    };

    return html`<input
        type="checkbox"
        id="${this.$runtime!.id}"
        name="${this.$runtime!.id}"
        .checked=${value}
        @change=${change}
      />
      <label for="${this.$runtime!.id}">${label}</label>`;
  }
}

export default Checkbox;
