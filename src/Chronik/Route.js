import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';



class Route extends React.Component {
  static propTypes = {
    not: PropTypes.bool,
    path: PropTypes.string.isRequired,
    component: PropTypes.element.isRequired,
    chronik: PropTypes.object.isRequired,
  };

  static defaultProps = {
    not: false
  };

  removeTrailingSlash = (path) => {
    return path.length > 1 ? path.replace(/\/$/, '') : path;
  }

  returnLeadingPath = (path) => {
    return path.endsWith('*') ? path.replace(/\/\*$/, '/') : null;
  }

  render() {
    const {not, path, component, chronik} = this.props;
    const isDOMElement = typeof component.type === 'function';
    const routed = {pathname: null, params: {}};
    let matched = false;

    // chroink.pathname is initially null as specified in ./reducers
    if (chronik.pathname && component) {
      const referencePath = this.removeTrailingSlash(path);
      const requestedPath = this.removeTrailingSlash(chronik.pathname);
      const leadingReferencePath = this.returnLeadingPath(referencePath);
      const matchSuccess = () => {
        routed.pathname = requestedPath;
        matched = true;
      }

      // Handle paths with no variable parameters
      if (referencePath.indexOf('/:') < 0) {
        if (requestedPath === referencePath) {
          matchSuccess();
        }
        else if (requestedPath.length > 1 && requestedPath.startsWith(leadingReferencePath)) {
          matchSuccess();
        }
      }
      // Handle paths with variable parameters
      else if (referencePath.indexOf('/:') >= 0) {
        const referencePathArray = referencePath.split('/').slice(1);
        const requestedPathArray = requestedPath.split('/').slice(1);

        const mismatch = referencePathArray.filter((item, index) => {
          if (item === '*' && index === referencePathArray.length - 1) {
            return false;
          }

          if (item[0] === ':') {
            // Store the value of the parameter in routed
            routed.params[item.slice(1, item.length)] = requestedPathArray[index];
            return false;
          }

          return item[0] !== ':' && item !== requestedPathArray[index];
        });

        if (mismatch.length === 0 && requestedPathArray[0] !== "") {
          if (referencePathArray.length === requestedPathArray.length) {
            matchSuccess();
          }
          else if (referencePathArray[referencePathArray.length - 1] === '*' && referencePathArray.length <= requestedPathArray.length) {
            matchSuccess();
          }
        }
      }
    }

    if (!not && matched || not && !matched) {
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
