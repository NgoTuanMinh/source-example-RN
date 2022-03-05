import React, { useCallback, useMemo, useState } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  RefreshControl,
  ScrollView,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { translate } from "../../../App";
import { Icon } from "react-native-elements";
import * as ImageSvg from "../Icons/CircleIcons/ImageSvg";
import * as ImageCustom from "../Icons/CircleIcons/index";
import CustomImageBackground from "../CustomImageBackground";
import LinearGradient from "react-native-linear-gradient";
import Carousel, { Pagination } from "react-native-snap-carousel";
import CircleIcons from "../Icons/CircleIcons";
import { fixDecimals, convertTokensToCurrency } from "../../halpers/utilities";
import { Section } from "../Layout/index";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default (EventPaymentTypeComponent = (props) => {
  const {
    onBackPress,
    onNextPayment,
    onNextSuccess,
    typePay,
    setTypePay,
    arrayTickets,
    conversionRate,
    wallets,
    isLoading,
    feeMarket,
    sumPrice,
    mainPrice,
    isRefreshing,
    onRefresh,
    isCheckPayment,
    isDisplayToast,
    onChangeStatusToast,
  } = props;

  const [mainPriceOld, setMainPriceOld] = useState(0);

  const showCheckBox = (number) => {
    if (typePay == number) {
      return (
        <TouchableOpacity>
          <LinearGradient
            colors={["#FF6195", "#C2426C"]}
            style={styles.linearGradientStyle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Image source={ImageCustom.icTick} style={styles.icTickStyle} />
          </LinearGradient>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={() => setTypePay(number)}
        style={styles.boxStyle}
      />
    );
  };

  const renderTotal = useMemo(() => {
    return (
      <View style={styles.viewItemContentStyle}>
        <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
          <View style={styles.rowStyle}>
            <Text style={styles.nameTiketStyle}>Total:</Text>
          </View>
        </View>
        <View style={styles.viewItemPrice}>
          <CircleIcons
            name="logo-regular"
            color="#FF6195"
            size={{ width: 11, height: 12 }}
          />
          <View style={styles.rowStyle}>
            <Text
              style={[
                styles.txtTitleItemZero,
                { color: "#FF6195", fontWeight: "bold" },
              ]}
            >
              {" "}
              {fixDecimals(sumPrice)}
            </Text>
            <Text
              style={[
                styles.txtTitleItemZero,
                { fontWeight: "normal", marginLeft: 10 },
              ]}
            >
              {" "}
              € {fixDecimals(convertTokensToCurrency(sumPrice, conversionRate))}
            </Text>
          </View>
        </View>
      </View>
    );
  }, [sumPrice]);

  const renderWallet = useMemo(() => {
    setMainPriceOld(mainPrice);
    if (mainPriceOld != mainPrice) {
      {
        onChangeStatusToast();
      }
    }
    return (
      <View style={styles.viewItemBorderStyle}>
        <Text style={[styles.nameTiketStyle, { color: "#EA5284" }]}>
          Token balance
        </Text>

        <View style={styles.rowStyle}>
          <CircleIcons
            name="logo-regular"
            color="#FF6195"
            size={{ width: 11, height: 12 }}
          />

          <Text
            style={[
              styles.txtTitleItemZero,
              { color: "#FF6195", fontWeight: "bold" },
            ]}
          >
            {" "}
            {fixDecimals(mainPrice)}
          </Text>
        </View>
      </View>
    );
  }, [wallets, mainPrice]);

  const renderWarning = useMemo(() => {
    // console.log("thai sum", mainPrice, " - ", sumPrice);
    if (mainPrice >= Number(sumPrice.toFixed(2))) return null;
    return (
      <View style={styles.viewWarningStyle}>
        <Text
          style={[
            styles.txtTitleItemZero,
            { color: "#EA5284", marginVertical: 15 },
          ]}
        >
          Your token balance is insufficient.
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={[styles.txtTitleItemZero, { fontSize: 14 }]}>
            Please top up at least{" "}
          </Text>
          <Image
            source={require("../../../assets/images/UnionBlack.png")}
            style={{
              height: 11,
              width: 10,
            }}
          />
          <Text
            style={[
              styles.txtTitleItemZero,
              { fontSize: 14, fontWeight: "700" },
            ]}
          >
            {" "}
            {fixDecimals(sumPrice - mainPrice)}
          </Text>
          <Text style={[styles.txtTitleItemZero, { fontSize: 14 }]}>
            {" "}
            before continuing.
          </Text>
        </View>
      </View>
    );
  }, [wallets, sumPrice, mainPrice]);

  const renderPayEventX = useMemo(() => {
    let price = mainPrice;
    if (mainPrice > sumPrice) {
      price = sumPrice;
    }

    return (
      <View style={[styles.viewItemContentStyle, { marginTop: 15 }]}>
        <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
          <View style={styles.rowStyle}>
            <Text style={styles.nameTiketStyle}>Pay with </Text>
            <CircleIcons
              name="logo-regular"
              color="#000000"
              size={{ width: 11, height: 12 }}
            />
            <Text style={styles.nameTiketStyle}> tokens:</Text>
          </View>
        </View>

        <View style={styles.viewItemPrice}>
          <CircleIcons
            name="logo-regular"
            color="#FF6195"
            size={{ width: 11, height: 12 }}
          />
          <View style={styles.rowStyle}>
            <Text
              style={[
                styles.txtTitleItemZero,
                { color: "#FF6195", fontWeight: "bold" },
              ]}
            >
              {" "}
              {fixDecimals(price)}
            </Text>
            <Text
              style={[
                styles.txtTitleItemZero,
                { fontWeight: "normal", marginLeft: 10 },
              ]}
            >
              {" "}
              € {fixDecimals(convertTokensToCurrency(price, conversionRate))}
            </Text>
          </View>
        </View>
      </View>
    );
  }, [wallets, sumPrice, mainPrice]);

  const renderBrowser = useMemo(() => {
    let price = sumPrice - mainPrice;
    if (price <= 0) return null;

    return (
      <View>
        <View style={styles.viewItemContentStyle}>
          <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
            <View style={styles.rowStyle}>
              <Text style={styles.nameTiketStyle}>Still to pay:</Text>
            </View>
          </View>

          <View style={styles.viewItemPrice}>
            <CircleIcons
              name="logo-regular"
              color="#FF6195"
              size={{ width: 11, height: 12 }}
            />
            <View style={styles.rowStyle}>
              <Text
                style={[
                  styles.txtTitleItemZero,
                  { color: "#FF6195", fontWeight: "bold" },
                ]}
              >
                {" "}
                {fixDecimals(price)}
              </Text>
              <Text
                style={[
                  styles.txtTitleItemZero,
                  { fontWeight: "normal", marginLeft: 10 },
                ]}
              >
                {" "}
                € {fixDecimals(convertTokensToCurrency(price, conversionRate))}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.viewLineStyle} />

        <View style={[styles.viewPayStyle]}>
          {showCheckBox(1)}

          <Text style={styles.txtPayStyle}>Pay with iDeal</Text>
        </View>

        <View style={[styles.viewPayStyle]}>
          {showCheckBox(2)}
          <Text style={styles.txtPayStyle}>Pay with Paypal</Text>
        </View>

        <View style={[styles.viewPayStyle]}>
          {showCheckBox(3)}
          <Text style={styles.txtPayStyle}>Pay with Apple Pay</Text>
        </View>

        <View style={[styles.viewPayStyle]}>
          {showCheckBox(4)}
          <Text style={styles.txtPayStyle}>Pay with Credit Card</Text>
        </View>
      </View>
    );
  }, [typePay, wallets, sumPrice, mainPrice]);

  const renderLoading = useMemo(() => {
    return (
      <View style={styles.viewLoadingStyle}>
        <ActivityIndicator size="large" color="#FF6195" />
      </View>
    );
  }, [isLoading]);

  const renderToast = useMemo(() => {
    if (mainPrice < sumPrice && isCheckPayment == true) {
      return (
        <View style={styles.mainToast}>
          <View style={{ width: "85%", padding: 8 }}>
            <Text style={styles.textToast}>
              Token top-up may take a few minutes to go through. Please wait
              before continuing.
            </Text>
          </View>
          <View
            style={{
              width: "15%",
              padding: 15,
              alignItems: "center",
              justifyContent: "flex-end",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity onPress={onChangeStatusToast}>
              <Image
                source={require("../../../assets/images/icClose.png")}
                style={{
                  height: 14,
                  width: 14,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }, [sumPrice, mainPrice, isCheckPayment]);

  return (
    <View style={styles.containter}>
      <SafeAreaView style={styles.containter}>
        <View style={styles.viewHeaderStyle}>
          <Icon name="arrowleft" type="antdesign" onPress={onBackPress} />
          <Text style={styles.titleHeaderStyle} numberOfLines={1}>
            payment
          </Text>
          <View style={{ width: 26 }} />
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          >
            {renderTotal}

            {renderWarning}

            {renderWallet}

            {/* {renderPayEventX} */}

            {/* <View style={styles.viewLineStyle} /> */}
            {/* {renderBrowser} */}
          </ScrollView>
          {isDisplayToast === true && renderToast}
          {/* <TouchableOpacity
            onPress={onNextSuccess}
            style={[styles.viewBtnStyle]}
          >
            <LinearGradient
              colors={["#FF6195", "#C2426C"]}
              style={[
                styles.linearGradientNextStyle,
                { justifyContent: "center", alignItems: "center" },
              ]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            >
              <Text style={styles.txtNumberTicketStyle}>Pay</Text>
            </LinearGradient>
          </TouchableOpacity> */}
          <View style={{ width: deviceWidth, paddingHorizontal: 15 }}>
            {mainPrice < Number(sumPrice.toFixed(2)) ? (
              <TouchableOpacity
                onPress={onNextSuccess}
                style={[styles.viewBtnStyle, { paddingVertical: 0 }]}
              >
                <LinearGradient
                  colors={["#FF6195", "#C2426C"]}
                  style={[
                    styles.linearGradientNextStyle,
                    { justifyContent: "center", alignItems: "center" },
                  ]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <Image
                      source={require("../../../assets/images/icPlusWhite.png")}
                      style={{
                        height: 17,
                        width: 17,
                        marginTop: 1,
                        marginRight: 5,
                      }}
                    />
                    <Text style={styles.txtNumberTicketStyle}>
                      top up tokens
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              onPress={onNextSuccess}
              style={[
                styles.viewBtnStyle,
                {
                  marginTop: 0,
                  paddingTop: 0,
                  opacity: mainPrice < Number(sumPrice.toFixed(2)) ? 0.4 : 1,
                },
              ]}
              disabled={mainPrice < Number(sumPrice.toFixed(2)) ? true : false}
            >
              <LinearGradient
                colors={["#FF6195", "#C2426C"]}
                style={[
                  styles.linearGradientNextStyle,
                  { justifyContent: "center", alignItems: "center" },
                ]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
              >
                <Text style={styles.txtNumberTicketStyle}>Pay</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          {isLoading && renderLoading}
        </View>
      </SafeAreaView>
    </View>
  );
});

const styles = StyleSheet.create({
  textToast: {
    fontSize: 14,
    fontWeight: "400",
    color: "#fff",
    lineHeight: 20,
  },
  mainToast: {
    // width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#666666",
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 4,
  },
  containter: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewHeaderStyle: {
    flexDirection: "row",
    paddingHorizontal: 15,
    height: 56,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleHeaderStyle: {
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 10,
    maxWidth: "80%",
    fontFamily: "Lato",
    textTransform: "uppercase",
  },
  imageEventStyle: {
    width: deviceWidth - 30,
    height: deviceHeight * 0.25,
    alignSelf: "center",
    borderRadius: 8,
  },
  nameTiketStyle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  viewItemContentStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  viewItemBorderStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    // borderWidth: 1,
    // borderColor: "#EA5284",
    paddingHorizontal: 15,
    height: 54,
    marginTop: 10,
  },
  txtTitleItem: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Lato",
    opacity: 0.8,
  },
  viewItemPrice: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 110,
  },
  rowStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  txtTitleItemZero: {
    fontSize: 16,
    color: "#000",
    // fontFamily: "Lato",
  },
  viewLineStyle: {
    height: 1,
    backgroundColor: "#000",
    opacity: 0.05,
    marginHorizontal: 15,
    marginVertical: 15,
  },
  viewBtnStyle: {
    backgroundColor: "#fff",
    paddingVertical: 5,
  },
  linearGradientNextStyle: {
    flexDirection: "row",
    width: "100%",
    // height: 55,
    paddingVertical: 15,
    alignSelf: "center",
    marginVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  txtNumberTicketStyle: {
    color: "#fff",
    marginLeft: 3,
    fontSize: 20,
    fontFamily: "Lato",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginRight: 15,
  },
  viewWarningStyle: {
    backgroundColor: "rgba(234, 82, 132, 0.08)",
    borderRadius: 4,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    marginTop: 5,
    paddingBottom: 15,
    borderColor: "#EA5284",
    borderWidth: 1,
  },
  icTickStyle: {
    width: 15,
    height: 15,
    resizeMode: "contain",
  },
  linearGradientStyle: {
    height: 25,
    width: 25,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  boxStyle: {
    height: 25,
    width: 25,
    borderRadius: 15,
    borderColor: "#cccccc",
    borderWidth: 2,
  },
  txtPayStyle: {
    color: "#000",
    opacity: 0.8,
    fontSize: 16,
    marginLeft: 16,
  },
  viewPayStyle: {
    flexDirection: "row",
    marginLeft: 25,
    marginTop: 15,
  },
  viewLoadingStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
});
