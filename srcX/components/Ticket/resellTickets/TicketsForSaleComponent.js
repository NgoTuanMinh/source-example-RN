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
  FlatList,
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
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
import { Section } from "../../Layout/index";
import Modal from "react-native-modal";
import { fixDecimals } from "../../../halpers/utilities";
import ListItemTicketComponent from "./ListItemTicketComponent";
import TabNavIcon from "../../Icons/TabIcons";
import { getEventImage } from "../../../halpers/utilities";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default (TicketsForSaleComponent = (props) => {
  const {
    onBackPress,
    editTicket,
    onPressSentTo,
    dataSell,
    currentTicket,
    conversionRate,
    onBeforeSnapChange,
    focusFirtTab,
    event,
    isLoading,
    deleteTicket,
    isShowToast,
    setIsShowToast,
  } = props;

  const renderTitle = useMemo(() => {
    let sum = dataSell[currentTicket].numberBuy;
    if (focusFirtTab == 1) return "EVENTX MARKETPLACE (" + sum + ")";
    return "PRIVATE (" + sum + ")";
  }, [dataSell]);

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

          <View style={{ flex: 5 }}>
            <Text
              numberOfLines={2}
              style={[styles.nameTiketStyle, { marginHorizontal: 10 }]}
            >
              {item.translatedName}
            </Text>
          </View>
          <View
            style={{
              flex: 2,
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.viewNumberStyle}>
              <ImageSvg.IcTicket width={22} height={18} />
              <Text style={styles.txtNumberStyle}>{item.numberBuy}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderLoading = useMemo(() => {
    if (!isLoading) return;
    return (
      <View style={styles.viewLoadingStyle}>
        <ActivityIndicator size="large" color="#FF6195" />
      </View>
    );
  }, [isLoading]);

  const renderToast = () => {
    return (
      <View style={styles.mainToast}>
        <View style={{ width: "85%", padding: 10 }}>
          <Text style={styles.textToast}>Ticket salse successfully</Text>
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
          <TouchableOpacity onPress={() => setIsShowToast(false)}>
            <Image
              source={require("../../../../assets/images/icClose.png")}
              style={{
                height: 14,
                width: 14,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.containter}>
      <SafeAreaView style={styles.containter}>
        <View style={styles.viewHeaderStyle}>
          <Icon
            name="close"
            color="black"
            type="antdesign"
            size={22}
            onPress={isLoading == true ? null : onBackPress}
          />
          <Text style={styles.titleHeaderStyle} numberOfLines={1}>
            TICKETS FOR SALE
          </Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView>
          <View style={{ marginVertical: 10 }}>
            <CustomImageBackground
              style={styles.imageEventStyle}
              imageStyle={{ borderRadius: 8 }}
            >
              <Image
                source={{ uri: getEventImage(event, false) }}
                style={styles.imageEventStyle}
              />
            </CustomImageBackground>
          </View>

          <Carousel
            layout={"default"}
            data={dataSell}
            sliderWidth={deviceWidth}
            itemWidth={deviceWidth * 0.8}
            renderItem={renderTiketItem}
            removeClippedSubviews={false}
            useScrollView={true}
            onBeforeSnapToItem={onBeforeSnapChange}
          />

          <Section customStyle={{ paddingBottom: 0 }} title={renderTitle}>
            <ListItemTicketComponent
              item={dataSell[currentTicket]}
              tokens={dataSell[currentTicket].tokens}
              conversionRate={conversionRate}
              editTicket={editTicket}
              deleteTicket={deleteTicket}
            />
          </Section>

          <View style={styles.viewButtonStyle}>
            {/* <TouchableOpacity
                            style={styles.buttonStyle}>
                            <LinearGradient
                                colors={['#74BBFC', '#1D7DD7',]}
                                style={styles.linearGradientStyle}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <ImageSvg.icCopy width={30} height={28} />

                            </LinearGradient>
                            <Text style={styles.txtRefreshStyle}>Copy link</Text>
                        </TouchableOpacity> */}

            <TouchableOpacity
              onPress={onPressSentTo}
              style={styles.buttonStyle}
            >
              <LinearGradient
                colors={["#B9F215", "#48A44A"]}
                style={styles.linearGradientStyle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <TabNavIcon color="#fff" name="Contacts" />
              </LinearGradient>
              <Text style={styles.txtRefreshStyle}>Send to</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.buttonStyle}>
              <LinearGradient
                colors={["#FF6195", "#C2426C"]}
                style={styles.linearGradientStyle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <ImageSvg.icShare width={22} height={22} />
              </LinearGradient>
              <Text style={styles.txtRefreshStyle}>Share</Text>
            </TouchableOpacity> */}
          </View>
          {/* {isShowToast === true ? renderToast() : null} */}
          {renderLoading}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
});

const styles = StyleSheet.create({
  containter: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
  viewContentStyle: {
    flex: 1,
  },
  imageEventStyle: {
    width: deviceWidth,
    // height: deviceHeight * 0.35,
    // height: 210,
    height: deviceWidth / (375 / 210),
    alignSelf: "center",
    borderRadius: 8,
  },
  viewItemTiketStyle: {
    height: 88,
    width: "100%",
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 25,
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
    paddingLeft: 16,
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
  viewButtonStyle: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 15,
    marginBottom: 20,
    marginHorizontal: 30,
  },
  buttonStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
  txtRefreshStyle: {
    fontFamily: "Lato",
    fontSize: 14,
  },
  linearGradientStyle: {
    height: 65,
    width: 65,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    //marginHorizontal: 10,
    marginBottom: 10,
  },
  nameTiketStyle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  shadownStyle: {
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: "rgba(0,0,0,0.3)",
    elevation: 10,
  },
  viewNumberStyle: {
    position: "absolute",
    right: 16,
    flexDirection: "row",
    height: 48,
    width: 48,
    borderRadius: 25,
    backgroundColor: "#EA5284",
    justifyContent: "center",
    alignItems: "center",
  },
  txtNumberStyle: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Lato",
  },
  nameTiketStyle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  viewFlatlitStyle: {
    width: "100%",
    backgroundColor: "#fff",
    marginBottom: 16,
    paddingTop: 20,
    marginTop: 5,
  },
  title: {
    textTransform: "uppercase",
    paddingBottom: 10,
    fontFamily: "Lato-bold",
    fontWeight: "bold",
    color: "#000",
    opacity: 0.4,
  },
  rowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    paddingRight: 15,
  },
  icStyle: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    tintColor: "#000",
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
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 4,
  },
});
