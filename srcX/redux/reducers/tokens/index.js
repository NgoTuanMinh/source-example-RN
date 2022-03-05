const SET_UP_TOKENS = 'SET_TOP_UP_TOKENS';
const BUY_TOKENS_SUCCESS = "BUY_TOKENS_SUCCESS";
const BUY_TOKENS_ERROR = "BUY_TOKENS_ERROR";
const RESET_PAY_TOKEN = "RESET_PAY_TOKEN"
const initialState = {
    topUp: 0,
    //error: null,
}

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_UP_TOKENS:
            return {
                ...state,
                topUp: action.payload
            }
        case BUY_TOKENS_SUCCESS:
            return {
                ...state,
                data: action.payload
            }
        case BUY_TOKENS_ERROR:
            return {
                ...state,
                error: true,
            }
        case RESET_PAY_TOKEN:
            return initialState;
        default:
            return state;
    }
}

export const setUpTokens = payload => ({
    type: SET_UP_TOKENS,
    payload
})