import { html, PropertyValues } from 'lit-element';
import { types, DEFAULT_FORMAT } from '@curvenote/runtime';
import { formatter } from '../utils';
import { BaseComponent, withRuntime, onBindChange } from './base';
import { getValueOrTransform } from './utils';

export const DisplaySpec = {
  name: 'display',
  description: 'Inline display of values',
  properties: {
    value: { type: types.PropTypes.number, default: NaN, description: 'Value of the display' },
    format: { type: types.PropTypes.string, default: DEFAULT_FORMAT, description: 'Format of the variable' },
    transform: {
      type: types.PropTypes.string, default: '', args: ['value'], has: { func: true, value: false },
    },
  },
  events: {},
};

@withRuntime(DisplaySpec, { bind: { type: String, reflect: true } })
class Display extends BaseComponent<typeof DisplaySpec> {
  updated(updated: PropertyValues) { onBindChange(updated, this); }

  render() {
    const { format } = this.$runtime!.state;
    const val = getValueOrTransform(this.$runtime);
    const formatted = formatter(val, format);
    this.textContent = formatted;
    return html`<slot></slot>`;
  }
}

export default Display;
