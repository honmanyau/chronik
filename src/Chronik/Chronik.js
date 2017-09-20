import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ChronikActions from './actions/';



class Chronik extends React.Component {
  static propTypes = {
    chronik: PropTypes.object.isRequired,
    actions: PropTypes.objectOf(PropTypes.func).isRequired,
    children: PropTypes.node
  };

  componentWillMount() {
    // Check window.location.pathname on load, refresh, or user-entered URL.
    // Note that this does not handle navigation caused by forward/backward
    // browser button presses and anchor navigations.
    window.addEventListener('load', this.setPathname, false);
    // Event listener for handling re-rendering on back/forward browser button clicks
    window.addEventListener('popstate', this.setPathname, false);
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.setPathname, false);
    window.removeEventListener('popstate', this.setPathname, false);
  }

  setPathname = () => {
    this.props.actions.setPathname(window.location.pathname);
  }

  render() {
    return (
      <div>{this.props.children}</div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    chronik: state.chronik
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(ChronikActions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Chronik);
