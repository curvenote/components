import {
  LitElement, html, css, svg, PropertyDeclaration, PropertyValues,
} from 'lit-element';
import { DEFAULT_FORMAT } from '@iooxa/runtime';
import { render as renderHTML } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import throttle from 'lodash.throttle';
import { THROTTLE_SKIP } from './types';
import { BaseComponent, withRuntime } from './components/base';
import components, { register, registerComponent } from './components';
import { formatter } from './utils';

export {
  // Downstream components that use BaseComponent should use these LitElement instances
  // There are some singletons that get created by that library that make things hard
  LitElement, html, css, svg, PropertyDeclaration, PropertyValues, unsafeHTML, renderHTML,
  BaseComponent, withRuntime,
  register, registerComponent,
  throttle, THROTTLE_SKIP, DEFAULT_FORMAT,
  formatter,
};

export default components;
