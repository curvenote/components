import {
  actions, setup, provider, types,
} from '@curvenote/runtime';
import Variable from './variable';
import Display from './display';
import Range from './range';
import Dynamic from './dynamic';
import Action from './action';
import Button from './button';
import Switch from './switch';
import Checkbox from './checkbox';
import Radio from './radio';
import Select from './select';
import Input from './input';
import Visible from './visible';

export function registerComponent(name: string, component: any) {
  provider.dispatch(actions.createSpec(
    component.spec!.name,
    component.spec!.properties,
    component.spec!.events,
  ));
  customElements.define(name, component);
}

export const register = (store: types.Store) => {
  setup(store);
  customElements.define('r-var', Variable);
  registerComponent('r-display', Display);
  registerComponent('r-dynamic', Dynamic);
  registerComponent('r-range', Range);
  registerComponent('r-action', Action);
  registerComponent('r-button', Button);
  registerComponent('r-switch', Switch);
  registerComponent('r-checkbox', Checkbox);
  registerComponent('r-radio', Radio);
  registerComponent('r-select', Select);
  registerComponent('r-input', Input);
  registerComponent('r-visible', Visible);
};

export default {
  Variable,
  Display,
  Dynamic,
  Range,
  Action,
  Button,
  Switch,
  Checkbox,
  Radio,
  Select,
  Input,
  Visible,
};
