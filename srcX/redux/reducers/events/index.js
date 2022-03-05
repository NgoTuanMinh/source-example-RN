import { TOGGLE_LOADING_EVENTS, LOAD_DATA_EVENT, SET_NUMBER_MY_TICKET, SET_NUMBER_SALE_TICKET, FOCUS_MY_TICKET, SHOW_SCAN_TICKET, FOCUS_WALLET } from '../../actions/actionTypes';

const initialState = {
    data: [],
    page: 1,
    limit: 10,
    isLoadingMore: false,
    pages: 1,
    isLoading: false,
    numberMyTicket: 0,
    numeberSale: 0,
    focusMyTickets: true,
    showScanTicket: true,
    focusWallet: true
}

export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_DATA_EVENT:
            return {
                ...initialState,
                isLoading: !state.isLoading,
                isLoadingMore: false,
            }
        case TOGGLE_LOADING_EVENTS:
            return {
                ...state,
                isLoadingMore: true,
                isLoading: false,
            }
        case SET_NUMBER_MY_TICKET:
            return { ...state, numberMyTicket: action.payload };
        case SET_NUMBER_SALE_TICKET:
            return { ...state, numeberSale: action.payload };
        case FOCUS_MY_TICKET:
            return {
                ...state,
                focusMyTickets: action.payload
            }
        case FOCUS_WALLET: 
            return {
                ...state,
                focusWallet: !state.focusWallet
            }
        case SHOW_SCAN_TICKET:
            return {
                ...state,
                showScanTicket: action.payload
            }
        
        default:
            return state;
    }
}