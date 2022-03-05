const initialState = {
  dataNotifications: [],
  isLoading: false,
  limit: 10,
  page: 1,
  pages: 1,
  numUnread: 0,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'IS_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    case 'NUM_UNREAD':
      return {
        ...state,
        numUnread: action.payload
      }
    case 'MINUS_NUM_UNREAD':
      return {
        ...state,
        numUnread: state.numUnread > 0 ? state.numUnread - 1 : 0
      }
    case 'GET_NOTIFICATIONS_SUCCESS':
      let newState = {
        ...state,
        limit: action.payload.limit,
        page: action.payload.page,
        pages: action.payload.totalPages,
        isLoading: false,
      }
      if (action.payload.page == 1) {
        return {
          ...newState,
          dataNotifications: action.payload.docs,
        }
      }

      return {
        ...newState,
        dataNotifications: state.dataNotifications.concat(action.payload.docs),

      }
    case 'GET_NOTIFICATIONS_FAILED':
      return {
        ...state,
        notificationsFailed: true,
        isLoading: action.payload,
      }
    case 'IS_SEE':
      return {
        ...state,
        dataNotifications: state.dataNotifications.map(item => {
          if (item.id == action.payload) {
            return { ...item, read: true }
          }
          return item;
        }),
      }
    case 'IS_SEE_TRANSFER':
      return {
        ...state,
        dataNotifications: state.dataNotifications.map(item => {
          if (item._id == action.payload.id) {
            return { ...item, read: true, metaData: {...item.metaData, status: action.payload.statusTransfer}  }
          }
          return item;
        }),
      }
    case 'PLUS_NUM_UNREAD':
      return {
        ...state,
        numUnread: state.numUnread + 1
      }
    default:
      return state;
  }
}