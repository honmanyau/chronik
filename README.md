# Chronik 1.0.0

>  A simple, no-Context React-Redux client-side router based on the History Web API.

This project began as, and still is, an experiment and learning exercise of how one would implement routing in React-Redux using only the [History Web API](https://developer.mozilla.org/en-US/docs/Web/API/History) and without using [Context](https://facebook.github.io/react/docs/context.html).

Bug reports and constructive feedbacks are welcomed and would be much appreciated.  :)

## Table of Contents

* [Installation](#installation)
  * [NPM Package](#npm-package)
  * [Connect Chronik to the Redux Store](#connect-chronik-to-the-redux-store)
  * [Initialise Chronik as a Component](#initialise-chronik-as-a-component)
* [Usage](#usage)
  * [`Route` Component](#route-component)
    * [Basic Paths](#basic-paths)
    * [Paths with Parameters](#paths-with-parameters)
    * [Accessing Pathname and Parameters in a Returned Component](#accessing-pathname-and-parameters-in-a-returned-component)
  * [`Link` Component](#link-component)
  * [Programmatic Navigation](#programmatic-navigation)


## Installation

### NPM Package

Chronik is available as a NPM package:

```sh
npm install --save chronik
```

### Connect Chronik to the Redux Store

```jsx
// src/store.js

import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reducer as chronik } from 'chronik';



const reducer = combineReducers({
  chronik,
  otherReducers
});

const store = createStore(
  reducer,
  applyMiddleware(thunk)
);

export default store;
```

### Initialise Chronik as a Component

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Chronik } from 'chronik';

import store from './store';



ReactDOM.render(
  <Provider store={store}>
    <Chronik />
  </Provider>,
  document.getElementById('root')
);
```
If style is of concern, children inside the `Chronik` component are rendered normally:

```jsx
ReactDOM.render(
  <Provider store={store}>
    <Chronik>
      // Children
    </Chronik>
  </Provider>,
  document.getElementById('root')
);
```

## Usage

### `Route` Component

The `Route` component accepts a compulsory `path` prop as a string.  If this reference string matches that of browser (`window.location.pathname`), the element specified in the compulsory prop `component` will be rendered.

It should be noted that the `Route` component matches the string provided to the `path` prop **exactly**—that is, for `path='/cat/subcat'`, `'/cat/subcat'` is the **only** match; in contrast, `'/cat'` is **not** a match.


The `Route` component is connected to the Redux store set up above and be used anywhere in an application simply by importing it:

```jsx
import { Route } from 'chronik';

```

#### Basic Paths

Return `<Meow />` if the current path (`window.location.pathname`) is **exactly** `'/cat'`:

```jsx
<Route path="/cat" component={<Meow />} />

```

#### Paths with Parameters

Return `<Meowtwo />` if the current path (`window.location.pathname`) is **exactly** `'/cat/' + variable`:

```jsx
<Route path="/cat/:subcat" component={<Mewotwo />} />

```

#### Accessing Pathname and Parameters in a Returned Component

If the `Route` component returns a component that is not a simple DOM element, the string initially assigned to the `path` prop of the `Route` component and any parameters (if used) are passed into the returned component as a prop called `routed`.

The `routed` prop is an object, in JSON format, structured as follows for a component that is returned by `<Route path="/nummern/:eins/:zwei/:drei" component={<Meowdrei />} />` when visiting `'/nummern/1/2/3'`:

```
// the routed prop inside <Meowdrei />

{
  routed: {
    pathname: /nummern/1/2/3,
    params: {
      eins: 1,
      zwei: 2,
      drei: 3
    }
  }
}
```

An illustrative example that yields 'Received `42` cats from `/cat/42`.' when the client navigates to `/cat/42`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Chronik } from 'chronik';

import store from './store';



const Meow = ({routed}) => {
  const {params, pathname} = routed;

  return (
    <div>
      Received <code>{params.amount}</code> cats from <code>{pathname}</code>.
    </div>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <Chronik>
      <Route path="/cat/:amount" component={<Meow />} />
    </Chronik>
  </Provider>,
  document.getElementById('root')
);

```

### `Link` Component

The `Link` component provides a means to navigate within an app that is consistent with the behaviour typically expected of a React app, while maintaining typical browser behaviour (using the forward/backward buttons, in particular).

For internal links, the `Link` component should be used in place of the anchor DOM element (`<a>`) unless the default behaviour of `<a>` is desired.

To use the `Link` component, simply import it:

```jsx
import { Link } from 'chronik';
```

Creating a hyperlink with the `Link` component is effectively the same as using the anchor DOM element:

```jsx
<Link href="/cat">Cat</Link>
```

### Programmatic Navigation

A `navigate(path)` action creator is available from the Chronik package for programmatic navigation:

```
import { navigate } from 'chronik';
```

Example usage:

```
import React from 'react';
import { connect } from 'react-redux';

import { navigate } from './node_modules';



class Register extends React.Component {
  handleButtonClick = () => {
    this.props.navigate('/register');
  }

  render() {
    return (
      <button type="button" onClick={this.handleButtonClick}>Register</button>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (pathname) => dispatch(navigate(pathname))
  }
}

export default connect(null, mapDispatchToProps)(Register);

```

The `window.history.go()` and `window.history.back()` methods of the History Web API are also fully compatible with Chronik.

In use cases where Chronik's `navigate()` or the History Web API's `window.history.go()` and `window.history.back()` are not applicable, Chronik-compatible programmatic navigation can be achieved by doing **both** of the following:

* Change the browser's URL with `window.history.pushState()` to the desired path
* Dispatch an action to modify `state.chronik.pathname` in the Redux store
