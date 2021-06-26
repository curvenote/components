import { css, html, PropertyValues } from 'lit-element';
import { types } from '@curvenote/runtime';
import throttle from 'lodash.throttle';
import { BaseComponent, withRuntime, onBindChange } from './base';
import { HTMLElementEvent, THROTTLE_SKIP } from '../types';

export const RangeSpec = {
  name: 'range',
  description: 'Range input',
  properties: {
    value: { type: types.PropTypes.number, default: 0 },
    min: { type: types.PropTypes.number, default: 0 },
    max: { type: types.PropTypes.number, default: 100 },
    step: { type: types.PropTypes.number, default: 1 },
  },
  events: {
    change: { args: ['value'] },
  },
};

@withRuntime(RangeSpec, { bind: { type: String, reflect: true } })
class Range extends BaseComponent<typeof RangeSpec> {
  updated(updated: PropertyValues) {
    onBindChange(updated, this, 'change');
  }

  #throttled: ((v: number) => void) | null = null;

  static get styles() {
    return css`
      input {
        cursor: pointer;
      }
    `;
  }

  render() {
    const { value, min, max, step } = this.$runtime!.state;

    if (this.#throttled == null) {
      this.#throttled = throttle(
        (val: number) => this.$runtime?.dispatchEvent('change', [val]),
        THROTTLE_SKIP,
      );
    }

    const changeHandler = (event: HTMLElementEvent<HTMLInputElement>) => {
      const newValue = Number.parseFloat(event.target.value);
      this.#throttled!(newValue);
    };

    return html`<input
      type="range"
      min="${min}"
      max="${max}"
      step="${step}"
      .value="${value}"
      @input="${changeHandler}"
    />`;
  }
}

export default Range;
