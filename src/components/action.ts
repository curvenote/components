import { html } from 'lit-element';
import { BaseComponent, withRuntime } from './base';

export const ActionSpec = {
  name: 'action',
  description: 'Inline text that has an action',
  properties: {
  },
  events: {
    click: { args: [] },
    hover: { args: ['enter'] },
  },
};

@withRuntime(ActionSpec, { bind: { type: String, reflect: true } })
class Action extends BaseComponent<typeof ActionSpec> {
  render() {
    const dispatch = (action: string, args: any[]) => this.$runtime?.dispatchEvent(action, args);
    this.classList[this.$runtime?.component?.events.click.func ? 'remove' : 'add']('noclick');
    return html`<span @click="${(e: Event) => { e.preventDefault(); dispatch('click', []); }}" @mouseenter=${() => dispatch('hover', [true])} @mouseleave=${() => dispatch('hover', [false])}><slot></slot></span>`;
  }
}

export default Action;
