import { html } from 'lit-element';
import { actions, types, VariableSpec, provider } from '@curvenote/runtime';
import { formatter } from '../utils';
import { BaseSubscribe, withRuntime } from './base';

function toString(current: any, format: string) {
  switch (typeof current) {
    case 'string':
      return `"${current}"`;
    case 'number':
      return formatter(current, format);
    case 'object':
      try {
        return JSON.stringify(current);
      } catch (error) {
        return String(current);
      }
    default:
      return String(current);
  }
}

@withRuntime(VariableSpec)
class Variable extends BaseSubscribe {
  connectedCallback() {
    super.connectedCallback();
    const { scope } = this;
    const name = this.getAttribute('name') as string;
    this.$runtime = provider.dispatch(
      actions.createVariable(
        `${scope}.${name}`,
        this.getAttribute('value') ?? VariableSpec.properties.value.default,
        this.getAttribute(':value') ?? '',
        {
          description: this.getAttribute('description') ?? '',
          type:
            (this.getAttribute('type') as types.PropTypes) ?? VariableSpec.properties.type.default,
          format:
            this.getAttribute('format') ??
            (VariableSpec.properties.format.default as types.PropTypes),
        },
      ),
    );
    this.subscribe(this.$runtime.id);
  }

  render() {
    const { name, value, current, func, format, derived } = this.$runtime!.state;
    // TODO: show error if name is not defined
    const currentStr = toString(current, format);
    if (derived) {
      return html`<code>function ${name}() { return ${func}; }</code> = ${currentStr}`;
    }
    const valueStr = toString(value, format);
    return html`${name} = ${valueStr}, Current: ${currentStr}`;
  }
}

export default Variable;
