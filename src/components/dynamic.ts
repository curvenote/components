import { html, PropertyValues, css } from 'lit-element';
import { drag, DragBehavior } from 'd3-drag';
import { select } from 'd3-selection';
import { types, DEFAULT_FORMAT } from '@curvenote/runtime';
import throttle from 'lodash.throttle';
import { THROTTLE_SKIP } from '../types';
import { BaseComponent, withRuntime, onBindChange } from './base';
import { formatter } from '../utils';
import { getValueOrTransform } from './utils';

const CURSOR_COL_RESIZE = 'cursor-col-resize';
// The virtual width of the dynamic text, about the width of half a phone:
const RANGE_WIDTH = 250;

export const DynamicSpec = {
  name: 'dynamic',
  description: 'Inline text that drags a value inside a range',
  properties: {
    value: { type: types.PropTypes.number, default: 0 },
    min: { type: types.PropTypes.number, default: 0 },
    max: { type: types.PropTypes.number, default: 100 },
    step: { type: types.PropTypes.number, default: 1 },
    sensitivity: {
      type: types.PropTypes.number,
      default: 1,
      description: 'Higher the sensitivity, the faster the scroll.',
    },
    format: { type: types.PropTypes.string, default: DEFAULT_FORMAT },
    periodic: { type: types.PropTypes.boolean, default: false },
    after: {
      type: types.PropTypes.string,
      default: '',
      description: 'Text to follow the formatted value, which remains dynamic.',
    },
    transform: {
      type: types.PropTypes.string,
      default: '',
      args: ['value'],
      has: { func: true, value: false },
    },
  },
  events: {
    change: { args: ['value'] },
  },
};

function positiveModulus(n: number, m: number) {
  return ((n % m) + m) % m;
}

@withRuntime(DynamicSpec, { bind: { type: String, reflect: true } })
class Dynamic extends BaseComponent<typeof DynamicSpec> {
  updated(updated: PropertyValues) {
    onBindChange(updated, this, 'change');
  }

  #dragging: boolean = false;

  #drag: DragBehavior<Element, unknown, unknown> | null = null;

  #prevValue: number = 0;

  firstUpdated(changedProps: PropertyValues) {
    super.firstUpdated(changedProps);

    // Set innerText if it is there to the after property:
    if (this.innerText) this.$runtime?.set({ after: { value: ` ${this.innerText}` } });

    const throttled = throttle(
      (val: number) => this.$runtime?.dispatchEvent('change', [val]),
      THROTTLE_SKIP,
    );

    const node = this as Element;
    const bodyClassList = document.getElementsByTagName('BODY')[0].classList;

    this.#drag = drag()
      .on('start', (event) => {
        event.sourceEvent.preventDefault();
        event.sourceEvent.stopPropagation();
        this.#dragging = true; // Hides the "drag" tool-tip
        const { value } = this.$runtime!.state;
        this.#prevValue = Number(value); // Start out with the actual value
        bodyClassList.add(CURSOR_COL_RESIZE);
      })
      .on('end', () => {
        this.#dragging = false;
        bodyClassList.remove(CURSOR_COL_RESIZE);
        this.requestUpdate();
      })
      .on('drag', (event) => {
        event.sourceEvent.preventDefault();
        event.sourceEvent.stopPropagation();

        const { dx } = event;

        const { step, min, max, sensitivity, periodic } = this.$runtime!.state;

        // The sensitivity is based on the RANGE_WIDTH
        const valuePerPixel = sensitivity / (RANGE_WIDTH / (Math.abs(max - min) + 1));

        let newValue;
        if (periodic) {
          newValue = positiveModulus(this.#prevValue + dx * valuePerPixel - min, max - min) + min;
        } else {
          newValue = Math.max(Math.min(this.#prevValue + dx * valuePerPixel, max), min);
        }
        // Store the actual value so the drag is smooth
        this.#prevValue = newValue;
        // Then round with the step size if it is greater than zero
        const val = step > 0 ? Math.round(newValue / step) * step : newValue;
        throttled(val);
      });

    this.#drag(select(node));
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        position: relative;
        white-space: normal;
      }
      .dynamic {
        cursor: col-resize;
      }
      .help {
        left: calc(50% - 13px);
        top: -1.1em;
        position: absolute;
        display: none;
        user-select: none;
        font-size: 9px;
        font-family: sans-serif;
        text-transform: uppercase;
        font-weight: 400;
      }
      :host(:hover) .help {
        display: block;
      }
    `;
  }

  render() {
    const { format, after } = this.$runtime!.state;
    const val = getValueOrTransform(this.$runtime);
    return html`<span class="dynamic">${formatter(val, format)}${after}<slot hidden></slot></span>
      <div class="help" style="${this.#dragging ? 'display:none' : ''}">drag</div>`;
  }
}

export default Dynamic;
