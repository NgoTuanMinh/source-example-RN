import React, { useCallback, useMemo } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { translate } from "../../../../App";
import { Icon } from "react-native-elements";
import * as ImageSvg from "../../Icons/CircleIcons/ImageSvg";
import * as ImageCustom from "../../Icons/CircleIcons/index";
import CircleIcons from "../../Icons/CircleIcons";
import CustomImageBackground from "../../CustomImageBackground";
import LinearGradient from "react-native-linear-gradient";
import Carousel, { Pagination } from "react-native-snap-carousel";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
import { Section } from "../../Layout/index";
import Modal from "react-native-modal";
import {
  fixDecimals,
  convertTokensToCurrency,
} from "../../../halpers/utilities";
import ModalEditPriceComponent from "./ModalEditPriceComponent";
import { getEventImage } from "../../../halpers/utilities";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const config = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};

export default (ResellTicketsComponent = (props) => {
  const {
    onBackPress,
    activeSlide = 0,
    isShowModal,
    onToggleModal,
    onCallBackPrice,
    refCarousel,
    setActiveSlide,
    nextActiveSlide,
    onSwipeLeft,
    onNextTicketsForSale,
    isLoading,
    dataSell,
    currentTicket,
    conversionRate,
    onPressPlus,
    onPressMinus,
    onBeforeSnapChange,
    focusFirtTab,
    nextTabTwo,
    nextTabOne,
    currentPrice,
    refTicketView,
    event,
  } = props;

  const renderTextPagination = useCallback(() => {
    if (activeSlide == 0) {
      return (
        <Text style={styles.txtTitlePaginationStyle}>
          Select ticket(s) & Set price
        </Text>
      );
    }
    return <Text style={styles.txtTitlePaginationStyle}>Overview</Text>;
  }, [activeSlide]);

  const renderItemPagination = () => {
    return [0, 1].map((item) => {
      return (
        <LinearGradient
          colors={
            activeSlide < item
              ? ["rgba(0, 0, 0, 0.2)", "rgba(0, 0, 0, 0.2)"]
              : ["#FF6195", "#C2426C"]
          }
          style={styles.linearGradientStyle}
        />
      );
    });
  };

  const pagination = useCallback(() => {
    return (
      <View style={styles.viewCenterStyle}>
        <View style={styles.viewPaginationStyle}>{renderItemPagination()}</View>
        {renderTextPagination()}
      </View>
    );
  }, [activeSlide]);

  const renderTiketItem = ({ item, index }) => {
    return (
      <View key={index} style={styles.viewItemTiketStyle}>
        <View style={styles.borderTiketStyle}>
          <View style={{ flex: 2 }}>
            <CustomImageBackground style={styles.imgBackGround}>
              <Image
                source={{ uri: getEventImage(event, true) }}
                style={styles.imgBackGround}
              />
            </CustomImageBackground>
          </View>

          <View style={{ flex: 5 }}>
            <Text
              numberOfLines={2}
              style={[styles.nameTiketStyle, { marginHorizontal: 15 }]}
            >
              {item.translatedName}
            </Text>
          </View>
          <View style={{ flex: 2 }}>
            <View style={styles.viewNumberStyle}>
              <ImageSvg.IcTicket width={22} height={18} />
              <Text style={styles.txtNumberItemStyle}>
                {item.tickets.length}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderItemZeroInner = useMemo(() => {
    if (!dataSell) return null;
    const item = dataSell[currentTicket];
    return (
      <View style={styles.viewShadowStyle}>
        <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
          <View style={{}}>
            <Text
              style={[
                styles.txtTitleItemZero,
                { fontFamily: "Lato", fontWeight: "bold", opacity: 0.8 },
              ]}
            >
              Quantity
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            disabled={item.numberBuy == 0}
            onPress={onPressMinus}
          >
            <Image source={ImageCustom.icMinus} style={styles.iconMinusStyle} />
          </TouchableOpacity>

          <Text style={styles.txtNumberSumStyle}>{item.numberBuy}</Text>

          <TouchableOpacity
            disabled={item.numberBuy >= item.tickets.length}
            onPress={onPressPlus}
          >
            <Image
              source={ImageCustom.icPlusNumber}
              style={styles.iconMinusStyle}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [currentTicket, dataSell]);

  const renderModalScroll = () => {
    console.log(currentPrice, " - ", currentTicket);
    if (!currentPrice || currentPrice.length <= currentTicket) return;
    const officialToken =
      currentPrice[currentTicket].officialPrice * conversionRate;
    let lowestToken = officialToken;
    if (
      currentPrice[currentTicket].marketPlace &&
      currentPrice[currentTicket].marketPlace.minTokens
    ) {
      lowestToken = currentPrice[currentTicket].marketPlace.minTokens;
    }
    // console.log("thai", isShowModal);
    return (
      <Modal style={{ margin: 0 }} isVisible={isShowModal}>
        <ModalEditPriceComponent
          onCallBackPrice={onCallBackPrice}
          onToggleModal={onToggleModal}
          originalToken={officialToken}
          lowestToken={lowestToken}
        />
      </Modal>
    );
  };

  const renderCurrentPriceView = useMemo(() => {
    if (!currentPrice || currentPrice.length <= currentTicket) return;
    let priceModel = currentPrice[currentTicket];
    let lowestPrice = priceModel.officialPrice;
    let highestPrice = lowestPrice;

    if (priceModel.marketPlace && priceModel.marketPlace.minTokens) {
      highestPrice = convertTokensToCurrency(
        priceModel.marketPlace.maxTokens,
        conversionRate
      );
      lowestPrice = convertTokensToCurrency(
        priceModel.marketPlace.minTokens,
        conversionRate
      );
    }

    return (
      <View>
        <Text
          style={[
            styles.txtTitleMarketStyle,
            { marginLeft: 15, marginTop: 20 },
          ]}
        >
          Market price
        </Text>
        <View style={styles.viewItemContentStyle}>
          <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
            <View style={{}}>
              <Text style={styles.txtTitleItem}>Official price</Text>
            </View>
          </View>

          <View style={styles.viewItemPrice}>
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
              {fixDecimals(priceModel.officialPrice * conversionRate)}
              <Text style={[styles.txtTitleItemZero, { fontWeight: "normal" }]}>
                {" "}
                € {fixDecimals(priceModel.officialPrice)}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.viewItemContentStyle}>
          <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
            <View style={{}}>
              <Text style={styles.txtTitleItem}>Lowest price</Text>
            </View>
          </View>

          <View style={styles.viewItemPrice}>
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
              {fixDecimals(lowestPrice * conversionRate)}
              <Text style={[styles.txtTitleItemZero, { fontWeight: "normal" }]}>
                {" "}
                € {fixDecimals(lowestPrice)}
              </Text>
            </Text>
          </View>
        </View>

        <View style={[styles.viewItemContentStyle, { marginBottom: 15 }]}>
          <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
            <View style={{}}>
              <Text style={styles.txtTitleItem}>Highest price</Text>
            </View>
          </View>

          <View style={styles.viewItemPrice}>
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
              {fixDecimals(highestPrice * conversionRate)}
              <Text style={[styles.txtTitleItemZero, { fontWeight: "normal" }]}>
                {" "}
                € {fixDecimals(highestPrice)}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    );
  }, [currentPrice, currentTicket]);

  const renderItemZero = useMemo(() => {
    if (!dataSell) return null;
    const item = dataSell[currentTicket];

    let number = 0;
    for (let i = 0; i < dataSell.length; ++i) {
      number += dataSell[i].numberBuy;
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <Carousel
            layout={"default"}
            data={dataSell}
            sliderWidth={deviceWidth}
            itemWidth={deviceWidth * 0.8}
            renderItem={renderTiketItem}
            removeClippedSubviews={false}
            ref={refTicketView}
            useScrollView={true}
            onBeforeSnapToItem={onBeforeSnapChange}
          />

          {renderItemZeroInner}

          <View style={[styles.viewContentStyle, styles.shadownStyle]}>
            <View
              style={[
                styles.viewItemContentStyle,
                {
                  borderBottomColor: "rgba(0, 0, 0, 0.05)",
                  borderBottomWidth: 1,
                  paddingVertical: 10,
                },
              ]}
            >
              <View
                style={{ flex: 2, flexDirection: "row", alignItems: "center" }}
              >
                <View style={{}}>
                  <Text
                    style={[
                      styles.txtTitleItemZero,
                      { fontFamily: "Lato", fontWeight: "bold", opacity: 0.8 },
                    ]}
                  >
                    Set price
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.viewItemPrice,
                  { backgroundColor: "#fff", paddingRight: 0 },
                ]}
              >
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
                  <Text
                    style={[styles.txtTitleItemZero, { fontWeight: "normal" }]}
                  >
                    {" "}
                    € {fixDecimals(item.price)}
                  </Text>
                </Text>

                <TouchableOpacity onPress={onToggleModal}>
                  <Image
                    source={ImageCustom.icGrayPen}
                    style={styles.iconEditStyle}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {renderCurrentPriceView}

            {/* <View style={styles.viewShowMoreStyle}>
              <Text style={[styles.txtTitleMarketStyle, { opacity: 0.2 }]}>
                VIEW ALL TICKETS
              </Text>
            </View> */}
          </View>
        </ScrollView>

        <TouchableOpacity
          disabled={number == 0}
          style={[styles.viewBtnStyle, styles.shadownStyle]}
          onPress={nextActiveSlide}
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
            </View>

            <View style={styles.rowStyle}>
              <Text style={styles.txtNumberTicketStyle}>Proceed</Text>
              <Icon name="arrowright" type="antdesign" color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }, [currentTicket, dataSell, currentPrice]);

  const renderItemZeroInnerThree = (item) => {
    if (!item || item.numberBuy == 0) return null;

    return (
      <View style={[styles.viewItemStyle, { paddingHorizontal: 20 }]}>
        <View style={{ flex: 7, flexDirection: "row" }}>
          <CustomImageBackground style={styles.imgBackGround}>
            <Image
              source={{ uri: getEventImage(event, true) }}
              style={styles.imgBackGround}
            />
          </CustomImageBackground>

          <View style={{ marginHorizontal: 15, height: "100%" }}>
            <Text
              numberOfLines={2}
              style={[
                styles.txtTitleItemZero,
                { fontWeight: "bold", paddingRight: 25 },
              ]}
            >
              {item.translatedName}
            </Text>
          </View>
        </View>

        <View style={{ flex: 3, alignItems: "flex-end" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={[
                styles.txtTitleItemZero,
                { fontWeight: "bold", marginRight: 5 },
              ]}
            >
              {item.numberBuy} x{" "}
            </Text>
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
              {fixDecimals(item.price * conversionRate)}
            </Text>
          </View>
          <Text
            style={[
              styles.txtTitleItemZero,
              { color: "rgba(0, 0, 0, 0.4)", fontWeight: "400" },
            ]}
          >
            € {fixDecimals(item.price)}
          </Text>
        </View>
      </View>
    );
  };

  const renderListSell = useMemo(() => {
    if (!dataSell) return null;
    let newData = [];
    let number = 0;
    for (let i = 0; i < dataSell.length; ++i) {
      const item = dataSell[i];
      if (item.numberBuy > 0) {
        number += item.numberBuy;
        newData.push(item);
      }
    }

    return (
      <View
        style={[
          styles.viewBtnStyle,
          { marginVertical: 10, paddingTop: 10 },
          styles.shadownStyle,
        ]}
      >
        <View style={styles.viewTitleFlatlistStyle}>
          <Text style={styles.txtLengthStyle}>{number} tickets</Text>
          <Text
            onPress={onSwipeLeft}
            style={[styles.txtLengthStyle, { color: "#EA5284" }]}
          >
            EDIT
          </Text>
        </View>

        {newData.map((item) => renderItemZeroInnerThree(item))}
      </View>
    );
  }, [dataSell]);

  const renderItemTwo = useMemo(() => {
    if (!dataSell) return null;
    return (
      <View style={{ flex: 1 }}>
        {/* <GestureRecognizer
                    onSwipeRight={onSwipeLeft}
                    config={config}
                    style={{ flex: 1, }}
                > */}
        <ScrollView>
          {renderListSell}

          <View style={[{ height: 150, backgroundColor: "#fff" }]}>
            <View style={styles.containerBar}>
              <TouchableOpacity
                onPress={nextTabOne}
                style={focusFirtTab == 1 ? styles.showStyle : styles.hideStyle}
              >
                <Text
                  style={
                    focusFirtTab == 1
                      ? styles.txtShowStyle
                      : styles.txtHideStyle
                  }
                >
                  MARKETPLACE
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={nextTabTwo}
                style={focusFirtTab == 2 ? styles.showStyle : styles.hideStyle}
              >
                <Text
                  style={
                    focusFirtTab == 2
                      ? styles.txtShowStyle
                      : styles.txtHideStyle
                  }
                >
                  private
                </Text>
              </TouchableOpacity>
            </View>
            <LinearGradient
              colors={["#F2F2F2", "#FAFAFA", "#fff"]}
              style={styles.linearGradient}
            />

            <View style={styles.containerDetail}>
              {focusFirtTab == 1 && (
                <Text style={styles.txtDetailStyle}>
                  Your tickets will be publicly listed on the EventX
                  marketplace. (Recommended)
                </Text>
              )}
              {focusFirtTab == 2 && (
                <Text style={styles.txtDetailStyle}>
                  Only invited people will see your listing.
                </Text>
              )}
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={[styles.viewBtnStyle, styles.shadownStyle]}
          onPress={onNextTicketsForSale}
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
            <Text style={styles.txtNumberTicketStyle}>confirm</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* </GestureRecognizer> */}
      </View>
    );
  }, [dataSell, focusFirtTab]);

  const renderItemCarousel = ({ item, index }) => {
    if (index == 1) {
      return renderItemTwo;
    }

    return renderItemZero;
  };

  const renderLoading = useMemo(() => {
    return (
      <View style={styles.viewLoadingStyle}>
        <ActivityIndicator size="large" color="#FF6195" />
      </View>
    );
  }, [isLoading]);

  return (
    <View style={styles.containter}>
      <SafeAreaView style={styles.containter}>
        <View style={styles.viewHeaderStyle}>
          <Icon name="arrowleft" type="antdesign" onPress={onBackPress} />
          <Text style={styles.titleHeaderStyle} numberOfLines={1}>
            sell tickets
          </Text>
          <View style={{ width: 26 }} />
        </View>
        <View style={{ flex: 1 }}>
          {pagination()}
          <View style={{ flex: 1 }}>
            {dataSell && (
              <Carousel
                data={[0, 1]}
                ref={refCarousel}
                renderItem={renderItemCarousel}
                sliderWidth={deviceWidth}
                itemWidth={deviceWidth}
                firstItem={0}
                layout={"default"}
                containerCustomStyle={{ overflow: "visible" }}
                scrollEnabled={false}
              />
            )}
            {isLoading && renderLoading}
          </View>
          {isShowModal && renderModalScroll()}
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
  linearGradientStyle: {
    width: 32,
    height: 4,
    marginHorizontal: 4,
    borderRadius: 5,
  },
  viewPaginationStyle: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  viewCenterStyle: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  txtTitlePaginationStyle: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Lato",
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
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

  imageItemStyle: {
    height: 56,
    width: 56,
    resizeMode: "stretch",
    marginLeft: 1,
  },

  viewNumberStyle: {
    flexDirection: "row",
    height: 48,
    width: 48,
    borderRadius: 25,
    backgroundColor: "#EA5284",
    justifyContent: "center",
    alignItems: "center",
  },
  txtNumberItemStyle: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Lato",
  },
  nameTiketStyle: {
    fontWeight: "bold",
    fontSize: 16,
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
  viewContentStyle: {
    backgroundColor: "#fff",
    marginTop: 10,
    marginBottom: 15,
  },
  viewItemStyle: {
    flexDirection: "row",
    marginVertical: 5,
    height: 70,
    justifyContent: "space-between",
  },
  viewItemContentStyle: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  viewShadowStyle: {
    height: 70,
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 15,

    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: "rgba(0,0,0,0.3)",
    elevation: 10,

    marginBottom: 10,
  },
  iconMinusStyle: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    //opacity: 0.3
  },
  iconEditStyle: {
    height: 18,
    width: 18,
    resizeMode: "contain",
    marginLeft: 3,
    marginRight: 5,
  },
  txtTitleItemZero: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Lato",
  },
  txtTitleItem: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Lato",
    opacity: 0.8,
  },
  txtPriceItemZero: {
    fontSize: 14,
    fontFamily: "Lato",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  txtNumberSumStyle: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Lato",
    fontWeight: "bold",
  },
  txtTitleMarketStyle: {
    fontSize: 14,
    fontFamily: "Lato",
    opacity: 0.3,
    color: "#000",
    marginVertical: 10,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  viewShowMoreStyle: {
    justifyContent: "center",
    alignItems: "center",
    height: 45,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.4)",
    marginVertical: 20,
    marginHorizontal: 15,
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
  tabStyle: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewTitleFlatlistStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
    marginLeft: 5,
  },
  txtLengthStyle: {
    fontSize: 13,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  viewItemPrice: {
    flexDirection: "row",
    backgroundColor: "#f8f9fb",
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 110,
  },
  viewBtnStyle: {
    backgroundColor: "#fff",
    paddingVertical: 5,
  },
  shadownStyle: {
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: "rgba(0,0,0,0.3)",
    elevation: 10,
  },
  linearGradient: {
    height: 10,
  },
  containerBar: {
    height: 48,
    width: deviceWidth - 30,
    borderRadius: 48,
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
    backgroundColor: "#fff",

    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: "rgba(0,0,0,0.3)",
    elevation: 10,
  },
  showStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EA5284",
    height: 48,
    borderRadius: 48,
  },
  hideStyle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 48,
  },
  txtShowStyle: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  txtHideStyle: {
    color: "rgba(0, 0, 0, 0.4)",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  containerDetail: {
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  txtDetailStyle: {
    marginVertical: 10,
    minHeight: 150,
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
