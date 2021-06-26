import { html, PropertyValues } from 'lit-element';
import { types } from '@curvenote/runtime';
import { HTMLElementEvent } from '../types';
import { BaseComponent, withRuntime, onBindChange } from './base';

export const InputSpec = {
  name: 'input',
  description: 'Input text element',
  properties: {
    value: { type: types.PropTypes.string, default: '' },
    label: { type: types.PropTypes.string, default: '' },
  },
  events: {
    change: { args: ['value'] },
  },
};

@withRuntime(InputSpec, { bind: { type: String, reflect: true } })
class Input extends BaseComponent<typeof InputSpec> {
  updated(updated: PropertyValues) {
    onBindChange(updated, this, 'change');
  }

  render() {
    const { value } = this.$runtime!.state;

    const changeHandler = (event: HTMLElementEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      this.$runtime?.dispatchEvent('change', [newValue]);
    };

    return html`<input type="text" .value=${value} @change="${changeHandler}"></input>`;
  }
}

export default Input;
