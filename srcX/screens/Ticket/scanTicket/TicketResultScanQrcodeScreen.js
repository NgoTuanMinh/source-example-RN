import React, { useState, useEffect } from "react";
import { translate } from "../../../../App";
import ResultScanQrcodeComponent from "../../../components/Ticket/scanTicket/ResultScanQrcodeComponent";
import NavigationService from "../../../NavigationService";
import { connect } from "react-redux";
import { setShowScanTicket } from "../../../redux/actions";
import { getErrorByCode } from "../../../halpers/utilities";
import { BackHandler } from "react-native";

const TicketResultScanQrcodeScreen = (props) => {
  const { navigation, setShowScanTicket } = props;
  const ticketId = navigation.state.params.ticketId;
  const [isSuccess, setIsSuccess] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const params = navigation.state.params;
    let isSuccess = false;
    let reason = "";
    if (params) {
      isSuccess = params.success;
      reason = getErrorByCode(params.ErrorCode);
    }

    setIsSuccess(isSuccess);
    setReason(reason.toUpperCase());
  }, []);

  const onBackPress = () => {
    setShowScanTicket(true);
    NavigationService.goBack();
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, []);

  return (
    <ResultScanQrcodeComponent
      isSuccess={isSuccess}
      onBackPress={onBackPress}
      navigation={navigation}
      ticketId={ticketId}
      reason={reason}
    />
  );
};

TicketResultScanQrcodeScreen.navigationOptions = {
  title: "",
  headerShown: false,
};

const mapStateToProps = (state) => {
  return {};
};

export default connect(
  mapStateToProps,
  { setShowScanTicket }
)(TicketResultScanQrcodeScreen);
