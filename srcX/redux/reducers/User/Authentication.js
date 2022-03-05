const AUTH = 'VERIFY_USER';

const initialState = {
    isAuth: false
}

export default function( state = initialState, action) {
    switch (action.type) {
        case AUTH:
            return {
                ...state,
                isAuth: true,
            };
    
        default:
            return state;
    }
}

export const authenticated = function(){
    return {
        type: AUTH
    }
}