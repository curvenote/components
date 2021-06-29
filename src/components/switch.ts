import { html, PropertyValues, css } from 'lit-element';
import { types } from '@curvenote/runtime';
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
  updated(updated: PropertyValues) {
    onBindChange(updated, this, 'change');
  }

  static get styles() {
    return css`
      :host {
        white-space: normal;
        user-select: none;
      }
      .switch {
        position: relative;
        display: inline-block;
        width: 36px;
        height: 22px;
      }
      input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: 0.15s ease;
        border-radius: 30px;
      }
      .slider:before {
        position: absolute;
        content: '';
        height: 14px;
        width: 14px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: 0.15s ease;
        border-radius: 50%;
      }
      input:checked + .slider {
        background-color: var(--theme-secondary, #46f);
      }
      .switch:hover .slider {
        filter: brightness(90%);
      }
      input:focus + .slider {
        box-shadow: 0 0 3px var(--theme-secondary, #46f);
      }
      input:checked + .slider:before {
        transform: translateX(14px);
      }
      .label {
        cursor: pointer;
      }
    `;
  }

  render() {
    const { value, label } = this.$runtime!.state;
    const change = (evt: HTMLElementEvent<HTMLInputElement>) => {
      this.$runtime?.dispatchEvent('change', [evt.target.checked]);
    };

    return html`<label class="switch" for="${this.$runtime!.id}">
        <input
          type="checkbox"
          id="${this.$runtime!.id}"
          name="${this.$runtime!.id}"
          .checked=${value}
          @change=${change}
        />
        <span class="slider"></span>
      </label>
      <label class="label" for="${this.$runtime!.id}">${label}</label>`;
  }
}

export default Switch;
