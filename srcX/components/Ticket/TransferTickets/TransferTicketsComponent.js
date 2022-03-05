import React, { useCallback, useMemo } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  FlatList,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
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
import SearchComponent from "../../SearchComponent";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
import { Section } from "../../Layout/index";
import { getEventImage } from "../../../halpers/utilities";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const config = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
  detectSwipeUp: false,
  detectSwipeDown: false,
  detectSwipeRight: false,
};

export default (TransferTicketsComponent = (props) => {
  const {
    navigation,
    onBackPress,
    activeSlide,
    refCarousel,
    nextActiveSlide,
    valueSearch,
    setSearchedValue,
    onSwipeLeft,
    onTransferClick,
    contactEventX,
    nextActiveSlideFirt,
    onPressCheck,
    tickets,
    conversionRate,
    onPressMinus,
    onPressPlus,
    isLoading,
    event,
  } = props;

  console.log("thai event", event);

  const renderTextPagination = useCallback(() => {
    if (activeSlide == 0) {
      return <Text style={styles.txtTitlePaginationStyle}>Select tickets</Text>;
    }
    if (activeSlide == 1) {
      return (
        <Text style={styles.txtTitlePaginationStyle}>Select a recipient</Text>
      );
    }
    return <Text style={styles.txtTitlePaginationStyle}>Overview</Text>;
  }, [activeSlide]);

  const renderItemPagination = () => {
    return [0, 1, 2].map((item) => {
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

  const renderItemZeroInner = ({ item, index }) => {
    return (
      <View style={[styles.viewItemStyle, { paddingBottom: 15 }]}>
        <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
          <CustomImageBackground style={styles.imgBackGround}>
            <Image
              source={{ uri: getEventImage(event, true) }}
              style={styles.imgBackGround}
            />
          </CustomImageBackground>

          <View style={{ marginLeft: 15 }}>
            <Text
              numberOfLines={2}
              style={[styles.txtTitleItemZero, { marginRight: "25%" }]}
            >
              {item.translatedName}
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            disabled={item.numberBuy == 0}
            onPress={() => onPressMinus(index)}
          >
            <Image source={ImageCustom.icMinus} style={styles.iconMinusStyle} />
          </TouchableOpacity>

          <Text style={styles.txtNumberStyle}>
            {item.numberBuy}
            <Text style={[styles.txtNumberSumStyle, { fontWeight: "normal" }]}>
              /{item.tickets.length}
            </Text>
          </Text>

          <TouchableOpacity
            disabled={item.numberBuy >= item.tickets.length}
            onPress={() => onPressPlus(index)}
          >
            <Image
              source={ImageCustom.icPlusNumber}
              style={styles.iconMinusStyle}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderContact = useCallback(({ item, index, isShow }) =>
    renderItemContact(item, index, onPressCheck, isShow)
  );

  const renderItemContact = (item, index, onPressCheck, isShow = false) => {
    const sighIcon = `${item.givenName ? item.givenName.charAt(0) : ""}${
      item.familyName ? item.familyName.charAt(0) : ""
    }`;
    if (sighIcon.length == 0) {
      return null;
    }
    const leftElement =
      item.thumbnailPath && item.thumbnailPath.length > 0
        ? { uri: item.thumbnailPath }
        : sighIcon;

    return (
      <>
        <TouchableOpacity
          onPress={() => onPressCheck(item, index)}
          disabled={activeSlide == 2}
          style={[
            styles.viewItemStyle,
            {
              borderBottomWidth: 0,
              // marginVertical: 15,
              backgroundColor:
                item.isCheck && isShow == false
                  ? ["rgba(194, 66, 108, 0.06)", "rgba(255, 97, 149, 0.06)"]
                  : null,
              paddingVertical: 15,
            },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <CustomImageBackground
              image={ImageCustom.icAvatar}
              style={styles.imgBackGroundContact}
            >
              <CircleIcons
                content={leftElement}
                background={["#e8e8e8", "#d1d1d1"]}
                style={styles.imgBackGroundContact}
              />
            </CustomImageBackground>

            <View style={{ marginLeft: 15 }}>
              <Text style={styles.txtTitleItemZero}>{item.givenName}</Text>
              <Text style={[{ opacity: 0.4, marginTop: 5 }]}>{item.value}</Text>
            </View>
          </View>

          {!isShow && (
            <View
              style={{
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {item.isCheck ? (
                // <LinearGradient
                //   colors={["#FF6195", "#C2426C"]}
                //   style={styles.linearGradientCheckStyle}
                //   start={{ x: 0, y: 0 }}
                //   end={{ x: 1, y: 1 }}
                // >
                <Image
                  source={ImageCustom.icChecked}
                  style={styles.icTickStyle}
                />
              ) : (
                // </LinearGradient>
                <View style={styles.viewBorderStyle} />
              )}
            </View>
          )}
        </TouchableOpacity>
      </>
    );
  };

  const renderItemTwo = useMemo(() => {
    const isNext = contactEventX.filter((item) => item.isCheck);
    let sumPrice = 0;
    for (let i = 0; i < tickets.length; ++i) {
      sumPrice += tickets[i].numberBuy;
    }
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* <GestureRecognizer
                    onSwipeRight={(state) => onSwipeLeft(0)}
                    config={config}
                    style={{
                        flex: 1,
                        backgroundColor: "#fff"
                    }}
                > */}
        <SearchComponent
          values={valueSearch}
          setSearchedValue={setSearchedValue}
          isShowBack={false}
          customStyle={styles.searchStyle}
        />
        <Text style={styles.txtHeaderContactStyle}>
          {contactEventX.length} contacts on EventX
        </Text>

        <ScrollView>
          {contactEventX &&
            contactEventX.map((item, index) =>
              renderItemContact(item, index, onPressCheck)
            )}
        </ScrollView>

        {/* <View style={{ flex: 1, }}>
                        <FlatList
                            data={contactEventX}
                            renderItem={renderContact}
                            keyExtractor={(item, index) => String(item.key)}
                            removeClippedSubviews={true}
                            maxToRenderPerBatch={30}
                            initialNumToRender={10}
                        />
                    </View> */}

        {/* </GestureRecognizer> */}

        <TouchableOpacity
          disabled={isNext.length == 0}
          style={styles.viewBtnStyle}
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
              <Text style={styles.txtNumberTicketStyle}>{sumPrice}</Text>
            </View>

            <View style={styles.rowStyle}>
              <Text style={styles.txtNumberTicketStyle}>Proceed</Text>
              <Icon name="arrowright" type="antdesign" color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }, [contactEventX, activeSlide]);

  const renderItemZeroInnerThree = ({ item, index }) => {
    return (
      <View style={[styles.viewItemStyle, { borderBottomWidth: 0 }]}>
        <View style={{ flexDirection: "row" }}>
          <CustomImageBackground style={styles.imgBackGround}>
            <Image
              source={{ uri: getEventImage(event, true) }}
              style={styles.imgBackGround}
            />
          </CustomImageBackground>

          <View style={{ marginLeft: 15 }}>
            <Text
              numberOfLines={2}
              style={[styles.txtTitleItemZero, { marginRight: "30%" }]}
            >
              {item.translatedName}
            </Text>
            <Text />
          </View>
        </View>

        <View style={{}}>
          <Text style={styles.txtNumberSumStyle}>x {item.numberBuy}</Text>
          <Text />
        </View>
      </View>
    );
  };

  const renderItemThree = useMemo(() => {
    let newDataTicket = [];
    let sumNumber = 0;
    tickets.map((item) => {
      if (item.numberBuy > 0) {
        sumNumber += item.numberBuy;
        newDataTicket.push(item);
      }
    });
    const dataContactSelected = contactEventX.filter((item) => item.isCheck);
    return (
      <View style={{ flex: 1 }}>
        {/* <GestureRecognizer
                    onSwipeRight={(state) => onSwipeLeft(1)}
                    config={config}
                    style={{ flex: 1, }}
                > */}
        <ScrollView>
          <View style={[styles.viewShadown, styles.shadownStyle]}>
            <View
              style={[
                styles.rowStyle,
                {
                  justifyContent: "space-between",
                  paddingHorizontal: 15,
                  marginTop: 15,
                  marginBottom: 5,
                },
              ]}
            >
              <Text style={styles.txtPriceItemZero}>{sumNumber} tickets</Text>

              <TouchableOpacity onPress={(state) => onSwipeLeft(0)}>
                <Text style={[styles.txtPriceItemZero, { color: "#EA5284" }]}>
                  {" "}
                  edit
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={newDataTicket}
              renderItem={renderItemZeroInnerThree}
              keyExtractor={(item, index) => String(index)}
            />
          </View>

          <View
            style={[
              styles.viewShadown,
              styles.shadownStyle,
              { minHeight: 150 },
            ]}
          >
            <View
              style={[
                styles.rowStyle,
                {
                  justifyContent: "space-between",
                  paddingHorizontal: 15,
                  marginTop: 15,
                  marginBottom: 5,
                },
              ]}
            >
              <Text style={styles.txtPriceItemZero}>receiver</Text>
              <TouchableOpacity onPress={(state) => onSwipeLeft(1)}>
                <Text style={[styles.txtPriceItemZero, { color: "#EA5284" }]}>
                  {" "}
                  edit
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={dataContactSelected}
              renderItem={({ item, index }) =>
                renderContact({ item, index, isShow: true })
              }
              keyExtractor={(item, index) => String(index)}
            />
          </View>
        </ScrollView>
        {/* </GestureRecognizer> */}

        <TouchableOpacity
          style={styles.viewBtnStyle}
          onPress={() => onTransferClick(newDataTicket, dataContactSelected)}
        >
          <LinearGradient
            colors={["#FF6195", "#C2426C"]}
            style={[
              styles.linearGradientNextStyle,
              { justifyContent: "center" },
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          >
            <Text style={styles.txtNumberTicketStyle}>Transfer</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }, [contactEventX, activeSlide, tickets]);

  const renderItemZero = useMemo(() => {
    if (!tickets) return null;
    let sumPrice = 0;
    for (let i = 0; i < tickets.length; ++i) {
      sumPrice += tickets[i].numberBuy;
    }
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <FlatList
          data={tickets}
          renderItem={renderItemZeroInner}
          keyExtractor={(item, index) => String(index)}
        />
        <TouchableOpacity
          disabled={sumPrice == 0}
          style={styles.viewBtnStyle}
          onPress={nextActiveSlideFirt}
        >
          <LinearGradient
            colors={["#FF6195", "#C2426C"]}
            style={styles.linearGradientNextStyle}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          >
            <View style={styles.rowStyle}>
              <ImageSvg.IcTicket width={22} height={18} />
              <Text style={styles.txtNumberTicketStyle}>{sumPrice}</Text>
            </View>

            <View style={styles.rowStyle}>
              <Text style={styles.txtNumberTicketStyle}>select contact</Text>
              <Icon name="arrowright" type="antdesign" color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }, [activeSlide, tickets]);

  const renderLoading = useMemo(() => {
    return (
      <View style={styles.viewLoadingStyle}>
        <ActivityIndicator size="large" color="#FF6195" />
      </View>
    );
  }, [isLoading]);

  const renderItemCarousel = ({ item, index }) => {
    if (index == 1) {
      return renderItemTwo;
    }
    if (index == 2) {
      return renderItemThree;
    }
    return renderItemZero;
  };

  return (
    <View style={[styles.containter, { backgroundColor: "#fff" }]}>
      <SafeAreaView style={styles.containter}>
        <View style={styles.viewHeaderStyle}>
          <Icon
            name="arrowleft"
            type="antdesign"
            onPress={onBackPress}
            size={25}
          />
          <Text style={styles.titleHeaderStyle} numberOfLines={1}>
            transfer tickets
          </Text>
          <View style={{ width: 26 }} />
        </View>
        <View style={{ flex: 1 }}>
          {pagination()}
          <View style={{ flex: 1 }}>
            <Carousel
              data={[0, 1, 2]}
              ref={refCarousel}
              renderItem={renderItemCarousel}
              sliderWidth={deviceWidth}
              itemWidth={deviceWidth}
              firstItem={0}
              layout={"default"}
              containerCustomStyle={{ overflow: "visible" }}
              scrollEnabled={false}
            />
            {isLoading && renderLoading}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
});

const styles = StyleSheet.create({
  containter: {
    flex: 1,
  },
  viewHeaderStyle: {
    flexDirection: "row",
    paddingHorizontal: 15,
    height: 56,
    width: "100%",
    backgroundColor: "#fff",
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
  imgBackGroundContact: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
  },
  imgBackGround: {
    height: 56,
    width: 56,
    resizeMode: "stretch",
  },
  imageItemStyle: {
    height: 50,
    width: 50,
    resizeMode: "stretch",
  },
  viewItemStyle: {
    flexDirection: "row",
    // marginTop: 10,
    paddingHorizontal: 15,
    justifyContent: "space-between",
    //alignItems: 'center',
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    borderBottomWidth: 0.5,
  },
  iconMinusStyle: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    //opacity: 0.3
  },
  iconStyle: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },
  icTickStyle: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  linearGradientCheckStyle: {
    height: 20,
    width: 20,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  viewBorderStyle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "gray",
  },
  txtTitleItemZero: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Lato",
    fontWeight: "bold",
  },
  txtPriceItemZero: {
    fontSize: 14,
    fontFamily: "Lato",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  txtPriceEuro: {
    fontSize: 14,
    fontFamily: "Lato",
    textTransform: "uppercase",
  },
  txtNumberStyle: {
    fontSize: 22,
    color: "#000",
    fontFamily: "Lato",
    fontWeight: "bold",
  },
  txtNumberSumStyle: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Lato",
    fontWeight: "bold",
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
  txtHeaderContactStyle: {
    fontSize: 12,
    marginLeft: 15,
    textTransform: "uppercase",
    opacity: 0.4,
    backgroundColor: "#fff",
    marginVertical: 10,
    fontWeight: "bold",
  },
  viewShadown: {
    //height: '50%',
    width: "100%",
    backgroundColor: "#fff",
    marginBottom: 15,
    paddingTop: 5,
    paddingBottom: 15,
    marginVertical: 5,
  },
  viewBtnStyle: {
    backgroundColor: "#fff",
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: "rgba(0,0,0,0.3)",
    elevation: 10,
    marginTop: 10,
    paddingVertical: 5,
  },
  shadownStyle: {
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: "rgba(0,0,0,0.3)",
    elevation: 10,
  },
  searchStyle: {
    paddingLeft: 5,
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
  },
});
