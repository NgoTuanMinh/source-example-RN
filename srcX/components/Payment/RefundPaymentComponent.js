import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  ScrollView,
  Platform,
  ActivityIndicator,
  Linking,
  StatusBar,
} from "react-native";
import AppHeader from "../HeaderComponent";
import { SectionNoShahow } from "../Layout/SectionNoShahow";
import { Section } from "../Layout/index";
import LinearGradient from "react-native-linear-gradient";
import { fixDecimals } from "../../halpers/utilities";
import { translate } from "../../../App";
import Logo from "../Icons/TabIcons/Logo";
import CircleIcons from "../Icons/CircleIcons";

const widthScreen = Dimensions.get("window").width;

const colorsDradient = ["#FF6195", "#C2426C"];

export default (RefundPaymentComponent = (props) => {
  const {
    email,
    dataOrderDetail,
    onClickRefundIdeal,
    isLoading,
    nextScreenVerify,
    emailVerified,
    nextScreenTems,
  } = props;

  const renderContentEmail = () => {
    if (email && email.length > 0) {
      return (
        <View style={styles.viewEmailStyle}>
          <Text style={styles.inputStyle}>{email.trim()}</Text>
          {emailVerified && (
            <Image
              source={require("../../../assets/images/icSuccess.png")}
              style={styles.iconStyle}
            />
          )}
        </View>
      );
    }
    return null;
  };

  const renderEmailView = useMemo(() => {
    return (
      <View style={styles.viewEmailTotalStyle}>
        <Text style={styles.txtTitleStyle}>{translate("Email")}</Text>
        {renderContentEmail()}
        {!emailVerified && (
          <View>
            {!email ? (
              <Text style={styles.txtWarningStyle} numberOfLines={2}>
                {translate("NotEmail")}
              </Text>
            ) : (
              <Text style={styles.txtWarningStyle} numberOfLines={2}>
                {translate("NoVerifyEmail")}
              </Text>
            )}
            <TouchableOpacity
              onPress={nextScreenVerify}
              style={styles.btnPayStyle}
            >
              <LinearGradient
                colors={colorsDradient}
                style={styles.gradientVerifyStyle}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 14,
                    fontFamily: "Lato",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {translate("VerifyNow")}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }, [email, emailVerified]);

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.viewItemStyle}>
        <View style={{ flex: 2 }}>
          <Text style={styles.txtItemStyle}>{item.title}</Text>
        </View>

        <View style={styles.viewPriceStyle}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Logo color="rgba(0, 0, 0, 0.4)" height={12} width={12} />
            <Text style={styles.txtNumberStyle}>
              {fixDecimals(item.number)}
            </Text>
          </View>

          <Text style={styles.txtPriceStyle}>
            € {fixDecimals(item.subTotal)}
          </Text>
        </View>
      </View>
    );
  };

  const renderOrderDetail = useMemo(() => {
    return (
      <View style={{ marginTop: 16 }}>
        <Section title="ORDER DETAILS">
          <FlatList
            data={dataOrderDetail}
            renderItem={renderItem}
            keyExtractor={(item, index) => String(index)}
          />
        </Section>
      </View>
    );
  }, [dataOrderDetail]);

  const renderOrderTotal = useMemo(() => {
    return (
      <Section title="ORDER SUMMARY">
        <View style={styles.viewItemStyle}>
          <Text style={styles.txtItemStyle}>{translate("Subtotal")}</Text>
          <Text style={styles.txtItemStyle}>
            € {fixDecimals(dataOrderDetail[0].subTotal)}
          </Text>
        </View>
        <View style={styles.viewItemStyle}>
          <Text style={styles.txtItemStyle}>{translate("Service_fee")}</Text>
          <Text style={styles.txtItemStyle}>
            € {fixDecimals(dataOrderDetail[0].fee)}
          </Text>
        </View>
        <View style={[styles.viewItemStyle, styles.viewShadow]}>
          <Text style={styles.txtItemStyle}>{translate("Total")}</Text>
          <Text style={styles.txtTotalStyle}>
            € {fixDecimals(dataOrderDetail[0].total)}
          </Text>
        </View>
      </Section>
    );
  }, [dataOrderDetail]);

  const renderTerms = useMemo(() => {
    return (
      <View>
        <Text style={styles.txtTermsStyle}>
          {translate("ByContinuing_Refund")}
          <Text
            //onPress={() => Linking.openURL('https://eventx.network/data/eventx-gebruiksvoorwaarden.pdf')}
            onPress={nextScreenTems}
            style={styles.txtTermsRuleStyle}
          >
            {" "}
            {translate("TermsConditions")}
          </Text>
        </Text>
        <Image
          source={require("../../../assets/images/mangopay_terms.png")}
          style={styles.logoStyle}
        />
      </View>
    );
  }, []);

  const renderButtonPay = useMemo(() => {
    const isCheck = email && email.length > 0;
    return (
      <TouchableOpacity
        onPress={onClickRefundIdeal}
        style={styles.btnPayStyle}
        disabled={!isCheck}
      >
        <LinearGradient
          colors={colorsDradient}
          style={isCheck ? styles.gradientStyle : styles.gradientHideStyle}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        >
          <Text style={styles.txtPayStyle}>{translate("Refund")}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }, [email]);

  const renderLoading = useMemo(() => {
    return (
      <View style={styles.viewLoadingStyle}>
        <ActivityIndicator size="large" color="#FF6195" />
      </View>
    );
  }, [isLoading]);
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppHeader
        title={translate("RefundOverView")}
        params={{ isGoBack: true, isNotification: false }}
      >
        <ScrollView style={{ flex: 1, backgroundColor: "#f1f1f1" }}>
          {renderEmailView}
          {renderOrderDetail}
          {renderOrderTotal}
          {renderTerms}
          {renderButtonPay}
          {isLoading && renderLoading}
        </ScrollView>
      </AppHeader>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#f1f1f1'
    backgroundColor: "#fff",
  },
  txtTitleStyle: {
    color: "#000000",
    opacity: 0.4,
    fontSize: 14,
    fontFamily: "Lato",
    marginTop: 5,
    fontWeight: "700",
  },
  viewEmailStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Platform.OS == "ios" ? 20 : 5,
    marginTop: Platform.OS == "ios" ? 10 : 5,
    paddingVertical: 2,
  },
  iconStyle: {
    height: 15,
    width: 15,
    resizeMode: "contain",
  },
  txtWarningStyle: {
    fontSize: 16,
    fontFamily: "Lato",
    color: "#EB5757",
    marginVertical: 5,
  },
  viewItemStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  viewPriceStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1.8,
    //paddingRight: 5,
  },
  txtItemStyle: {
    fontSize: 16,
    fontFamily: "Lato",
  },
  txtTotalStyle: {
    fontSize: 16,
    fontFamily: "Lato",
    color: "#EA5284",
  },
  txtNumberStyle: {
    color: "rgba(0, 0, 0, 0.4)",
    fontSize: 16,
    marginLeft: 3,
    fontWeight: "bold",
  },
  txtPriceStyle: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Lato",
    marginLeft: 10,
  },
  txtTermsStyle: {
    textAlign: "center",
    alignSelf: "center",
    fontSize: 14,
    fontFamily: "Lato",
    color: "#b2b2b2",
    marginTop: 20,
  },
  txtTermsRuleStyle: {
    color: "#4487C6",
    textAlign: "center",
    alignSelf: "center",
  },
  logoStyle: {
    height: 50,
    width: widthScreen * 0.8,
    resizeMode: "contain",
    alignSelf: "center",
    opacity: 0.6,
  },
  txtPayStyle: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Lato",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  btnPayStyle: {
    paddingVertical: 15,
    marginTop: 5,
  },
  gradientStyle: {
    width: widthScreen * 0.9,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    alignSelf: "center",
  },
  gradientHideStyle: {
    width: widthScreen * 0.9,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    alignSelf: "center",
    opacity: 0.5,
  },
  viewEmailTotalStyle: {
    backgroundColor: "#fff",
    paddingLeft: 15,
    paddingTop: 15,
    paddingRight: 5,
  },
  gradientVerifyStyle: {
    width: widthScreen * 0.35,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 10,
  },
  inputStyle: {
    fontSize: 16,
    fontFamily: "Lato",
    marginRight: 3,
  },
  viewBottomView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  btnStyle: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.4)",
    width: widthScreen * 0.9,
    alignSelf: "center",
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  txtCardStyle: {
    fontSize: 16,
    fontFamily: "Lato",
    fontWeight: "bold",
    paddingVertical: 10,
  },
  iconIDealStyle: {
    height: 20,
    width: 24,
    resizeMode: "contain",
    marginLeft: 5,
  },
  iconAppleStyle: {
    height: 15,
    width: 15,
    resizeMode: "contain",
  },
  viewLoadingStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.2)",
    elevation: Platform.OS === "android" ? 16 : 0,
  },
  viewShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 5, height: 30 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: {
        elevation: 20,
      },
    }),
  },
});
