import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { navigate } from './actions';



class Link extends React.Component {
  static propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.string.isRequired
  };

  handleClick = (event) => {
    event.preventDefault();

    this.props.navigate(this.props.href);
  }

  render() {
    const {navigate, children, href, routed, ...rest} = this.props;

    return (
      <a href={href} {...rest} onClick={this.handleClick}>{children}</a>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (pathname) => dispatch(navigate(pathname))
  }
};

export default connect(null, mapDispatchToProps)(Link);
