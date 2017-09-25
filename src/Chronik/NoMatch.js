import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { navigate } from './actions';



class NoMatch extends React.Component {
  componentWillReceiveProps(nextProps) {
    const {component, redirect} = this.props;
    const {attempted, unresolved} = nextProps.chronik;

    if (attempted.length !== 0 && unresolved.length !== 0) {
      const {component, navigate, redirect} = this.props;
      if (redirect && !component && this.noMatch(nextProps)) {
        navigate(redirect, 'noMatch');
      }
    }
  }

  noMatch = (props) => {
    const {attempted, unresolved} = props.chronik;
    const initialising = attempted.length === 0 && unresolved.length === 0;
    const noMatch = JSON.stringify(attempted.sort()) === JSON.stringify(unresolved.sort());
    if (!initialising && noMatch) {
      return true;
    }

    return false;
  }

  render() {
    const {component, redirect} = this.props;

    if (component && redirect) {
      console.log('The NoMatch component of Chronik aceepts either a redirect or a component prop, not both.')
    }

    if (component && !redirect && this.noMatch(this.props)) {
      return component;
    }

    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    chronik: state.chronik
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (pathname, noMatch = null) => dispatch(navigate(pathname, noMatch))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NoMatch);
