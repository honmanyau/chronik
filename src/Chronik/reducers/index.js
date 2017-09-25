import {
  CHRONIK_UPDATE_PATHNAME,
  ADD_ATTEMPTED_PATHNAME,
  ADD_UNRESOLVED_PATHNAME,
  REINITIALISE_ATTEMPTED_AND_UNRESOLVED
} from '../actions';



const initialState = {
  pathname: null,
  attempted: [],
  unresolved: []
};

export default function chronik(state = initialState, action) {
  switch(action.type) {
    case CHRONIK_UPDATE_PATHNAME:
      return Object.assign({}, state, {
        pathname: action.payload.pathname
      });

    case ADD_ATTEMPTED_PATHNAME:
      const attempted = JSON.parse(JSON.stringify(state.attempted));

      attempted.push(action.payload.pathname);

      return Object.assign({}, state, {
        attempted
      });

    case ADD_UNRESOLVED_PATHNAME:
      const unresolved = JSON.parse(JSON.stringify(state.unresolved));

      unresolved.push(action.payload.pathname);

      return Object.assign({}, state, {
        unresolved
      });

    case REINITIALISE_ATTEMPTED_AND_UNRESOLVED:
      return Object.assign({}, state, {
        attempted: [],
        unresolved: []
      });

    default:
      return state;
  }
}
