/* eslint-disable no-console */
/* eslint-disable max-classes-per-file */
import { LitElement, PropertyDeclaration, PropertyValues } from 'lit-element';
import {
  types, actions, selectors, DEFAULT_SCOPE, utils, provider,
} from '@iooxa/runtime';
import { Unsubscribe } from 'redux';

interface Constructable<T> {
  new(...args: any): T;
}

export class BaseSubscribe extends LitElement {
  $runtime: any | null = null;

  #scope?: Element;

  public get scope(): string | null {
    const closestScope = this.closest('r-scope');
    // Always use the *first* scope found. Important on removeVariable.
    if (closestScope != null) this.#scope = closestScope;
    return (this.#scope ?? closestScope)?.getAttribute('name') ?? DEFAULT_SCOPE;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.$runtime?.remove();
  }

  subscribe(id: string) {
    this.unsubscribe();
    this.#unsubscribe = provider.subscribe(id, () => this.requestRuntimeUpdate());
    return this.#unsubscribe;
  }

  requestRuntimeUpdate() {
    // Allows overwriting this!
    this.requestUpdate();
  }

  #unsubscribe?: Unsubscribe;

  unsubscribe() {
    if (this.#unsubscribe) this.#unsubscribe();
  }
}

export class BaseComponent<T extends types.DefineSpec> extends BaseSubscribe {
  $runtime: types.ComponentShortcut<{ [P in keyof T['properties']]: (T['properties'])[P]['default'] }> | null = null;

  static spec: types.Spec | null = null;

  connectedCallback() {
    super.connectedCallback();
    const { spec } = this.constructor as typeof BaseComponent;
    if (spec == null) return;
    const { scope, name } = this as any;
    const initializeProperties: Record<string, types.DefineComponentProperty> = {};
    const initializeEvents: Record<string, types.ComponentEvent> = {};
    Object.entries(spec.properties).forEach(([key, prop]) => {
      if (!prop.has.value && this.getAttribute(key)) {
        console.warn(`${this.tagName}: Property "${key}" is not defined, but attribute is provided.`);
      }
      if (!prop.has.func && this.getAttribute(`:${key}`)) {
        console.warn(`${this.tagName}: Property ":${key}" is not defined, but attribute is provided.`);
      }
      initializeProperties[key] = {
        name: key,
        value: prop.has.value ? this.getAttribute(prop.attribute) ?? prop.default : null,
        func: prop.has.func ? this.getAttribute(`:${prop.attribute}`) ?? '' : '',
      };
    });
    Object.entries(spec.events ?? {}).forEach(([key, evt]) => {
      initializeEvents[key] = {
        name: key,
        func: this.getAttribute(`:${evt.attribute}`) ?? '',
      };
    });
    const component = provider.dispatch(actions.createComponent(
      spec.name, initializeProperties, initializeEvents, { scope, name },
    ));
    this.$runtime = component as unknown as types.ComponentShortcut<{ [P in keyof T['properties']]: (T['properties'])[P]['default'] }>;
    this.subscribe(this.$runtime.id);
  }
}

/* withRuntime

A class wrapper intended for use with BaseComponent

```
@withRuntime(Spec)
class MyComponent extends BaseComponent {...}
```

The wrapper inserts:
  * Getters and Setters for each:
    * property
      * these are `${prop}`
    * property Function
      * these are `${prop}Function`
    * event
      * these are `on${Prop}Event` (capital P)
  * `properties` (for lit-element)
    * Two for each in the property spec
      * `${prop}`
      * `${prop}Function` with the attribute `:${prop}`
    * One for each in the events spec
      * `on${Prop}Event` with the attribute `:${prop}`
  * static `spec` attribute
*/
export function withRuntime<
T extends types.DefineSpec,
C extends Constructable<BaseComponent<T>>
  >(specDefinition: T, additionalProperties: { [key: string]: PropertyDeclaration } = {}) {
  return (ComponentClass: C) => {
    const litProperties = { ...additionalProperties };

    const spec = utils.getSpecFromDefinition(specDefinition);

    // Add the properties
    Object.entries(spec.properties).forEach(([key, prop]) => {
      if (!prop.has.value) {
        Object.defineProperty(ComponentClass.prototype, key, {
          get() { console.warn(`Property "${key}" is not defined for "${specDefinition.name}".`); return undefined; },
          set() { console.warn(`Property "${key}" is not defined for "${specDefinition.name}".`); },
        });
        return;
      }
      litProperties[key] = { type: String, attribute: prop.attribute };
      Object.defineProperty(ComponentClass.prototype, key, {
        get() {
          return this.$runtime?.state?.[key];
        },
        set(value: string) {
          if (value == null) {
            this.removeAttribute(prop.attribute);
            const prevFunc = this.$runtime?.component.properties[key].func;
            this.$runtime?.setProperties(
              { [key]: { value: value ?? prop.default, func: prevFunc } }
            );
          } else {
            this.setAttribute(prop.attribute, String(value));
            this.removeAttribute(`:${prop.attribute}`);
            this.$runtime?.setProperties({ [key]: { value: value ?? prop.default, func: '' } });
          }
        },
      });
    });

    // Add the property functions
    Object.entries(spec.properties).forEach(([key, prop]) => {
      if (!prop.has.func) return;
      litProperties[`${key}Function`] = { type: String, attribute: `:${prop.attribute}` };
      Object.defineProperty(ComponentClass.prototype, `${key}Function`, {
        get() {
          return this.$runtime?.component.properties[key].func;
        },
        set(value: string) {
          if (value == null) {
            this.removeAttribute(`:${prop.attribute}`);
          } else {
            this.setAttribute(`:${prop.attribute}`, String(value).trim());
          }
          const prevValue = this.$runtime?.component.properties[key].value;
          this.$runtime?.setProperties({ [key]: { value: prevValue, func: String(value ?? '').trim() } });
        },
      });
    });

    Object.entries(spec.events ?? {}).forEach(([key, evt]) => {
      // Add the property
      const onKeyEvent = `on${key.slice(0, 1).toUpperCase()}${key.slice(1)}Event`;
      litProperties[onKeyEvent] = { type: String, attribute: `:${evt.attribute}` };

      Object.defineProperty(ComponentClass.prototype, onKeyEvent, {
        get() {
          return this.$runtime?.component.events[key].func;
        },
        set(value: string) {
          if (value == null) {
            this.removeAttribute(`:${evt.attribute}`);
            this.$runtime?.set({}, { [key]: { func: String(value).trim() ?? '' } });
          } else {
            this.setAttribute(`:${evt.attribute}`, String(value).trim());
            this.$runtime?.set({}, { [key]: { func: String(value).trim() ?? '' } });
          }
        },
      });
    });

    Object.defineProperty(ComponentClass, 'properties', {
      get() { return litProperties; },
    });

    Object.defineProperty(ComponentClass, 'spec', {
      get() { return spec; },
    });
  };
}

export function onBindChange(
  updated: PropertyValues, component: BaseComponent<any>, eventKey?: string,
) {
  if (!updated.has('bind')) return;
  const { bind } = component as any;
  if (bind == null || bind === '') return;

  const { spec } = component.constructor as typeof BaseComponent;
  const variable = selectors.getVariableByName(provider.getState(), `${component.scope}.${bind}`);
  const props: any = {
    value: { value: null, func: bind },
  };
  if ('format' in spec!.properties) {
    props.format = { value: variable?.format ?? spec!.properties.format.default };
  }
  const events = eventKey ? { [eventKey]: { func: `{${bind}: value}` } } : {};
  component.$runtime?.set(props, events);
}
