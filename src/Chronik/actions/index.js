export const CHRONIK_UPDATE_PATHNAME = 'CHRONIK_UPDATE_PATHNAME';

export function navigate(pathname) {
  return function(dispatch) {
    window.history.pushState(null, null, pathname);
    dispatch(setPathname(pathname));
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
