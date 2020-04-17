import {
  html, PropertyValues, css,
} from 'lit-element';
import { drag, DragBehavior } from 'd3-drag';
import { select, event } from 'd3-selection';
import { types, DEFAULT_FORMAT } from '@iooxa/runtime';
import { throttle } from 'underscore';
import { THROTTLE_SKIP } from '../types';
import { BaseComponent, withInk, onBindChange } from './base';
import { formatter } from '../utils';
import { getValueOrTransform } from './utils';

const CURSOR_DRAG_CLASS = 'ink-drag-horz';
// The virtual width of the dynamic text, about the width of half a phone:
const RANGE_WIDTH = 250;

export const InkDynamicSpec = {
  name: 'dynamic',
  description: 'Inline text that drags a value inside a range',
  properties: {
    value: { type: types.PropTypes.number, default: 0 },
    min: { type: types.PropTypes.number, default: 0 },
    max: { type: types.PropTypes.number, default: 100 },
    step: { type: types.PropTypes.number, default: 1 },
    sensitivity: { type: types.PropTypes.number, default: 1, description: 'Higher the sensitivity, the faster the scroll.' },
    format: { type: types.PropTypes.string, default: DEFAULT_FORMAT },
    periodic: { type: types.PropTypes.boolean, default: false },
    after: { type: types.PropTypes.string, default: '', description: 'Text to follow the formatted value, which remains dynamic.' },
    transform: {
      type: types.PropTypes.string, default: '', args: ['value'], has: { func: true, value: false },
    },
  },
  events: {
    change: { args: ['value'] },
  },
};

function positiveModulus(n: number, m: number) {
  return ((n % m) + m) % m;
}

@withInk(InkDynamicSpec, { bind: { type: String, reflect: true } })
class InkDynamic extends BaseComponent<typeof InkDynamicSpec> {
  updated(updated: PropertyValues) { onBindChange(updated, this, 'change'); }

  #dragging: boolean = false;

  #drag: DragBehavior<Element, unknown, unknown> | null = null;

  #prevValue: number = 0;

  firstUpdated(changedProps: PropertyValues) {
    super.firstUpdated(changedProps);

    // Set innerText if it is there to the after property:
    if (this.innerText) {
      this.setAttribute('after', this.innerText);
    }

    const throttled = throttle((val: number) => this.ink?.dispatchEvent('change', [val]), THROTTLE_SKIP);

    const node = this as Element;
    const bodyClassList = document.getElementsByTagName('BODY')[0].classList;

    this.#drag = drag().on('start', () => {
      event.sourceEvent.preventDefault();
      event.sourceEvent.stopPropagation();
      this.#dragging = true; // Hides the "drag" tool-tip
      const { value } = this.ink!.state;
      this.#prevValue = Number(value); // Start out with the actual value
      bodyClassList.add(CURSOR_DRAG_CLASS);
    }).on('end', () => {
      this.#dragging = false;
      bodyClassList.remove(CURSOR_DRAG_CLASS);
      this.requestUpdate();
    }).on('drag', () => {
      event.sourceEvent.preventDefault();
      event.sourceEvent.stopPropagation();

      const { dx } = event;

      const {
        step, min, max, sensitivity, periodic,
      } = this.ink!.state;

      // By default the sensitivity is 1value == 5px
      const valuePerPixel = sensitivity / (RANGE_WIDTH / (Math.abs(max - min) + 1));

      let newValue;
      if (periodic) {
        newValue = positiveModulus((this.#prevValue + (dx * valuePerPixel)) - min, max - min) + min;
      } else {
        newValue = Math.max(Math.min(this.#prevValue + (dx * valuePerPixel), max), min);
      }
      // Store the actual value so the drag is smooth
      this.#prevValue = newValue;
      // Then round with the step size if it is greater than zero
      const val = (step > 0) ? Math.round(newValue / step) * step : newValue;
      throttled(val);
    });

    this.#drag(select(node));
  }

  static get styles() {
    return css`
      :host{
        display: inline-block;
        position: relative;
        white-space: normal;
      }
      .dynamic{
        cursor: col-resize;
      }
      .help{
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
      :host(:hover) .help{
        display: block;
      }
    `;
  }

  render() {
    const { format, after } = this.ink!.state;
    const val = getValueOrTransform(this.ink);
    return html`<span class="dynamic">${formatter(val, format)} ${after}<slot hidden></slot></span><div class="help" style="${this.#dragging ? 'display:none' : ''}">drag</div>`;
  }
}

export default InkDynamic;
