import { IS_CREW_MODE, PROFILE_PICTURE_UPLOAD_SUCCESS, PROFILE_PICTURE_UPLOAD_FAILED, ENABLE_FACEID } from "../../actions/actionTypes";

const initialState = {
    uploadSuccess: true,
    uploadFailed: false,
    uploadResponse: {},
    isFaceId: false,
    isCrewMode: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case PROFILE_PICTURE_UPLOAD_SUCCESS:
            return {
                ...state,
                uploadSuccess: true,
                uploadFailed: false,
                uploadResponse: action.payload
            };
        case PROFILE_PICTURE_UPLOAD_FAILED:
            return {
                ...state,
                uploadSuccess: false,
                uploadFailed: true
            };
        case ENABLE_FACEID:
            return {
                ...state,
                isFaceId: action.payload,
            }
        case IS_CREW_MODE: 
            return {
                ...state,
                isCrewMode: action.payload
            }
        default:
            return state;
    }
}