import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';



class Route extends React.Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    component: PropTypes.element.isRequired,
    chronik: PropTypes.object.isRequired,
  };

  render() {
    const {path, component, chronik} = this.props;
    const isDOMElement = typeof component.type === 'function';
    const routed = {pathname: null, params: {}};
    let matched = false;

    // chroink.pathname is initially null as specified in ./reducers
    if (chronik.pathname && component) {
      // Remove trailing '/'
      const cPath = chronik.pathname;
      const referencePath = path.length > 1 ? path.replace(/\/$/, '') : path;
      const requestedPath = cPath.length > 1 ? cPath.replace(/\/$/, '') : cPath;

      // Handle paths with no variable parameters
      if (referencePath.indexOf('/:') < 0) {
        if (requestedPath === referencePath) {
          routed.pathname = requestedPath;
          matched = true;
        }
      }
      // Handle paths with variable parameters
      else if (referencePath.indexOf('/:') >= 0) {
        const referencePathArray = referencePath.split('/');
        const requestedPathArray = requestedPath.split('/');
        const mismatch = referencePathArray.slice(1, referencePathArray.length).filter((item, index) => {
          if (item[0] === ':') {
            routed.params[item.slice(1, item.length)] = requestedPathArray[index + 1];
            return false;
          }

          return item[0] !== ':' && item !== requestedPathArray[index + 1];
        });

        if (mismatch.length === 0 && referencePathArray.length === requestedPathArray.length) {
          routed.pathname = requestedPath;
          matched = true;
        }
      }
    }

    if (matched) {
      return (
        <component.type
          {...Object.assign({}, {...component.props}, isDOMElement ? {routed} : {})}
        />
      );
    }

    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    chronik: state.chronik
  }
};

export default connect(mapStateToProps, null)(Route);
