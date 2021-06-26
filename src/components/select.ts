import { html, PropertyValues } from 'lit-element';
import { types } from '@curvenote/runtime';
import { BaseComponent, withRuntime, onBindChange } from './base';
import { getLabelsAndValues } from './utils';

export const SelectSpec = {
  name: 'select',
  description: 'Input button element',
  properties: {
    value: { type: types.PropTypes.string, default: '' },
    label: { type: types.PropTypes.string, default: '' },
    labels: { type: types.PropTypes.string, default: '', description: 'Comma seperated values' },
    values: { type: types.PropTypes.string, default: '', description: 'Comma seperated values' },
  },
  events: {
    change: { args: ['value'] },
  },
};

@withRuntime(SelectSpec, { bind: { type: String, reflect: true } })
class Select extends BaseComponent<typeof SelectSpec> {
  updated(updated: PropertyValues) {
    onBindChange(updated, this, 'change');
  }

  render() {
    const { label, value, labels: labelsString, values: valuesString } = this.$runtime!.state;
    const { labels, values } = getLabelsAndValues(labelsString, valuesString);
    const changeHandler = (evt: any) => {
      console.log(evt.target.value);
      this.$runtime?.dispatchEvent('change', [evt.target.value]);
    };

    return html`<select @change=${changeHandler}>
      ${labels.map(
        (item, i) =>
          html`<option value=${values[i]} .selected=${String(value) === values[i]}>
            ${item}
          </option>`,
      )}
    </select>`;
  }
}

export default Select;
