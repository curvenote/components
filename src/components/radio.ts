import '@material/mwc-radio';
import { html, css, PropertyValues } from 'lit-element';
import { types } from '@iooxa/runtime';
import { BaseComponent, withRuntime, onBindChange } from './base';
import { getLabelsAndValues } from './utils';

export const RadioSpec = {
  name: 'radio',
  description: 'Input button element',
  properties: {
    value: { type: types.PropTypes.string, default: '' },
    labels: { type: types.PropTypes.string, default: '', description: 'Comma seperated values' },
    values: { type: types.PropTypes.string, default: '', description: 'Comma seperated values' },
  },
  events: {
    change: { args: ['value'] },
  },
};

@withRuntime(RadioSpec, { bind: { type: String, reflect: true } })
class Radio extends BaseComponent<typeof RadioSpec> {
  updated(updated: PropertyValues) { onBindChange(updated, this, 'change'); }

  static get styles() {
    return css`
      mwc-formfield {
        display: block;
      }
    `;
  }

  render() {
    const { value, labels: labelsString, values: valuesString } = this.$runtime!.state;
    const { labels, values } = getLabelsAndValues(labelsString, valuesString);
    const changeHandler = (newValue: string) => () => {
      this.$runtime?.dispatchEvent('change', [newValue]);
    };
    return labels.map((label, i) => html`<mwc-formfield label="${label}"><mwc-radio name=${this.$runtime!.id}" ?checked=${String(value) === values[i]} @change=${changeHandler(values[i])}></mwc-radio></mwc-formfield>`);
  }
}

export default Radio;
