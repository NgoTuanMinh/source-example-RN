import React, { useEffect, useState, useContext } from "react";
import { View, Linking, Alert } from "react-native";
import { connect } from "react-redux";
import PaymentComponent from "../../../components/Payment/PaymentComponent";
import {
  buyTokens,
  resetPaymentToken,
  verifyEmailUrl,
} from "../../../redux/actions/index";
import { bindActionCreators } from "redux";
import NavigationService from "../../../NavigationService";
import { translate } from "../../../../App";
import CardType from "../../../constants/CardType";
import { convertTokensToCurrency } from "../../../halpers/utilities";

const initData = [
  {
    title: "Tokens",
    // title: "EVX Tokens",
    number: 0,
    price: 0,
  },
];

const initTotal = {
  Subtotal: 0,
  Tax: 0,
  Total: 0,
};
const PaymentEventScreen = (props) => {
  const { navigation, user, verifyEmailUrl } = props;

  const { conversionRate } = props.wallets;
  const selectedData = navigation.state.params.selectedData || 0;
  const [email, setEmail] = useState(user.email ? user.email : "");
  const [dataOrderDetail, setDataOrderDetail] = useState(initData);
  const [total, setTotal] = useState(initTotal);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckIdeal, setIsCheckIdeal] = useState(false);

  // console.log('thai select', selectedData)

  useEffect(() => {
    setDataOrderDetail([
      {
        title: "Tokens",
        // title: "EVX Tokens",
        number: selectedData,
        price: convertTokensToCurrency(selectedData, conversionRate),
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

  useEffect(() => {
    if (props.tokens && props.tokens.data && props.tokens.data.PaymentUrl) {
      const paymentURL = props.tokens.data.PaymentUrl;
      const params = {
        paymentUrl: paymentURL,
        tokenAmount: props.tokens.data.tokenAmount,
      };
      props.resetPaymentToken();
      setIsLoading(false);
      NavigationService.navigate("WebViewMangoPayEventScreen", params);
      return;
    }

    if (props.tokens && props.tokens.error) {
      setIsLoading(false);
      props.resetPaymentToken();
      setTimeout(() => {
        Alert.alert(
          "Alert",
          translate("SomeThingWrong"),
          [{ text: "OK", onPress: () => {} }],
          { cancelable: false }
        );
      }, 500);
    }
  }, [props.tokens]);

  const onClickPay = () => {
    if (isCheckIdeal) acceptPayment(CardType.IDEAL);
    else acceptPayment(CardType.CB_VISA_MASTERCARD);
  };

  const onClickPayWithCredit = () => {
    acceptPayment(CardType.CB_VISA_MASTERCARD);
  };

  const onBackScreen = () => {
    navigation.goBack();
  };

  const onClickPayIdeal = () => {
    acceptPayment(CardType.IDEAL);
  };

  const acceptPayment = (cardType) => {
    setIsLoading(true);
    let value = navigation.state.params.selectedData;
    if (typeof value === "string") {
      value = parseFloat(value.replace(",", "."), 10);
    }
    props.buyTokens(value, cardType);
  };

  const onChangePaymentMethod = (type) => {
    if (type == 0) setIsCheckIdeal(true);
    else setIsCheckIdeal(false);
  };

  const nextScreenVerify = () => {
    console.log("thai thai", selectedData);
    const params = {
      isVerifyEmail: true,
      isPayment: true,
      selectedData,
      // isCoreTopup: true,
    };
    // NavigationService.navigate("TokenTopUpEvent", { selectedData });
    // NavigationService.navigate("PaymentScreen", {
    //   selectedData: selectedData,
    // });
    NavigationService.navigate("VerifyPhoneNumber", params);
  };

  const nextScreenTems = () => {
    NavigationService.navigate("TermsPaymentEventScreen");
  };

  return (
    <PaymentComponent
      isLoading={isLoading}
      email={email}
      dataOrderDetail={dataOrderDetail}
      total={total}
      onClickPay={onClickPay}
      onBackScreen={onBackScreen}
      selectedData={navigation.state.params.selectedData}
      conversionRate={props.wallets.conversionRate}
      onClickPayIdeal={onClickPayIdeal}
      isCheckIdeal={isCheckIdeal}
      nextScreenVerify={nextScreenVerify}
      emailVerified={user.emailVerified}
      nextScreenTems={nextScreenTems}
      onChangePaymentMethod={onChangePaymentMethod}
      onClickPayWithCredit={onClickPayWithCredit}
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
  { buyTokens, resetPaymentToken, verifyEmailUrl }
)(PaymentEventScreen);
