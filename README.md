# @iooxa/ink-basic

[![Ink-Basic on npm](https://img.shields.io/npm/v/@iooxa/runtime.svg)](https://www.npmjs.com/package/@iooxa/ink-basic)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ink-components/ink-components/blob/master/LICENSE)

The goal of ink-basic is to provide web-components for interactive scientific writing, reactive documents and [explorable explanations](https://explorabl.es). This library provides the base of [ink-components](https://components.ink) including ways to create, update and display variables as dynamic text and modify them with buttons, inputs, sliders, switches, and dropdowns.

The [ink-components](https://components.ink) project is heavily inspired by [tangle.js](http://worrydream.com/Tangle/guide.html), re-imagined to use [web-components](https://www.webcomponents.org/)!
This means you can declaratively write your variables and how to display them in `html` markup.
To get an idea of what that looks like, let's take the canonical example of *Tangled Cookies* - a simple reactive document.

![How many calories in that cookie?](images/tangle.gif)

```html
<ink-var name="cookies" value="3" format=".4"></ink-var>
<ink-var name="caloriesPerCookie" value="50"></ink-var>
<ink-var name="dailyCalories" value="2100"></ink-var>

<ink-var name="calories" :value="cookies * caloriesPerCookie" format=".0f"></ink-var>
<ink-var name="dailyPercent" :value="calories / dailyCalories" format=".0%"></ink-var>

<p>
  When you eat <ink-dynamic bind="cookies" min="2" max="100">cookies</ink-dynamic>,
  you consume <ink-display bind="calories"></ink-display> calories.<br>
  That's <ink-display bind="dailyPercent"></ink-display> of your recommended daily calories.
</p>
```

## Getting Started

Ink is based on web-components, which creates custom HTML tags so that they can make writing documents easier.
To get started, copy the built javascript file to the head of your page:

```html
<script src="https://unpkg.com/@iooxa/ink-basic"></script>
```

You can also download the [latest release](https://github.com/iooxa/ink-basic/releases) from GitHub. If you are running this without a web server, ensure the script has `charset="utf-8"` in the script tag. You can also [install from npm](https://www.npmjs.com/package/@iooxa/ink-basic):

```bash
>> npm install @iooxa/ink-basic
```

You should then be able to extend ink as you see fit:

```javascript
import components from '@iooxa/ink-basic';
```

Note that the npm module does not setup the [@iooxa/runtime](https://github.com/iooxa/runtime) store, nor does it register the components. See the [ink.ts](/ink.ts) file for what the built package does to `setup` the store and `register` the components.

## Basic Components

* ink-var
* ink-display
* ink-dynamic
* ink-range
* ink-action
* ink-button
* ink-switch
* ink-checkbox
* ink-radio
* ink-select
* ink-input
* ink-visible

## Variables

Variables need to be defined to drive your dynamic document, the `ink-var` web component can specify a name, description and a value.

```html
<ink-var name="x" value="1"></ink-var>
```

These variables can be hidden in the DOM, which makes sense in most applications.

### Reactive Variables

You can also create reactive variables which gets and executes a user-defined string using [@iooxa/runtime](https://github.com/iooxa/runtime) with access to all other variables in the `scope`. Note here that the `:value` has a **semi-colon** to show that this should be executed to define the value.

```html
<ink-var name="xSquared" :value="x * x"></ink-var>
```

#### Properties of ink-var:

* **name**: The variable to name to in the state, must follow javascript naming conventions for variables.
* **description**: The variable description, useful for alt-text.
* **value**: The value of the variable.
* **:value**: Function to evaluate to update the value. If present, this will update the value anytime the state is changed.
* **format**: A d3-format string. See the [documentation](https://github.com/d3/d3-format).

## Display Variables

To display an element create an `ink-display`, which will just render the named variable as text.

```html
<ink-display bind="x"></ink-display>
```
