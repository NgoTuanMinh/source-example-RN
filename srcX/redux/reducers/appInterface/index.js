const OPEN_NAV = 'OPEN_X_NAV';
const CLOSE_NAV = 'CLOSE_X_NAV';

const initailState = {
    isNavOpen: false
}

export default (state = initailState, action = {}) => {
    switch (action.type) {
        case OPEN_NAV:
            return {
                ...state,
                isNavOpen: true,
            }
            
        case CLOSE_NAV:
            return {
                ...state,
                isNavOpen: false
            }
    
        default:
            return state
    }
}

export const openXNav = payload => ({
    type: OPEN_NAV,
    payload
})

export const closeXNav = payload => ({
    type: CLOSE_NAV,
    payload
})