import '@material/mwc-switch';
import { html, PropertyValues, css } from 'lit-element';
import { types } from '@iooxa/runtime';
import { BaseComponent, withRuntime, onBindChange } from './base';
import { HTMLElementEvent } from '../types';

export const SwitchSpec = {
  name: 'switch',
  description: 'Inline text that drags a value inside a range',
  properties: {
    value: { type: types.PropTypes.boolean, default: false },
    label: { type: types.PropTypes.string, default: '' },
  },
  events: {
    change: { args: ['value'] },
  },
};

@withRuntime(SwitchSpec, { bind: { type: String, reflect: true } })
class Switch extends BaseComponent<typeof SwitchSpec> {
  updated(updated: PropertyValues) { onBindChange(updated, this, 'change'); }

  render() {
    const { value, label } = this.$runtime!.state;
    const change = (evt: HTMLElementEvent<HTMLInputElement>) => { this.$runtime?.dispatchEvent('change', [evt.target.checked]); };
    return html`<mwc-formfield label="${label}"><mwc-switch ?checked=${value} @change=${change}></mwc-switch></mwc-formfield>`;
  }

  static get styles() {
    return css`
    :host{
      white-space: normal;
    }`;
  }
}

export default Switch;
