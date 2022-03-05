const SEND_TRANSACTIONS = 'SEND_TRANSACTIONS';
const TOGGLE_LOADING_TRANSACTIONS = "TOGGLE_LOADING_TRANSACTIONS";
const LOAD_DATA = "LOAD_DATA"

const initialState = {
    data: [],
    page: 1,
    limit: 10,
    isLoadingMore: false,
    pages: 1,
    isLoading: false,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_DATA:
            return {
                ...initialState,
                isLoading: !state.isLoading,
                isLoadingMore: false,
            }
        case TOGGLE_LOADING_TRANSACTIONS:
            return {
                ...state,
                isLoadingMore: !state.isLoading,
                isLoading: false,
            }
        case SEND_TRANSACTIONS:
            const newState = {
                ...state,
                pages: action.payload.totalPages,
                isLoadingMore: false,
                isLoading: false,
                page: state.page + 1
            }
            if (action.payload && action.payload.page == 1) {
                return {
                    ...newState,
                    data: action.payload.docs
                }
            }
            return {
                ...newState,
                data: state.data.concat(action.payload.docs),
            }
        default:
            return state;
    }
}