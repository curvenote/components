import { html, css, PropertyValues } from 'lit-element';
import { types } from '@curvenote/runtime';
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
  updated(updated: PropertyValues) {
    onBindChange(updated, this, 'change');
  }

  static get styles() {
    return css`
      label,
      input {
        cursor: pointer;
      }
    `;
  }

  render() {
    const { value, labels: labelsString, values: valuesString } = this.$runtime!.state;
    const { labels, values } = getLabelsAndValues(labelsString, valuesString);
    const changeHandler = (newValue: string) => () => {
      this.$runtime?.dispatchEvent('change', [newValue]);
    };
    const name = this.$runtime!.id;
    return labels.map((label, i) => {
      const id = name + '-' + label;
      return html`<p>
        <input type="radio" id="${id}" name=${name}" .checked=${String(value) === values[i]}
        @change=${changeHandler(values[i])}>
        <label for=${id}>${label}</label>
      </p>`;
    });
  }
}

export default Radio;
