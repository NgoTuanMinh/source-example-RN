import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Platform } from "react-native";
import { activeWearables } from "../../redux/actions/index";
import Bugfender from "@bugfender/rn-bugfender";
import { translate } from "../../../App";
import ResultScanQrcodeComponent from "../../components/LinkScan/ResultScanQrcodeComponent";
import NavigationService from "../../NavigationService";
import ErrorCode from "../../constants/ErrorCode";

const ResultScanQrcodeScreen = (props) => {
  const { navigation, activeWearables } = props;
  const tagId = navigation.state.params.tagId;
  // isSuccess : 1 success, 2 fail, 3 unknow
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfirmActive, setShowConfirmActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState("");
  useEffect(() => {
    const params = navigation.state.params;
    console.log("Wearable=== active", params.wearable);
    if (params.wearable && !params.wearable.active) setShowConfirmActive(true);
    let success = false;
    let reason = translate("Some_Thing_Wrong");
    console.log("Params=====", params);
    if (params && params.ErrorCode) {
      success = false;
      if (params.ErrorCode == ErrorCode.Wearable_NotFound)
        reason = translate("Unknow_QRCode");
      else if (params.ErrorCode == ErrorCode.Wearable_OtherInUse)
        reason = `${translate("Wearable_Device")} ${params.tagId} ${translate(
          "Wearable_Already_Use_Other_Phone"
        )}`;
      else if (params.statusCode == ErrorCode.Wearable_AlreadyInUse)
        reason = `${translate("Wearable_Device")} ${params.tagId} ${translate(
          "Wearable_Already_User_This_Phone"
        )}`;
    } else {
      success = true;
      reason = `${translate("Wearable_Device")} ${params.tagId} ${translate(
        "Weaable_Ready_For_Use"
      )}`;
    }
    setIsSuccess(success);
    setReason(reason);
  }, []);

  const onCloseActiveConfirmModal = () => {
    setShowConfirmActive(false);
  };

  const activeWearable = async () => {
    onCloseActiveConfirmModal();
    setIsLoading(true);
    activeWearables(tagId, onActiveResponse);
  };

  const onActiveResponse = () => {
    setIsLoading(false);
  };

  const onBackPress = () => {
    NavigationService.goBack();
  };

  return (
    <ResultScanQrcodeComponent
      isSuccess={isSuccess}
      reason={reason}
      onBackPress={onBackPress}
      navigation={navigation}
      showConfirmActive={showConfirmActive}
      onCloseActiveConfirmModal={onCloseActiveConfirmModal}
      onActivePress={activeWearable}
      isLoading={isLoading}
    />
  );
};

ResultScanQrcodeScreen.navigationOptions = {
  title: "",
  headerShown: false,
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({
  activeWearables,
});

export default connect(
  mapStateToProps,
  { activeWearables }
)(ResultScanQrcodeScreen);
