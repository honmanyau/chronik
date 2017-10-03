import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ChronikActions from './actions';



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

  componentWillReceiveProps(nextProps) {
    if (this.props.chronik.pathname !== nextProps.chronik.pathname) {
      const {addAttemptedPathname, addUnresolvedPathname} = this.props.actions;

      addAttemptedPathname(nextProps.path);

      if(this.matchPath(nextProps)) {
        addUnresolvedPathname('');
      }
      else {
        addUnresolvedPathname(nextProps.path);
      }
    }
  }

  removeTrailingSlash = (path) => {
    return path.length > 1 ? path.replace(/\/$/, '') : path;
  }

  returnLeadingPath = (path) => {
    return path.endsWith('*') ? path.replace(/\/\*$/, '/') : null;
  }

  matchPath = (props) => {
    const {not, path, component, chronik} = props;

    this.returnComponent = false;
    this.routed = {pathname: null, params: {}};

    let matched = null;

    // chroink.pathname is initially null as specified in ./reducers
    if (chronik.pathname && component) {
      const referencePath = this.removeTrailingSlash(path);
      const requestedPath = this.removeTrailingSlash(chronik.pathname);
      const leadingReferencePath = this.returnLeadingPath(referencePath);
      const matchSuccess = () => {
        this.routed.pathname = requestedPath;
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
            this.routed.params[item.slice(1, item.length)] = requestedPathArray[index];
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

      return this.returnComponent = (!not && matched) || (not && !matched);
    }
  }

  render() {
    this.matchPath(this.props);

    const {returnComponent, routed} = this;
    const {component} = this.props;
    const isDOMElement = typeof component.type !== 'function';
    if (returnComponent) {
      return (
        <component.type
          {...Object.assign({}, {...component.props}, isDOMElement ? {} : {routed})}
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

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(ChronikActions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Route);
