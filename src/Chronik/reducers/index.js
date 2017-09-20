import { CHRONIK_UPDATE_PATHNAME } from '../actions';



const initialState = {
  pathname: null
};

export default function chronik(state = initialState, action) {
  switch(action.type) {
    case CHRONIK_UPDATE_PATHNAME:
      return Object.assign({}, state, {
        pathname: action.payload.pathname
      });

    default:
      return state;
  }
}
