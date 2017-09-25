export const CHRONIK_UPDATE_PATHNAME = 'CHRONIK_UPDATE_PATHNAME';
export const ADD_ATTEMPTED_PATHNAME = 'ADD_ATTEMPTED_PATHNAME';
export const ADD_UNRESOLVED_PATHNAME = 'ADD_UNRESOLVED_PATHNAME';
export const REINITIALISE_ATTEMPTED_AND_UNRESOLVED = 'REINITIALISE_ATTEMPTED_AND_UNRESOLVED';

export function navigate(pathname, noMatch = null) {
  return function(dispatch) {
    if (noMatch) {
      window.history.replaceState(null, null, pathname);
      dispatch(setPathname(pathname));
    }
    else if (!noMatch) {
      window.history.pushState(null, null, pathname);
      dispatch(setPathname(pathname));
    }
    dispatch(reinitialiseAttemptedAndUnresolved());
  }
}

export function setPathname(pathname) {
  return {
    type: CHRONIK_UPDATE_PATHNAME,
    payload: {
      pathname
    }
  }
}

export function addAttemptedPathname(pathname) {
  return {
    type: ADD_ATTEMPTED_PATHNAME,
    payload: {
      pathname
    }
  }
}

export function addUnresolvedPathname(pathname) {
  return {
    type: ADD_UNRESOLVED_PATHNAME,
    payload: {
      pathname
    }
  }
}

export function reinitialiseAttemptedAndUnresolved() {
  return {
    type: REINITIALISE_ATTEMPTED_AND_UNRESOLVED
  }
}
