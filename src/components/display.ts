import { html, PropertyValues } from 'lit-element';
import { types, DEFAULT_FORMAT } from '@iooxa/runtime';
import { formatter } from '../utils';
import { BaseComponent, withInk, onBindChange } from './base';
import { getValueOrTransform } from './utils';

export const InkDisplaySpec = {
  name: 'display',
  description: 'Inline display of values',
  properties: {
    value: { type: types.PropTypes.number, default: NaN },
    format: { type: types.PropTypes.string, default: DEFAULT_FORMAT },
    transform: {
      type: types.PropTypes.string, default: '', args: ['value'], has: { func: true, value: false },
    },
  },
  events: {},
};

@withInk(InkDisplaySpec, { bind: { type: String, reflect: true } })
class InkDisplay extends BaseComponent<typeof InkDisplaySpec> {
  updated(updated: PropertyValues) { onBindChange(updated, this); }

  render() {
    const { format } = this.ink!.state;
    const val = getValueOrTransform(this.ink);
    const formatted = formatter(val, format);
    this.textContent = formatted;
    return html`<slot></slot>`;
  }
}

export default InkDisplay;
