import { GET_NATIONALITY_SUCCESS } from '../../actions/actionTypes';

const initialState = {
  nationalities: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_NATIONALITY_SUCCESS:
      return {
        nationalities: action.payload
      };

    default:
      return state;
  }
}