import React, { useCallback, useMemo } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Text,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { translate } from "../../../../App";
import { Icon } from "react-native-elements";
import moment from "moment";
import * as ImageSvg from "../../Icons/CircleIcons/ImageSvg";
import * as ImageCustom from "../../Icons/CircleIcons/index";
import CircleIcons from "../../Icons/CircleIcons";
import CustomImageBackground from "../../CustomImageBackground";
import LinearGradient from "react-native-linear-gradient";
import Carousel, { Pagination } from "react-native-snap-carousel";
import Modal from "react-native-modal";
import {
  fixDecimals,
  convertTokensToCurrency,
} from "../../../halpers/utilities";
import ModalEditPriceComponent from "./ModalEditPriceComponent";
import { getEventImage } from "../../../halpers/utilities";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default (SaleDetailEditTikectComponent = (props) => {
  const {
    onBackPress,
    isShowModal,
    onToggleModal,
    onCallBackPrice,
    item,
    event,
    onPluss,
    onMinus,
    conversionRate,
    currentPrice,
    onPressSave,
    isLoading,
    totalTickets,
  } = props;

  const renderLoading = useMemo(() => {
    console.log(isLoading);
    if (!isLoading) return;
    return (
      <View style={styles.viewLoadingStyle}>
        <ActivityIndicator size="large" color="#FF6195" />
      </View>
    );
  }, [isLoading]);

  const renderTiketItem = ({ item, index }) => {
    return (
      <View style={[styles.viewItemTiketStyle, styles.shadownStyle]}>
        <View style={styles.borderTiketStyle}>
          <View style={{ flex: 2 }}>
            <CustomImageBackground style={styles.imgBackGround}>
              <Image
                source={{ uri: getEventImage(event, true) }}
                style={styles.imgBackGround}
              />
            </CustomImageBackground>
          </View>

          <View style={{ flex: 6 }}>
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
              <Text style={styles.txtNumberItemStyle}>{totalTickets || 0}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderItemZeroInner = useMemo(() => {
    return (
      <View style={[styles.viewShadowStyle, styles.shadownStyle]}>
        <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
          <Text
            style={[
              styles.txtTitleItemZero,
              {
                fontFamily: "Lato",
                fontWeight: "bold",
                fontSize: 16,
                opacity: 0.8,
              },
            ]}
          >
            Quantity
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={onMinus} disabled={item.numberBuy == 1}>
            <Image source={ImageCustom.icMinus} style={styles.iconMinusStyle} />
          </TouchableOpacity>

          <Text style={styles.txtNumberSumStyle}>{item.numberBuy}</Text>

          <TouchableOpacity
            onPress={onPluss}
            disabled={totalTickets <= item.numberBuy}
          >
            <Image
              source={ImageCustom.icPlusNumber}
              style={styles.iconMinusStyle}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [item, totalTickets]);

  const renderModalScroll = () => {
    if (!currentPrice) return;
    return (
      <View style={{ flex: 1 }}>
        <Modal style={{ margin: 0 }} isVisible={isShowModal}>
          <ModalEditPriceComponent
            onCallBackPrice={onCallBackPrice}
            onToggleModal={onToggleModal}
            originalToken={currentPrice.officialTokens}
            lowestToken={currentPrice.minTokens}
          />
        </Modal>
      </View>
    );
  };

  const renderPrice = useMemo(() => {
    if (!currentPrice) return;

    return (
      <View>
        <Text
          style={[styles.txtTitleMarketStyle, { opacity: 0.4, marginTop: 20 }]}
        >
          Market price
        </Text>

        <View style={styles.viewItemContentStyle}>
          <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.txtTitleItem}>Official price</Text>
            </View>
          </View>

          <View style={styles.rowPriceStyle}>
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
              {fixDecimals(currentPrice.officialTokens)}{" "}
            </Text>
            <Text style={styles.txtTitleItemZero}>
              {" "}
              € {fixDecimals(currentPrice.officialPrice)}
            </Text>
          </View>
        </View>

        <View style={styles.viewItemContentStyle}>
          <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.txtTitleItem}>Lowest price</Text>
            </View>
          </View>

          <View style={styles.rowPriceStyle}>
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
              {fixDecimals(currentPrice.minTokens)}{" "}
            </Text>
            <Text style={styles.txtTitleItemZero}>
              {" "}
              € {fixDecimals(currentPrice.minPrice)}
            </Text>
          </View>
        </View>

        <View style={[styles.viewItemContentStyle, { marginBottom: 15 }]}>
          <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.txtTitleItem}>Highest price</Text>
            </View>
          </View>

          <View style={styles.rowPriceStyle}>
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
              {fixDecimals(currentPrice.maxTokens)}{" "}
            </Text>
            <Text style={styles.txtTitleItemZero}>
              {" "}
              € {fixDecimals(currentPrice.maxPrice)}
            </Text>
          </View>
        </View>
      </View>
    );
  }, [currentPrice]);

  const renderItemZero = useMemo(() => {
    return (
      <ScrollView>
        <View style={styles.carouselStyle}>
          <Carousel
            layout={"default"}
            data={[item]}
            sliderWidth={deviceWidth}
            itemWidth={deviceWidth * 0.8}
            renderItem={renderTiketItem}
            removeClippedSubviews={false}
            useScrollView={true}
          />
        </View>

        {renderItemZeroInner}

        <View style={[styles.viewContentStyle, styles.shadownStyle]}>
          <Text
            style={[
              styles.txtTitleMarketStyle,
              { marginBottom: 0, marginTop: 20, opacity: 0.4 },
            ]}
          >
            SELLING ON EVENTX MARKETPLACE
          </Text>

          <View
            style={[
              styles.viewItemStyle,
              {
                borderBottomColor: "rgba(0, 0, 0, 0.05)",
                borderBottomWidth: 1,
              },
            ]}
          >
            <View
              style={{ flex: 2, flexDirection: "row", alignItems: "center" }}
            >
              <View style={{ marginLeft: 10 }}>
                <Text
                  style={[
                    styles.txtTitleItemZero,
                    {
                      fontFamily: "Lato",
                      fontWeight: "bold",
                      fontSize: 16,
                      marginLeft: 5,
                      opacity: 0.8,
                    },
                  ]}
                >
                  Set price
                </Text>
              </View>
            </View>

            {/* <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}> */}
            <View
              style={[
                styles.rowPriceStyle,
                { backgroundColor: "#fff", marginRight: 0 },
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
                {fixDecimals(item.tokens)}{" "}
              </Text>
              <Text style={styles.txtTitleItemZero}>
                {" "}
                €{" "}
                {fixDecimals(
                  convertTokensToCurrency(item.tokens, conversionRate)
                )}
              </Text>

              <TouchableOpacity onPress={onToggleModal}>
                <Image
                  source={ImageCustom.icGrayPen}
                  style={styles.iconEditStyle}
                />
              </TouchableOpacity>
            </View>

            {/* </View> */}
          </View>
          {renderPrice}
          {/* <View style={styles.viewShowMoreStyle}>
            <Text style={[styles.txtTitleMarketStyle, { opacity: 0.2 }]}>
              VIEW ALL PRICEs
            </Text>
          </View> */}
        </View>
      </ScrollView>
    );
  }, [item, currentPrice, totalTickets]);

  return (
    <View style={styles.containter}>
      <SafeAreaView style={styles.containter}>
        <View style={styles.viewHeaderStyle}>
          <Icon name="arrowleft" type="antdesign" onPress={onBackPress} />
          <Text style={styles.titleHeaderStyle} numberOfLines={1}>
            Edit listing
          </Text>
          <View style={{ width: 26 }} />
        </View>
        {/* <ScrollView> */}
        <View style={styles.containter}>
          {renderItemZero}
          {renderLoading}
          <TouchableOpacity
            style={[styles.viewBtnStyle, styles.shadownStyle]}
            onPress={onPressSave}
          >
            <LinearGradient
              colors={["#FF6195", "#C2426C"]}
              style={styles.linearGradientNextStyle}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            >
              <Text style={styles.txtNumberTicketStyle}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        {/* </ScrollView> */}
        {isShowModal && renderModalScroll()}
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
    //backgroundColor: '#fff',
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
    height: 88,
    width: "100%",
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  borderTiketStyle: {
    flexDirection: "row",
    borderRadius: 8,
    borderWidth: 0.3,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    paddingRight: 15,
    backgroundColor: "#fff",
    elevation: 10,
    paddingVertical: 15,
    paddingLeft: 15,
    margin: 5,
  },
  carouselStyle: {
    paddingTop: 10,
    paddingVertical: 5,
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
    fontFamily: "Lato",
  },
  linearGradientNextStyle: {
    flexDirection: "row",
    width: "90%",
    height: 55,
    alignSelf: "center",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  viewContentStyle: {
    backgroundColor: "#fff",
    //paddingHorizontal: 15,
    marginVertical: 10,
  },
  viewItemStyle: {
    flexDirection: "row",
    marginVertical: 5,
    height: 70,
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewItemContentStyle: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewShadowStyle: {
    height: 70,
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    marginVertical: 10,
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
  txtNumberSumStyle: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Lato",
    fontWeight: "bold",
  },
  txtTitleMarketStyle: {
    fontSize: 14,
    fontFamily: "Lato",
    color: "#000",
    marginLeft: 15,
    marginVertical: 10,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  viewShowMoreStyle: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    marginVertical: 20,
    marginHorizontal: 15,
  },
  rowStyle: {
    flexDirection: "row",
  },
  txtNumberTicketStyle: {
    color: "#fff",
    marginLeft: 3,
    fontSize: 16,
    fontFamily: "Lato",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  viewBtnStyle: {
    backgroundColor: "#fff",
    paddingVertical: 5,
  },
  rowPriceStyle: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#f8f9fb",
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginRight: 15,
  },
  shadownStyle: {
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: "rgba(0,0,0,0.3)",
    elevation: 10,
  },
  viewLoadingStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    // elevation: 50,
  },
});
