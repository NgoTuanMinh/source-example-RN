const LOAD_CARDS = 'LOAD_ACCOUNT_CARDS';
const SET_CUR_CARD = 'SET_CURRENT_CARD';
const GET_WALLETS_SUCCESS = 'GET_WALLETS_SUCCESS';
const PAIR_WALLET_SUCCESS = "PAIR_WALLET_SUCCESS";
const PAIR_WALLET_FAILED = "PAIR_WALLET_FAILED"
const GET_CONTACTS_SUCCESS = "GET_CONTACTS_SUCCESS";
const ADD_CONTACTS_EVENTX = 'ADD_CONTACTS_EVENTX'
const TOKEN_CONVERSION_SUCCESS = "TOKEN_CONVERSION_SUCCESS";
const GET_PAIRED_WEARABLES = "GET_PAIRED_WEARABLES";
const ADD_RESET_CONTACTS = 'ADD_RESET_CONTACTS';

const RESPONSE_PAIR_WEARBLES = "RESPONSE_PAIR_WEARBLES"
const initialState = {
    loaded: true,
    loading: false,
    currentCardId: 0,
    cards: [],
    dataWallet: [],
    contacts: {
        evtxContacts: [],
        unEvtxContacts: [],
    },
    conversionRate: 1,
    pairables: [],
    responsePairWearables: null
}


export default (state = initialState, action = {}) => {
    switch (action.type) {
        case LOAD_CARDS:
            return {
                ...state,
                cards: action.payload,
            }
        case SET_CUR_CARD:
            return {
                ...state,
                currentCardId: action.payload
            }
        case GET_WALLETS_SUCCESS:
            return {
                ...state,
                dataWallet: action.payload,
                cards: action.payload
            }
        case PAIR_WALLET_SUCCESS:
            return {
                ...state,
                pairwallet: action.payload,
                pairwalletSuccess: true,
                pairwalletFailed: false
            }
        case PAIR_WALLET_FAILED:
            return {
                ...state,
                pairwallet: action.payload,
                pairwalletSuccess: false,
                pairwalletFailed: true
            }
        case GET_PAIRED_WEARABLES: {
            return {
                ...state,
                pairables: action.payload
            }
        }
        case GET_CONTACTS_SUCCESS:
            return {
                ...state,
                contacts: action.payload
            }
        case ADD_CONTACTS_EVENTX: {
            return {
                ...state,
                contacts: {
                    evtxContacts: state.contacts.evtxContacts.concat(action.payload.evtxContacts).sort(sortByName),
                    unEvtxContacts: state.contacts.unEvtxContacts.concat(action.payload.unEvtxContacts).sort(sortByName),
                }
            }
        }
        case ADD_RESET_CONTACTS: {
            return {
                ...state,
                contacts: {
                    ...initialState.contacts,
                }
            }
        }
        case TOKEN_CONVERSION_SUCCESS:
            return {
                ...state,
                conversionRate: action.payload
            }
        case RESPONSE_PAIR_WEARBLES:
            return {
                ...state,
                responsePairWearables: action.payload
            }
        default:
            return state
    }

}


export const loadCards = (payload) => {
    retuern({
        type: LOAD_CARDS,
        payload
    })
}
export const setCurrentCard = (payload) => {
    return ({
        type: SET_CUR_CARD,
        payload
    })
}

const sortByName = (contact1, contact2) => {
    try {
        let nameContact1 = contact1.givenName ? contact1.givenName : contact1.familyName;
        let nameContact2 = contact2.givenName ? contact2.givenName : contact2.familyName;
        return nameContact1.localeCompare(nameContact2);
    } catch (error) {
        return -1;
    }

}