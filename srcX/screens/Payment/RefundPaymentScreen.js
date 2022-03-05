import React, { useEffect, useState, useContext } from "react";
import { View, Linking, Alert } from "react-native";
import { connect } from "react-redux";
import RefundPaymentComponent from "../../components/Payment/RefundPaymentComponent";
import {
  refundToken,
  resetPaymentToken,
  verifyEmailUrl,
} from "../../redux/actions/index";
import { bindActionCreators } from "redux";
import NavigationService from "../../NavigationService";
import { translate } from "../../../App";
import CardType from "../../constants/CardType";
import { convertTokensToCurrency } from "../../halpers/utilities";

const initData = [
  {
    title: "Token Refund Overview",
    number: 0,
    subTotal: 0,
    fee: 0,
    total: 0,
  },
];

const RefundPaymentScreen = (props) => {
  const { navigation, user } = props;
  const { conversionRate } = props.wallets;
  const selectedData = navigation.state.params.selectedData;
  const payinId = navigation.state.params.payinId;
  const fee = navigation.state.params.fee;
  const subTotal = convertTokensToCurrency(selectedData, conversionRate);

  const [email, setEmail] = useState(user.email ? user.email : "");
  const [dataOrderDetail, setDataOrderDetail] = useState(initData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDataOrderDetail([
      {
        title: "Tokens",
        // title: "EVX Tokens",
        number: selectedData,
        subTotal: subTotal,
        fee: fee,
        total: subTotal - fee,
      },
    ]);
  }, []);

  useEffect(() => {
    Linking.getInitialURL().then((url) => getPassCode(url));
    Linking.addEventListener("url", handleDeepLink);
    return () => {
      Linking.removeEventListener("url", handleDeepLink);
    };
  }, []);

  const handleDeepLink = ({ url }) => {
    getPassCode(url);
  };

  const getPassCode = (url) => {
    if (url) {
      const indexOf = url.lastIndexOf("/");
      const passcode = url.slice(indexOf + 1);
      props.verifyEmailUrl(passcode);
    }
  };

  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    }
  }, [user]);

  const onClickRefundWithCredit = () => {
    acceptRefund();
  };

  const onBackScreen = () => {
    navigation.goBack();
  };

  const onClickRefundIdeal = () => {
    acceptRefund();
  };

  const acceptRefund = () => {
    setIsLoading(true);
    let value = navigation.state.params.selectedData;
    if (typeof value === "string") {
      value = parseFloat(value.replace(",", "."), 10);
    }
    refundToken(value, payinId, onRefundCallBack);
  };

  const onRefundCallBack = (response) => {
    setIsLoading(false);
    if (response.success) {
      NavigationService.navigate("RefundSuccess");
    } else {
      Alert.alert(
        "Alert",
        response.data.Error,
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    }
  };

  const nextScreenVerify = () => {
    const params = {
      isVerifyEmail: true,
      isPayment: true,
      selectedData,
    };
    NavigationService.navigate("VerifyPhoneNumber", params);
  };

  const nextScreenTems = () => {
    NavigationService.navigate("TermsPaymentScreen");
  };

  return (
    <RefundPaymentComponent
      isLoading={isLoading}
      email={email}
      dataOrderDetail={dataOrderDetail}
      onBackScreen={onBackScreen}
      selectedData={navigation.state.params.selectedData}
      conversionRate={props.wallets.conversionRate}
      onClickRefundIdeal={onClickRefundIdeal}
      nextScreenVerify={nextScreenVerify}
      emailVerified={user.emailVerified}
      nextScreenTems={nextScreenTems}
      onClickRefundWithCredit={onClickRefundWithCredit}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    wallets: state.wallets,
    tokens: state.tokens,
    user: state.registration.profile,
  };
};

export default connect(
  mapStateToProps,
  { resetPaymentToken, verifyEmailUrl }
)(RefundPaymentScreen);
