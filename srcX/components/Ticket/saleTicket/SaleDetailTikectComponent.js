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
import { translate } from "../../../../App";
import { Icon } from "react-native-elements";
import moment from "moment";
import * as ImageSvg from "../../Icons/CircleIcons/ImageSvg";
import * as ImageCustom from "../../Icons/CircleIcons/index";
import CircleIcons from "../../Icons/CircleIcons";
import CustomImageBackground from "../../CustomImageBackground";
import LinearGradient from "react-native-linear-gradient";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { Section } from "../../Layout/index";
import { ImageBackground } from "react-native";
import ListItemTicketComponent from "../resellTickets/ListItemTicketComponent";
import TabNavIcon from "../../Icons/TabIcons";
import Modal from "react-native-modal";
import { getEventImage } from "../../../halpers/utilities";
import Snackbar from "react-native-snackbar";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default (SaleDetailTikectComponent = (props) => {
  const {
    onBackPress,
    isShowModal,
    onToggleModal,
    editTicket,
    onBackTicketWallet,
    onDetails,
    isLoading,
    data,
    onBeforeSnapChange,
    currentIndex,
    dataMarketplace,
    conversionRate,
    event,
    deleteTicket,
    onPressSentTo,
    isShowToast,
    setIsShowToast,
    onToggleModalPrivate,
    onToggleModalPublic,
    statusToast,
  } = props;

  let sum = 0;
  if (dataMarketplace && dataMarketplace.publicSaleTickets) {
    sum = dataMarketplace.publicSaleTickets.reduce((number, item) => {
      return (number += item.tickets.length);
    }, 0);
  }

  let sumPrivate = 0;
  if (dataMarketplace && dataMarketplace.privateSaleTickets) {
    sumPrivate = dataMarketplace.privateSaleTickets.reduce((number, item) => {
      return (number += item.tickets.length);
    }, 0);
  }

  const renderModal = useMemo(() => {
    return (
      <Modal
        style={{ margin: 0 }}
        isVisible={isShowModal.isShowModal}
        onBackdropPress={onToggleModal}
        onBackButtonPress={onToggleModal}
      >
        {/* <View style={{ flex: 1, }}> */}
        <SafeAreaView style={styles.viewBottomView}>
          <View style={styles.viewButtonStyle}>
            {/* <TouchableOpacity style={styles.buttonStyle}>
              <LinearGradient
                colors={["#74BBFC", "#1D7DD7"]}
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
        </SafeAreaView>
        {/* </View> */}
      </Modal>
    );
  }, [isShowModal]);

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

  const renderLoading = useMemo(() => {
    return (
      <View style={styles.viewLoadingStyle}>
        <ActivityIndicator size="large" color="#FF6195" />
      </View>
    );
  }, [isLoading]);

  const renderMarket = useMemo(() => {
    if (sum == 0 || isLoading) return;
    return (
      <View style={[styles.viewFlatlitStyle, styles.shadownStyle]}>
        <View style={styles.rowStyle}>
          <Text style={styles.title}>EVENTX MARKETPLACE ({sum})</Text>
          <TouchableOpacity onPress={onToggleModalPublic}>
            <Image source={ImageCustom.icShareDot} style={styles.icStyle} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={dataMarketplace.publicSaleTickets}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item, index }) => {
            return (
              <ListItemTicketComponent
                conversionRate={conversionRate}
                tokens={item.tokens}
                numberTicket={item.tickets.length}
                editTicket={editTicket}
                item={item}
                deleteTicket={deleteTicket}
                currentIndex={currentIndex}
              />
            );
          }}
        />
      </View>
    );
  }, [dataMarketplace, isLoading]);

  const renderPrivate = useMemo(() => {
    if (sumPrivate == 0 || isLoading) return;
    return (
      <View style={[styles.viewFlatlitStyle, styles.shadownStyle]}>
        <View style={styles.rowStyle}>
          <Text style={styles.title}>PRIVATE ({sumPrivate})</Text>
          <TouchableOpacity onPress={onToggleModalPrivate}>
            <Image source={ImageCustom.icShareDot} style={styles.icStyle} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={dataMarketplace.privateSaleTickets}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item, index }) => {
            return (
              <ListItemTicketComponent
                conversionRate={conversionRate}
                tokens={item.tokens}
                numberTicket={item.tickets.length}
                editTicket={editTicket}
                item={item}
                deleteTicket={deleteTicket}
                currentIndex={currentIndex}
              />
            );
          }}
        />
      </View>
    );
  }, [dataMarketplace, isLoading]);

  const renderToast = () => {
    return (
      <View style={styles.mainToast}>
        <View style={{ width: "85%", padding: 10 }}>
          <Text style={styles.textToast}>{statusToast}</Text>
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
            name="arrowleft"
            type="antdesign"
            size={25}
            onPress={isLoading == true ? null : onBackPress}
          />
          <Text style={styles.titleHeaderStyle} numberOfLines={1}>
            {event ? event.eventName : ""}
          </Text>
          <Text onPress={onDetails} style={styles.txtDetail}>
            Details
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView>
            <View style={{ marginVertical: 10 }}>
              <CustomImageBackground style={styles.imageEventStyle}>
                <Image
                  source={{ uri: getEventImage(event, false) }}
                  style={styles.imageEventStyle}
                />
              </CustomImageBackground>
            </View>

            <Carousel
              layout={"default"}
              data={data}
              sliderWidth={deviceWidth}
              itemWidth={deviceWidth * 0.8}
              renderItem={renderTiketItem}
              removeClippedSubviews={false}
              useScrollView={true}
              onBeforeSnapToItem={onBeforeSnapChange}
            />

            {renderMarket}

            {renderPrivate}

            {renderModal}
          </ScrollView>
          {isShowToast === true && statusToast != "" ? renderToast() : null}
          <View style={styles.viewBtnStyle}>
            <TouchableOpacity onPress={onBackTicketWallet}>
              <LinearGradient
                colors={["#FF6195", "#C2426C"]}
                style={styles.linearGradientNextStyle}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
              >
                <Text style={styles.txtBackToWalletStyle}>
                  BACK TO TICKET WALLET
                </Text>
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
    marginVertical: 15,
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
    marginVertical: 20,
    marginHorizontal: 30,
  },
  buttonStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
  txtRefreshStyle: {
    fontFamily: "Lato",
    fontSize: 14,
    marginLeft: 10,
  },
  linearGradientStyle: {
    height: 65,
    width: 65,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  txtDetail: {
    color: "#EA5284",
    fontSize: 16,
    fontFamily: "Lato",
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
  linearGradientNextStyle: {
    width: "90%",
    // height: 55,
    paddingVertical: 15,
    alignSelf: "center",
    marginVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  txtBackToWalletStyle: {
    color: "#fff",
    marginLeft: 3,
    fontSize: 20,
    fontFamily: "Lato",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginRight: 15,
  },
  viewBtnStyle: {
    backgroundColor: "#fff",
    shadowOpacity: 0.75,
    shadowRadius: 5,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: "rgba(0,0,0,0.3)",
    elevation: 15,
  },
  nameTiketStyle: {
    fontWeight: "bold",
    fontSize: 15,
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
  txtNumberStyle: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Lato",
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
  },
  txtNumberItemStyle: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Lato",
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
