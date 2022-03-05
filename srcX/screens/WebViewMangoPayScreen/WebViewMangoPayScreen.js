import React, { useEffect, useState, useContext, useRef } from "react";
import {
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { connect } from "react-redux";
import NavigationService from "../../NavigationService";
import { BackHandler } from "react-native";
import { deletePendingTopUpTransaction } from '../../redux/actions'

function WebViewMangoPayScreen(props) {
  const { navigation } = props;

  const [paymentURL, setPaymentURL] = useState("");
  const [tokenAmount, setTokenAmount] = useState("X");
  const [urlLoading, setUrlLoading] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckFirt, setIsCheckFirt] = useState(0);
  const [indexSuccess, setIndexSuccess] = useState(0);
  let index = 0;

  useEffect(() => {
    const paymentURL = navigation?.state?.params?.paymentUrl;
    setPaymentURL(paymentURL);
    const tokenAmountParam = navigation?.state?.params?.tokenAmount;
    setTokenAmount(tokenAmountParam);

    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };

  }, []);

  const handleBackButtonClick = async() => {
    console.log("On goback herer====");
    deletePendingTopUpTransaction();
    NavigationService.goBack();
  }

  const onBack = async () => {
    navigation.navigate("WalletsStack", { isDeleteTransaction: true });
    console.log("On goback herer====");
  };

  useEffect(() => {
    if (indexSuccess == 1) {
      onSuccessTopUp();
    }
  }, [indexSuccess]);

  const onSuccessTopUp = async () => {
    const params = {
      tokenAmount: tokenAmount,
    };
    NavigationService.navigate("Success", params);
  };

  var webview = useRef(null);

  const handleWebViewNavigationStateChange = async (newNavState) => {
    console.log("URL", newNavState);
    const { url, title } = newNavState;
    if (isCheckFirt == 0) {
      setIsCheckFirt(1);
      let stringTest = "transactionId";
      let index = url.indexOf(stringTest);
      index = index + stringTest.length + 1;
      let stringId = "";
      for (let i = index; i < url.length; ++i) {
        if (url[i] >= 0 && url[i] <= 9) {
          stringId += url[i];
        } else {
          break;
        }
      }
    }

    if (url) {
      setUrlLoading(url);
    }
    if (
      url.includes("www.test.com/?transactionId") &&
      title != "" &&
      (title == "Online transfer" || title.includes("Content/PaylineTemplateWidget"))
    ) {
      setIsLoading(false);
      if (indexSuccess == 0) {
        setIndexSuccess(1);
        return;
      }
    } else if (
      (url.includes("www.test.com/?transactionId") && title == "") ||
      (url.includes("www.test.com/?transactionId") &&
        title.includes("www.test.com/?transactionId"))
    ) {
      if (index == 0 && indexSuccess == 0) {
        ++index;
        onBack();
      }
    }
  };

  const onLoadStart = () => {
    if (urlLoading == "") {
      setIsLoading(true);
    }
    if (
      urlLoading.includes(
        "https://homologation-payment.payline.com/partnerReturn?"
      )
    ) {
      setIsLoading(true);
    }
  };

  const onLoadCompleted = () => {
    if (urlLoading == paymentURL) {
      setIsLoading(false);
    }
  };

  const renderLoading = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loadingViewStyle}>
        <ActivityIndicator size="large" color="#EA5284" />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        ref={(ref) => (webview = ref)}
        source={{ uri: navigation?.state?.params?.paymentUrl }}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        onLoadStart={onLoadStart}
        onLoadEnd={onLoadCompleted}
      />
      {renderLoading()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingViewStyle: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});
const mapStateToProps = (state) => {
  return {
    tokens: state.tokens,
  };
};
export default connect(
  mapStateToProps,
  null
)(WebViewMangoPayScreen);
