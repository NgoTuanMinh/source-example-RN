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
import { Icon } from "react-native-elements";
import * as ImageSvg from "../Icons/CircleIcons/ImageSvg";
import * as ImageCustom from "../Icons/CircleIcons/index";
import CustomImageBackground from "../CustomImageBackground";
import LinearGradient from "react-native-linear-gradient";
import Carousel, { Pagination } from "react-native-snap-carousel";
import CircleIcons from "../Icons/CircleIcons";
import {
  fixDecimals,
  fixDecimalsF,
  convertTokensToCurrency,
} from "../../halpers/utilities";
import { Section } from "../Layout/index";
import ModalEventDetailComponent from "./ModalEventDetailComponent";
import ViewMoreText from "react-native-view-more-text";
import { getEventImage } from "../../halpers/utilities";

const deviceWidth = Dimensions.get("window").width;

export default (EventBuyComponent = (props) => {
  const {
    onBackPress,
    isShowDetail,
    toggleShowDetail,
    nextCheckoutScreen,
    onNextSellScreen,
    isLoading,
    itemEvent,
    plusEvent,
    minusEvent,
    conversionRate,
    marketPlaceTickets,
    officialTickets,
    currentTicket,
    onBeforeSnapChange,
    sumTicketSell,
    onPressPlusUser,
    onPressMinusUser,
    userId,
    sumSalesTicket,
  } = props;

  // console.log("thai official item", itemEvent);

  const renderTicketItem = ({ item, index }) => {
    return (
      <View style={styles.viewItemTiketStyle}>
        <View style={styles.borderTiketStyle}>
          {/* {console.log("thai eventtttt", item.event)} */}
          <CustomImageBackground style={styles.imgBackGround}>
            <Image
              // source={{ uri: getEventImage(item.event, true) }}
              source={{ uri: getEventImage(itemEvent, true) }}
              style={styles.imgBackGround}
            />
          </CustomImageBackground>
          <Text
            numberOfLines={2}
            style={[styles.nameTiketStyle, { marginLeft: 15 }]}
          >
            {item.translatedName}
          </Text>
        </View>
      </View>
    );
  };

  const renderViewMore = (onPress) => {
    return (
      <Text onPress={toggleShowDetail} style={styles.txtMoreStyle}>
        More Details
      </Text>
    );
  };

  const renderDetail = useMemo(() => {
    if (currentTicket == -1 || officialTickets.length == 0) return null;

    if (currentTicket == -1 || officialTickets.length == 0) return null;
    const descriptionTicket =
      officialTickets[currentTicket].translatedDescription;
    if (!descriptionTicket || descriptionTicket.trim().length == 0) return null;
    return (
      <View style={[styles.aboutStyle, { paddingHorizontal: 15 }]}>
        <ViewMoreText
          numberOfLines={3}
          renderViewMore={renderViewMore}
          textStyle={[styles.txtContentStyle, {}]}
        >
          <Text>{descriptionTicket}</Text>
        </ViewMoreText>
      </View>
    );
  }, [currentTicket]);

  const renderMarkPlaceTickets = ({ item, index }) => {
    const isBuyMe = item.seller == userId;
    return (
      <View
        style={[
          styles.ticketItemStyle,
          isBuyMe && { backgroundColor: "#F8F9FA" },
        ]}
      >
        <View>
          <View style={[styles.rowStyle, { justifyContent: "flex-start" }]}>
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
              {fixDecimals(item.tokens)}
              <Text style={[styles.txtTitleItemZero, { fontWeight: "normal" }]}>
                {" "}
                €{" "}
                {fixDecimals(
                  convertTokensToCurrency(item.tokens, conversionRate)
                )}
              </Text>
            </Text>
          </View>
          <Text style={styles.txtOfferedStyle}>
            Offered by {isBuyMe ? "me" : item.sellerName}
          </Text>
        </View>

        {isBuyMe ? (
          <View style={styles.rowStyle}>
            <View style={[styles.rowStyle, { marginHorizontal: 15 }]}>
              <Image source={ImageCustom.icTickets} style={styles.iconStyle} />
              <Text style={[styles.txtTitleItemZero, { color: "#000" }]}>
                {item.tickets.length} left
              </Text>
            </View>
          </View>
        ) : (
          <View>
            {item.numberBuy == 0 ? (
              <View style={styles.rowStyle}>
                {/* <Image
                  source={ImageCustom.icTickets}
                  style={styles.iconStyle}
                /> */}
                <Text style={styles.txtNumberStyle}>
                  {item.numberBuy}
                  {/* <Text
                    style={[styles.txtNumberSumStyle, { fontWeight: "normal" }]}
                  >
                    /{item.tickets.length}
                  </Text> */}
                </Text>

                <TouchableOpacity
                  disabled={item.numberBuy == item.tickets.length}
                  onPress={() => onPressPlusUser(item, index)}
                >
                  <Image
                    source={ImageCustom.icPlusNumber}
                    style={styles.iconMinusStyle}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.rowStyle}>
                <TouchableOpacity
                  onPress={() => onPressMinusUser(item, index)}
                  disabled={item.numberBuy == 0}
                >
                  <Image
                    source={ImageCustom.icMinus}
                    style={styles.iconMinusStyle}
                  />
                </TouchableOpacity>

                <Text style={styles.txtNumberStyle}>
                  {item.numberBuy}
                  {/* <Text
                    style={[styles.txtNumberSumStyle, { fontWeight: "normal" }]}
                  >
                    /{item.tickets.length}
                  </Text> */}
                </Text>

                <TouchableOpacity
                  disabled={item.numberBuy == item.tickets.length}
                  onPress={() => onPressPlusUser(item, index)}
                >
                  <Image
                    source={ImageCustom.icPlusNumber}
                    style={styles.iconMinusStyle}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderLoading = useMemo(() => {
    return (
      <View style={styles.viewLoadingStyle}>
        <ActivityIndicator size="large" color="#FF6195" />
      </View>
    );
  }, [isLoading]);

  const renderOfficial = useMemo(() => {
    if (currentTicket == -1 || officialTickets.length == 0) return null;

    let costPrice =
      currentTicket > -1 ? officialTickets[currentTicket].price : 0;
    let numberBuy =
      currentTicket > -1 ? officialTickets[currentTicket].numberBuy : 0;
    const count =
      currentTicket > -1 ? officialTickets[currentTicket].numOfLefTickets : 0;

    return (
      <Section
        customStyle={{ shadowColor: "rgba(0,0,0,0.5)" }}
        title={"official ticket (" + count + ")"}
      >
        <View
          style={[
            styles.rowStyle,
            {
              justifyContent: "space-between",
              paddingHorizontal: 15,
              paddingVertical: 15,
            },
          ]}
        >
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
              {fixDecimals(costPrice * conversionRate)}
              <Text style={[styles.txtTitleItemZero, { fontWeight: "normal" }]}>
                {" "}
                € {fixDecimals(costPrice)}
              </Text>
            </Text>
          </View>
          {count == 0 ? (
            <View style={[styles.rowStyle, {}]}>
              <Image
                source={ImageCustom.icTickets}
                style={[styles.iconStyle, { tintColor: "#000" }]}
              />
              <Text
                style={[
                  styles.txtTitleItemZero,
                  { color: "#000", fontWeight: "bold" },
                ]}
              >
                {" "}
                SOLD OUT
              </Text>
            </View>
          ) : (
            <View style={styles.rowStyle}>
              {numberBuy == 0 ? (
                <View style={styles.rowStyle}>
                  <Text style={styles.txtNumberStyle}>
                    {numberBuy}
                    {/* <Text
                      style={[
                        styles.txtNumberSumStyle,
                        { fontWeight: "normal" },
                      ]}
                    >
                      /{count}
                    </Text> */}
                  </Text>
                  <TouchableOpacity
                    onPress={plusEvent}
                    disabled={numberBuy >= count}
                  >
                    <Image
                      source={ImageCustom.icPlusNumber}
                      style={styles.iconMinusStyle}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.rowStyle}>
                  <TouchableOpacity onPress={minusEvent}>
                    <Image
                      source={ImageCustom.icMinus}
                      style={styles.iconMinusStyle}
                    />
                  </TouchableOpacity>

                  <Text style={styles.txtNumberStyle}>
                    {numberBuy}
                    {/* <Text
                      style={[
                        styles.txtNumberSumStyle,
                        { fontWeight: "normal" },
                      ]}
                    >
                      /{count}
                    </Text> */}
                  </Text>
                  <TouchableOpacity
                    onPress={plusEvent}
                    disabled={numberBuy >= count}
                  >
                    <Image
                      source={ImageCustom.icPlusNumber}
                      style={styles.iconMinusStyle}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </Section>
    );
  }, [currentTicket, officialTickets]);

  const renderButton = useMemo(() => {
    let number = 0;
    let sumPrice = 0;
    for (let i = 0; i < officialTickets.length; ++i) {
      number += officialTickets[i].numberBuy;
      sumPrice +=
        officialTickets[i].price *
        officialTickets[i].numberBuy *
        conversionRate;

      // market place todo later
      if (marketPlaceTickets && marketPlaceTickets[i]) {
        for (let j = 0; j < marketPlaceTickets[i].length; ++j) {
          let userBuy = marketPlaceTickets[i][j];
          number += userBuy.numberBuy;
          sumPrice += userBuy.tokens * userBuy.numberBuy;
        }
      }
    }

    // if (number == 0 || (marketPlaceTickets < 1 && officialTickets < 1)) {
    //   return (
    //     <View
    //       style={{
    //         backgroundColor: "#fff",
    //         elevation: 15,
    //         shadowOpacity: 0.75,
    //         shadowRadius: 10,
    //         shadowOffset: { height: 0, width: 0 },
    //         shadowColor: "rgba(0,0,0,0.3)",
    //         elevation: 10,
    //       }}
    //     >
    //       <View
    //         colors={["rgba(0, 0, 0, 0.2)"]}
    //         style={{
    //           backgroundColor: "rgba(0, 0, 0, 0.2)",
    //           justifyContent: "center",
    //           alignItems: "center",
    //           paddingVertical: 10,
    //           marginVertical: 10,
    //           width: "90%",
    //           borderRadius: 4,
    //           alignSelf: "center",
    //         }}
    //       >
    //         <Text
    //           style={{
    //             paddingVertical: 5,
    //             fontSize: 20,
    //             color: "#fff",
    //             textTransform: "uppercase",
    //             fontWeight: "bold",
    //             fontFamily: "Lato",
    //           }}
    //         >
    //           SOLD OUT
    //         </Text>
    //         <Text
    //           style={{
    //             fontSize: 14,
    //             color: "#fff",
    //             opacity: 0.5,
    //             fontFamily: "Lato",
    //           }}
    //         >
    //           No ticket available for sale on EventX
    //         </Text>
    //       </View>
    //     </View>
    //   );
    // }

    return (
      <TouchableOpacity
        disabled={number == 0}
        onPress={nextCheckoutScreen}
        style={[styles.viewBtnStyle, styles.shadownStyle]}
      >
        <LinearGradient
          colors={["#FF6195", "#C2426C"]}
          style={styles.linearGradientNextStyle}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        >
          <View style={styles.rowStyle}>
            <ImageSvg.IcTicket width={22} height={18} />
            <Text style={styles.txtNumberTicketStyle}>{number}</Text>

            <View style={styles.rowStyle}>
              <CircleIcons
                name="logo-regular"
                color="#fff"
                size={{ width: 13, height: 14.5 }}
              />
              <Text
                style={[
                  styles.txtTitleItemZero,
                  { color: "#fff", fontWeight: "bold", fontSize: 20 },
                ]}
              >
                {" "}
                {fixDecimals(sumPrice)}{" "}
              </Text>
            </View>
          </View>

          <View style={styles.rowStyle}>
            <Text style={styles.txtNumberTicketStyle}>checkout</Text>
            <Icon name="arrowright" type="antdesign" color="#fff" />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }, [officialTickets, marketPlaceTickets]);

  const renderTicketSell = useMemo(() => {
    if (!sumTicketSell) return <></>;
    return (
      <LinearGradient
        colors={["#FF6195", "#C2426C"]}
        style={styles.linearGradientStyle}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.rowStyle}>
          <Text style={[styles.txtTitleItemZero, { color: "#fff" }]}>
            You own
          </Text>
          <Text
            style={[
              styles.txtTitleItemZero,
              { color: "#fff", fontWeight: "bold", fontSize: 16 },
            ]}
          >
            {" "}
            {sumTicketSell}{" "}
          </Text>
          <Text style={[styles.txtTitleItemZero, { color: "#fff" }]}>
            tickets for this event.
          </Text>
        </View>

        <TouchableOpacity
          onPress={onNextSellScreen}
          style={styles.viewSellStyle}
        >
          <Text
            style={[
              styles.txtTitleItemZero,
              {
                color: "#fff",
                textTransform: "uppercase",
                fontSize: 16,
                fontWeight: "bold",
              },
            ]}
          >
            sell
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }, [sumTicketSell, currentTicket]);

  const renderMarket = useMemo(() => {
    if (currentTicket == -1) return null;
    const currentMarketPlaceTickets = marketPlaceTickets[currentTicket] ?? [];
    const totalTickets = currentMarketPlaceTickets.reduce((total, nextItem) => {
      return total + nextItem.tickets.length;
    }, 0);
    return (
      <Section
        customStyle={{ paddingBottom: 0 }}
        title={"from eventx marketplace (" + totalTickets + ")"}
      >
        <FlatList
          data={currentMarketPlaceTickets}
          renderItem={renderMarkPlaceTickets}
          ListEmptyComponent={() => (
            <Text style={styles.emptyMessageStyle}>
              There is currently no ticket of this event offered on the EventX
              Marketplace.
            </Text>
          )}
        />
      </Section>
    );
  }, [marketPlaceTickets, sumSalesTicket, currentTicket]);

  return (
    <View style={styles.containter}>
      <SafeAreaView style={styles.containter}>
        <View style={styles.viewHeaderStyle}>
          <Icon name="arrowleft" type="antdesign" onPress={onBackPress} />
          <Text style={styles.titleHeaderStyle} numberOfLines={1}>
            {itemEvent.name}
          </Text>
          <View style={{ width: 26 }} />
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView>
            {renderTicketSell}

            <View>
              <Carousel
                layout={"default"}
                data={officialTickets}
                sliderWidth={deviceWidth}
                itemWidth={deviceWidth * 0.8}
                renderItem={renderTicketItem}
                removeClippedSubviews={false}
                useScrollView={true}
                onBeforeSnapToItem={onBeforeSnapChange}
              />
              {renderDetail}
            </View>

            {renderOfficial}

            {renderMarket}
          </ScrollView>
          {isLoading && renderLoading}
        </View>

        {renderButton}

        <ModalEventDetailComponent
          isShowDetail={isShowDetail}
          data={officialTickets}
          currentTicket={currentTicket}
          event={itemEvent}
          onCloseModal={toggleShowDetail}
        />
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
  viewItemTiketStyle: {
    height: 90,
    width: "100%",
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: "rgba(0,0,0,0.3)",
    marginVertical: 20,
  },
  borderTiketStyle: {
    flexDirection: "row",
    borderRadius: 8,
    alignItems: "center",
    paddingRight: 16,
    backgroundColor: "#fff",
    elevation: 10,
    paddingVertical: 15,
    paddingLeft: 15,
    margin: 5,
  },
  imgBackGround: {
    height: 56,
    width: 56,
    resizeMode: "stretch",
  },
  nameTiketStyle: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: "25%",
  },
  shadownStyle: {
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: "rgba(0,0,0,0.3)",
    elevation: 10,
  },
  viewBtnStyle: {
    backgroundColor: "#fff",
    paddingVertical: 5,
  },
  viewContentStyle: {
    backgroundColor: "#fff",
    marginTop: 10,
    marginBottom: 15,
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
  rowStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
  aboutStyle: {
    backgroundColor: "#fff",
    marginBottom: 10,
    marginTop: 10,
    paddingBottom: 10,
  },
  txtMoreStyle: {
    color: "#EA5284",
    fontSize: 16,
    marginTop: 10,
    fontFamily: "Lato",
  },
  iconMinusStyle: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    //opacity: 0.3
  },
  txtNumberStyle: {
    fontSize: 22,
    color: "#000",
    fontFamily: "Lato",
    fontWeight: "bold",
    marginHorizontal: 15,
  },
  txtNumberSumStyle: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Lato",
    fontWeight: "bold",
  },
  txtTitleItemZero: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.4)",
    fontFamily: "Lato",
  },
  txtOfferedStyle: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.4)",
    fontFamily: "Lato",
    marginTop: 4,
  },
  ticketItemStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
    borderBottomWidth: 1,
  },
  iconStyle: {
    height: 16,
    width: 22,
    resizeMode: "contain",
  },
  txtContentStyle: {
    fontSize: 16,
    color: "#000",
    opacity: 0.8,
    fontFamily: "Lato",
  },
  linearGradientStyle: {
    height: 72,
    width: deviceWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  viewSellStyle: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#eba5bc",
    height: 36,
    width: 96,
    justifyContent: "center",
    alignItems: "center",
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
  emptyMessageStyle: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.4)",
    opacity: 0.8,
    // fontFamily: Platform.OS == "ios" ? null : "Lato",
    fontFamily: "Lato",
    marginLeft: 15,
    marginVertical: 15,
  },
});
