import React, { useCallback, useMemo } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  FlatList,
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
import { getEventImage } from "../../halpers/utilities";
import {
  fixDecimals,
  fixDecimalsF,
  convertTokensToCurrency,
} from "../../halpers/utilities";
import { Section } from "../Layout/index";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default (CheckoutComponent = (props) => {
  const {
    onBackPress,
    onNextPayment,
    countDown,
    arrayTickets,
    conversionRate,
    itemEvent,
    feeMarket,
    saleTickets,
    isLoading,
  } = props;

  let sumFee = 0;
  const sumFeeCalculator = useCallback(() => {
    if (saleTickets) {
      for (let i = 0; i < saleTickets.length; ++i) {
        sumFee += saleTickets[i].reduce((total, nextItem) => {
          return total + nextItem.numberBuy * nextItem.tokens;
        }, 0);
      }
    }
    sumFee = sumFee * feeMarket;
    return 0;
  }, [arrayTickets, feeMarket, saleTickets]);
  sumFeeCalculator();

  const renderLoading = useMemo(() => {
    return (
      <View style={styles.viewLoadingStyle}>
        <ActivityIndicator size="large" color="#FF6195" />
      </View>
    );
  }, [isLoading]);

  const renderItemUser = (item) => {
    if (item.numberBuy == 0) return null;
    return (
      <View style={{ marginTop: 10 }}>
        <View style={styles.viewItemContentStyle}>
          <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
            <View style={styles.rowStyle}>
              <Text
                style={[
                  styles.txtTitleItem,
                  { fontWeight: "bold", opacity: 1 },
                ]}
              >
                {item.numberBuy} x{" "}
              </Text>
              <Text style={styles.txtTitleItem}>
                tickets from {item.sellerName}
              </Text>
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
                {fixDecimals(item.numberBuy * item.tokens)}
              </Text>
              <Text
                style={[
                  styles.txtTitleItemZero,
                  { fontWeight: "normal", marginLeft: 10 },
                ]}
              >
                {" "}
                €{" "}
                {fixDecimals(
                  convertTokensToCurrency(
                    item.numberBuy * item.tokens,
                    conversionRate
                  )
                )}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    let totalTickets = item.numberBuy;
    if (saleTickets && saleTickets[index]) {
      totalTickets += saleTickets[index].reduce((total, next) => {
        return total + next.numberBuy;
      }, 0);
    }
    if (totalTickets == 0) return;
    return (
      <View style={{ marginTop: 10 }}>
        <Text
          numberOfLines={1}
          style={[styles.nameTiketStyle, { marginLeft: 15 }]}
        >
          {item.translatedName}
        </Text>

        {item.numberBuy > 0 && (
          <View style={styles.viewItemContentStyle}>
            <View
              style={{ flex: 2, flexDirection: "row", alignItems: "center" }}
            >
              <View style={styles.rowStyle}>
                <Text style={[styles.txtTitleItem, { fontWeight: "bold" }]}>
                  {item.numberBuy} x{" "}
                </Text>
                <Text style={styles.txtTitleItem}>official price tickets</Text>
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
                  {fixDecimals(item.numberBuy * item.price * conversionRate)}
                </Text>
                <Text
                  style={[
                    styles.txtTitleItemZero,
                    { fontWeight: "normal", marginLeft: 10 },
                  ]}
                >
                  {" "}
                  € {fixDecimals(item.numberBuy * item.price)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {saleTickets &&
          saleTickets[index] &&
          saleTickets[index].map((item) => renderItemUser(item))}
      </View>
    );
  };

  const renderItemKey = (item, index) => String(index);

  const renderContentTicket = useMemo(() => {
    const data = saleTickets.flat();
    const hasMarketPlace =
      data.length > 0 &&
      data.reduce((s, ne) => {
        let count = s;
        if (ne.numberBuy > 0) count = s + ne.numberBuy;
        return count;
      }, 0) > 0;
    return (
      <View>
        <FlatList
          data={arrayTickets}
          renderItem={renderItem}
          keyExtractor={renderItemKey}
        />

        {hasMarketPlace && (
          <View style={[styles.viewItemContentStyle, { marginTop: 10 }]}>
            <View
              style={{ flex: 2, flexDirection: "row", alignItems: "center" }}
            >
              <View style={styles.rowStyle}>
                {/* <Text style={[styles.txtTitleItem, { fontWeight: 'bold' }]}>0 x </Text> */}
                <Text style={styles.txtTitleItem}>Marketplace fee</Text>
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
                  {fixDecimals(sumFee)}
                </Text>
                <Text
                  style={[
                    styles.txtTitleItemZero,
                    { fontWeight: "normal", marginLeft: 10 },
                  ]}
                >
                  {" "}
                  €{" "}
                  {fixDecimals(convertTokensToCurrency(sumFee, conversionRate))}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }, [arrayTickets, feeMarket, saleTickets]);

  const renderButtonSubmit = useMemo(() => {
    return (
      <TouchableOpacity
        onPress={onNextPayment}
        style={[styles.viewBtnStyle, styles.shadownStyle]}
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
          <Text style={styles.txtNumberTicketStyle}>proceed to payment</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }, [arrayTickets, feeMarket, saleTickets]);

  const renderTotal = useMemo(() => {
    let sumTokens = sumFee;
    let sumPrice = 0;
    for (let i = 0; i < arrayTickets.length; ++i) {
      let price = arrayTickets[i].price * arrayTickets[i].numberBuy;
      let tokens = price * conversionRate;
      sumTokens += tokens;
      sumPrice += price;
      if (saleTickets && saleTickets[i]) {
        let res = saleTickets[i].reduce(
          (total, nextItem) => {
            total.tokens += nextItem.numberBuy * nextItem.tokens;
            total.price += convertTokensToCurrency(
              total.tokens,
              conversionRate
            );
            return total;
          },
          { tokens: 0, price: 0 }
        );
        sumTokens += res.tokens;
        sumPrice += res.price;
      }
    }
    return (
      <View style={styles.viewItemContentStyle}>
        <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
          <View style={styles.rowStyle}>
            <Text style={styles.nameTiketStyle}>Total</Text>
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
              {fixDecimals(sumTokens)}
            </Text>
            <Text
              style={[
                styles.txtTitleItemZero,
                { fontWeight: "normal", marginLeft: 10 },
              ]}
            >
              {" "}
              €{" "}
              {fixDecimals(convertTokensToCurrency(sumTokens, conversionRate))}
            </Text>
          </View>
        </View>
      </View>
    );
  }, [arrayTickets, feeMarket, saleTickets]);

  return (
    <View style={styles.containter}>
      <SafeAreaView style={styles.containter}>
        <View style={styles.viewHeaderStyle}>
          <Icon name="arrowleft" type="antdesign" onPress={onBackPress} />
          <Text style={styles.titleHeaderStyle} numberOfLines={1}>
            checkout
          </Text>
          <View style={{ width: 26 }} />
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView>
            <View style={{ marginVertical: 10 }}>
              <CustomImageBackground
                imageStyle={{ borderRadius: 1 }}
                style={styles.imageEventStyle}
              >
                <Image
                  source={{ uri: getEventImage(itemEvent, false) }}
                  style={styles.imageEventStyle}
                />
              </CustomImageBackground>
            </View>

            <View style={styles.viewCountDownStyle}>
              <Text style={styles.txtCountDownStyle}>
                Your ticket(s) are reserved for{" "}
                <Text style={{ color: "#EA5284" }}>{countDown < 0 ? 0 : countDown}</Text> seconds
              </Text>
            </View>

            {renderContentTicket}
            {/* {renderContentRegular} */}

            <View style={styles.viewLineStyle} />

            {renderTotal}
          </ScrollView>
          {renderButtonSubmit}
          {isLoading && renderLoading}
        </View>
      </SafeAreaView>
    </View>
  );
});

const styles = StyleSheet.create({
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
    width: deviceWidth,
    // height: deviceHeight * 0.35,
    // height: 210,
    height: deviceWidth / (375 / 210),
    alignSelf: "center",
    borderRadius: 8,
  },
  viewCountDownStyle: {
    backgroundColor: "#F8F9FA",
    borderRadius: 4,
    width: deviceWidth - 30,
    height: 45,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  txtCountDownStyle: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Lato",
  },
  nameTiketStyle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
    marginRight: "5%",
  },
  viewItemContentStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
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
  },
  txtTitleItemZero: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Lato",
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
    width: "90%",
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
