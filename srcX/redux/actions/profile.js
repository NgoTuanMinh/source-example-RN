import API, { fetchApi, uploadFile } from "./api";
import {
  PROFILE_PICTURE_UPLOAD_SUCCESS,
  PROFILE_PICTURE_UPLOAD_FAILED,
  ENABLE_FACEID,
  IS_CREW_MODE,
} from "./actionTypes";
import { getDataKeystore } from "./keyStore";
import { getProfileSuccess } from "../reducers/Registration";

const profileUploadSuccess = (payload) => ({
  type: PROFILE_PICTURE_UPLOAD_SUCCESS,
  payload,
});

const profileUploadFailed = (payload) => ({
  type: PROFILE_PICTURE_UPLOAD_FAILED,
  payload,
});

const getProfile = async (publicKey) => {
  const url = `${API.CREATE_ACCOUNT}/${publicKey}`;
  return await fetchApi(url, "GET");
};

const postProfilePicture = async (formdata, id) => {
  const url = `${API.CREATE_ACCOUNT}/${id}/upload-image`;
  return await uploadFile(url, "PATCH", formdata);
};

const uploadProfilePicture = (image) => async (dispatch) => {
  try {
    const userId = await getDataKeystore("@userId");
    console.log("iamge data", image);
    const fileName =
      Platform.OS === "ios"
        ? image["filename"]
        : image["path"]
            .split("\\")
            .pop()
            .split("/")
            .pop();
    const upload_body = {
      uri: image["path"],
      type: image["mime"],
      name: fileName,
    };

    let formdata = new FormData();
    formdata.append("image", upload_body);
    const response = await postProfilePicture(formdata, userId);
    if (response.success) {
      console.log("Upload data successfully===", response);
      dispatch(profileUploadSuccess(response.data));
    } else {
      console.log("Upload data error===", response.data);
      dispatch(profileUploadFailed(response.data.Error));
    }
  } catch (error) {
    dispatch(profileUploadFailed(error));
  }
};

const getProfileDetails = () => async (dispatch) => {
  try {
    const publicKey = await getDataKeystore("@publicKey");
    if (publicKey) {
      const crewMode = await getDataKeystore("@isCrewMode");
      console.log("CrewMode====", crewMode);
      dispatch(actionCrewMode(crewMode ? true : false));
      const profileResponse = await getProfile(publicKey);
      if (profileResponse.success) {
        const profile = profileResponse.data;
        dispatch(profileUploadSuccess(profile));
        dispatch(getProfileSuccess(profile));
      }
    }
  } catch (error) {
    dispatch(profileUploadFailed(error));
  }
};

const actionFaceId = (payload) => ({
  type: ENABLE_FACEID,
  payload,
});

const actionCrewMode = (payload) => ({
  type: IS_CREW_MODE,
  payload,
});

const toggleFaceId = (payload) => async (dispatch) => {
  dispatch(actionFaceId(payload));
};

const setCrewMode = (payload) => async (dispatch) => {
  dispatch(actionCrewMode(payload));
};

export { uploadProfilePicture, getProfileDetails, toggleFaceId, setCrewMode };
