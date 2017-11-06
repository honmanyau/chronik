import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { navigate } from './actions';



class Redirect extends React.Component {
  static propTypes = {
    to: PropTypes.string.isRequired
  };

  componentDidMount() {
    const { navigate, to } = this.props;

    navigate(to, 'replace');
  }

  render() {
    return null;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (pathname) => dispatch(navigate(pathname))
  }
};

export default connect(null, mapDispatchToProps)(Redirect);
