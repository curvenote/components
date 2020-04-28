import { html } from 'lit-element';
import { types } from '@iooxa/runtime';
import { BaseComponent, withRuntime } from './base';

export const VisibleSpec = {
  name: 'visible',
  description: 'Component that reacts to visibility',
  properties: {
    visible: { type: types.PropTypes.boolean, default: true, has: { value: false, func: true } },
  },
  events: {},
};

@withRuntime(VisibleSpec, { bind: { type: String, reflect: true } })
class Visible extends BaseComponent<typeof VisibleSpec> {
  render() {
    const { visible } = this.$runtime!.state;
    this.hidden = !visible;
    return html`<slot></slot>`;
  }
}

export default Visible;
