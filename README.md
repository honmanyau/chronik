**This project is no longer maintained and will eventually be achived. While it is extremely unlikely anyone will use this pet project in production, here is the warning: please DO NOT use it in production!**

# Chronik

[![npm package](https://img.shields.io/npm/v/chronik.svg)](https://www.npmjs.org/package/chronik)

>  A simple, no-Context React-Redux client-side router based on the History Web API.

This project began as, and still is, an experiment and learning exercise of how one would implement routing in React-Redux using only the [History Web API](https://developer.mozilla.org/en-US/docs/Web/API/History) and without using [Context](https://facebook.github.io/react/docs/context.html).

Bug reports and constructive feedbacks are welcomed and would be much appreciated.  :)

## Table of Contents

* [Installation](#installation)
  * [NPM Package](#npm-package)
  * [Connect Chronik to the Redux Store](#connect-chronik-to-the-redux-store)
  * [Initialise Chronik as a Component](#initialise-chronik-as-a-component)
* [Quickstart](#quickstart)  
* [Usage](#usage)
  * [`Route` Component](#route-component)
    * [Basic Paths](#basic-paths)
    * [Paths with Parameters](#paths-with-parameters)
    * [Accessing Pathname and Parameters in a Returned Component](#accessing-pathname-and-parameters-in-a-returned-component)
    * [Match the Beginning of a Path](#match-the-beginning-of-a-path)
    * [Excluding a Path](#excluding-a-path)
  * [`Link` Component](#link-component)
  * [`Redirect` Component](#redirect-component)
  * [`NoMatch` Component](#nomatch-component)
  * [Programmatic Navigation](#programmatic-navigation)
* [Code Examples](#code-examples)
  * [Basic Routing](#basic-routing)
  * [Mixing Routes with Fixed Components](#mixing-routes-with-fixed-components)
* [Change Log](#change-log)
* [License](#license)

## Installation

### NPM Package

Chronik is available as an [NPM package](https://www.npmjs.com/package/chronik):

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

Once Chronik is initialised, the `Route` and `Link` components will function anywhere within an app and do not have to be nested inside the `Chronik` component.

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

## Quickstart

```jsx
import { Route, Link, Redirect, navigate } from 'chronik';

// ...

// Match '/blog'
<Route path="/blog" component={<Blog />} />

// Match anything that begins with '/blog/'
<Route path="/blog/*" component={<BlogNavigation />} />

// Match anything that is not '/blog'
<Route not path="/blog" component={<Link href="/blog">Blog</Link>} />

// Create a link to a location within the app (use <a> for external links)
<Link href="/">Home</Link>

// Redirect a user upon rendering
<Redirect to="/" />

// Redirect user if no paths can be matched
<NoMatch redirect='/404' />

// Return component if no paths can be matched
<NoMatch component='<NotFound />' />

// Programmatic navigation (navigate is an action creator, the code below
// assumes that it has been hooked up with react-redux's `connect()`)
handleClick = () => {
  this.props.navigate('/register');
}

<button type="button" onClick={this.handleClick}>Register</button>

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

If the `Route` component returns a component that is not a simple DOM element, the string initially assigned to the `path` prop of the `Route` component and any parameters (if used) are passed into the returned component as a prop called `routed`.  Parameters specified in `path` **must be unique**.

The `routed` prop is an object structured as shown in the example below for a component that is returned by `<Route path="/nummern/:eins/:zwei/:drei" component={<Meowdrei />} />` when visiting `'/nummern/1/2/3'`:

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

#### Match the Beginning of a Path

Return `<Meowthree />` if the current path (`window.location.pathname`) begins with `'/cat/'`:

```jsx
<Route path="/cat/*" component={<Meowthree />} />

```

#### Excluding a Path

The `Route` component accepts an optional `not` prop as a boolean, which causes the `Route` component to match everything **but** the path specified.

```jsx
<Route not path="/" component={<ReturnHomeButton />} />

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

### `Redirect` Component

The `Redirect` component facilitates simple redirection in the render() method of a React component and is mainly intended for conditional rendering.

To use the `Redirect` component, simply import it:

```jsx
import { Redirect } from 'chronik';
```

```jsx
<Redirect to="/" />
```

### `NoMatch` Component

**This is currently an experimental component**.

The `NoMatch` component can be used to either redirect a user or render a component when a path requested cannot be matched to any `Route` component inside the scope of `ReactDOM.render()`.

It should be noted that the `NoMatch` component takes into account of all `Route` components that can potentially be rendered.  For this reason, currently only one `NoMatch` component per-app is recommended and it should be placed as high as possible in the component tree.

Being using the `NoMatch` component by importing it:

```jsx
import { NoMatch } from 'chronik';
```

#### Redirect if No-match

```jsx
<NoMatch redirect='/404' />
```

#### Return Component if No-match

```jsx
<NoMatch component={<NotFound />} />
```

### Programmatic Navigation

A `navigate(path)` action creator is available from the Chronik package for programmatic navigation:

```jsx
import { navigate } from 'chronik';
```

Example usage:

```jsx
import React from 'react';
import { connect } from 'react-redux';

import { navigate } from 'chronik';



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

## Code Examples

### Basic routing

A simple app with three pages: home ('/'), blog ('/blog') and about ('/about').

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Chronik, Route } from 'chronik';

import store from './store';



const Home = () => {
  return(
    <div>Home</div>
  );
};

const Blog = () => {
  return(
    <div>Blog</div>
  );
};

const About = () => {
  return(
    <div>About</div>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <Chronik>
      <Route path="/" component={<Home />} />
      <Route path="/blog" component={<Blog />} />
      <Route path="/about" component={<About />} />
    </Chronik>
  </Provider>,
  document.getElementById('root')
);
```

### Mixing Routes with Fixed Components

This is an extension of the basic example above, with fixed elements (header and footer) that is rendered on all three pages mixed in.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Chronik, Route } from 'chronik';

import store from './store';



const Header = () => {
  return(
    <div>Header</div>
  );
};

const Footer = () => {
  return(
    <div>Footer</div>
  );
};

const Home = () => {
  return(
    <div>Home</div>
  );
};

const Blog = () => {
  return(
    <div>Blog</div>
  );
};

const About = () => {
  return(
    <div>About</div>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <Chronik>
      <Header />
      <Route path="/" component={<Home />} />
      <Route path="/blog" component={<Blog />} />
      <Route path="/about" component={<About />} />
      <Footer />
    </Chronik>
  </Provider>,
  document.getElementById('root')
);
```

### Redirect User by Conditional Rendering

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Redirect } from 'chronik';

import store from './store';



class SignIn extends React.Component {
  render() {
    const { authenticated } = this.props;

    if (authenticated) {
      return <Redirect to="/dashboard" />
    }

    return(
      <form>
        <!-- Sign in form -->
      </form>
    );
  }

  const mapStateToProps = (state) => {
    return {
      authenticated: state.authenticated
    }
  };

  export default connect(mapStateToProps, null)(SignIn);
}
```

## Changelog

Chronik uses [semantic versioning](http://semver.org/).

* **1.0.0**—Released Chronik!
* **1.0.1**—Added code examples to README.md.  Added license.
* **1.1.0**—Optional `not` prop is now available to the `Route` component; which causes a `Route` element to match all **but** the `path` specified.
* **1.2.0**—The `Route` component can now perform a "begins-with" match if the string specified for its `path` prop has a trailing asterisk.
* **1.2.1**—README.md fixes.
* **1.3.0**—Added `NoMatch` component.
* **1.3.1**—README.md fixes.
* **1.3.2**—Minor README.md edits: added `NoMatch` to the Quickstart guide, minor edits.
* **1.3.3**—Fixed incorrectly scoped return statement in the `Route` component, which lead a component associated with a `not` route to be briefly rendered on page load.  Fixed `PropType` for `children` to accommodate non-string `children`.
* **1.4.0**—Added `Redirect` component and the corresponding sections in README.md. Fixed incorrect code in README.md.

## License

[MIT](https://github.com/honmanyau/chronik/blob/master/LICENSE)
