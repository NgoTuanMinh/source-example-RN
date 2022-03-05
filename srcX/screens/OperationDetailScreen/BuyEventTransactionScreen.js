import React, { Component, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Linking,
} from "react-native";
import { connect } from "react-redux";
import { ListItem, Button, Icon } from "react-native-elements";
import moment from "moment";
import { Section } from "../../components/Layout";
import CircleIcons from "../../components/Icons/CircleIcons";
import { fixDecimals, convertTokensToCurrency } from "../../halpers/utilities";
import AppHeader from "../../components/HeaderComponent";
import defaultAvatar from "../../../assets/images/avatar.png";
import marketPlaceIcon from "../../../assets/images/Money.png";
import PriceBlock from "../../components/ListItemComponent/PriceBlock";
import LinearGradient from "react-native-linear-gradient";
import icApp from "../../../assets/images/icApp.png";
import * as ImageCustoms from "../../components/Icons/CircleIcons";
import {
  getTicketDefinitions,
  getAvailableTickets,
} from "../../redux/actions/index";
import { is24HourFormat } from "react-native-device-time-format";
import NavigationService from "../../NavigationService";
import { getDataKeystore } from "../../redux/actions/keyStore";

const BuyEventTransactionScreen = (props) => {
  const { navigation } = props;
  const conversionRate = navigation.state.params.conversionRate;
  const trans = navigation.state.params.data;
  const userId = navigation.state.params.userId;
  const isSoldTicket = trans.isSoldTicket;

  const [isLoading, setisLoading] = useState(false);
  const [dataTicket, setDataTicket] = useState([]);
  const [is24Hour, setIs24Hour] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [dateFormat, setDateFormat] = useState("DD MMMM");
  let callApiStep = 0;

  // console.log("thai trans", trans);

  useEffect(() => {
    setisLoading(true);
    callApiStep = 0;
    getCurrentHourFormat();
    let array = [];
    trans.tickets.map((item) => array.push(item.ticketDefinitionId));
    getTicketDefinitions(array, callback);
    getAvailableTickets(
      null,
      onAvailableTicketCallback,
      trans.tickets.map((s) => s.issuerId)
    );
  }, []);

  const getCurrentHourFormat = async (date) => {
    const formatDate = await getDataKeystore("@locale");
    if (formatDate) {
      setDateFormat(formatDate);
    }
    const is24Hour = await is24HourFormat();
    if (is24Hour) {
      setIs24Hour(is24Hour);
    }
  };

  const onAvailableTicketCallback = (response) => {
    callApiStep++;
    if (callApiStep >= 2) setisLoading(false);
    if (response.success) {
      // if available ticket we will show transfer
      setShowTransfer(response.data.length > 0);
    }
  };

  const gotoTransfer = () => {
    NavigationService.navigate("TransferTicketsScreen", {
      dataTicket,
      event: {
        logoUrl: trans.logoUrl,
        imageUrl: trans.imageUrl,
        _id: trans.tickets.length > 0 ? trans.tickets[0].event : "",
      },
    });
  };

  const callback = (response) => {
    callApiStep++;
    if (callApiStep >= 2) setisLoading(false);
    if (response && response.length > 0) {
      response.forEach((td) => {
        td.tickets = [];
        trans.tickets.forEach((t) => {
          if (t.ticketDefinitionId == td._id) {
            td.tickets.push(t);
          }
        });
        td.ticketCount = td.tickets.length;
      });

      if (!isSoldTicket && trans.marketplaceFee) {
        // add market place
        response.push({
          _id: "",
          translatedName: "Marketplace fee",
          tickets: [{ tokens: trans.marketplaceFee }],
          ticketCount: trans.tickets.length,
        });
      }
      setDataTicket(response);
    }
  };

  const renderLoading = () => {
    if (isLoading)
      return (
        <View style={styles.viewLoadingStyle}>
          <ActivityIndicator size="large" color="#EA5284" />
        </View>
      );
  };

  const renderPrice = (size = 28) => {
    return (
      <View style={styles.viewItemPrice}>
        {!isSoldTicket && <Text style={styles.txtStyleMinus}>-</Text>}
        <CircleIcons
          style={{ marginTop: 2 }}
          name="logo-regular"
          color={"#EA5284"}
          size={{ width: size, height: size }}
        />
        <Text style={styles.txtStyle}>{fixDecimals(trans.tokens)}</Text>
      </View>
    );
  };

  const getFinalDate = (trans) => {
    try {
      const formattedDay = moment(trans.updatedAt).format(dateFormat);
      const formattedtime = moment(trans.updatedAt)
        .format("HH:mm")
        .toUpperCase();

      let showTime = "";
      if (!is24Hour) {
        const timeformat = moment(trans.updatedAt).format("llll");
        const indexDot = timeformat.split(",");
        let arrTime = String(indexDot[2]);
        arrTime = arrTime.trim().split(" ");
        showTime = arrTime[1] + " " + arrTime[2];
      } else {
        showTime = moment(trans.updatedAt).format("HH:mm");
      }

      const finalDate = `${formattedDay}, ${showTime.toUpperCase()}`;
      return finalDate;
    } catch (error) {
      return "";
    }
  };

  const renderData = () => {
    let image = ImageCustoms.icBuyTicket;
    let title = "PURCHASED items";
    if (isSoldTicket) {
      image = ImageCustoms.TicketSold;
      title = "ITEMS SOLD";
    }
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Section>
          <View
            style={[
              styles.mainSection,
              styles.helpContainer,
              { alignItems: "center", alignSelf: "center" },
            ]}
          >
            <View
              style={[
                styles.mainSection,
                styles.helpContainer,
                { alignItems: "center" },
              ]}
            >
              <Image source={image} style={styles.circle} />
              {renderPrice()}
              <Text
                style={[
                  styles.helpLinkText,
                  { textTransform: "none", marginBottom: 15, marginTop: 8 },
                ]}
              >
                <Text>{isSoldTicket ? "" : "-"}</Text>€{" "}
                {fixDecimals(
                  convertTokensToCurrency(trans.tokens, conversionRate)
                )}
              </Text>
              <Text
                style={[
                  styles.helpLinkText,
                  { opacity: 0.4, textTransform: "none", marginLeft: 10 },
                ]}
              >
                {getFinalDate(trans)}
              </Text>
            </View>

            <View style={styles.rowStyle}>
              {/* <View style={styles.centerStyle}>
                <LinearGradient
                  colors={["#92A6D8", "#595DAB"]}
                  style={styles.xButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Image
                    source={ImageCustoms.icSplitBill}
                    style={styles.iconInnerStyle}
                  />
                </LinearGradient>
                <Text style={styles.txtBillStyle}>Split bill</Text>
              </View> */}

              {showTransfer && (
                <View style={styles.centerStyle}>
                  <TouchableOpacity
                    style={styles.centerStyle}
                    onPress={() => gotoTransfer()}
                  >
                    <LinearGradient
                      colors={["#FF6195", "#C2426C"]}
                      style={styles.xButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Image
                        source={ImageCustoms.icShare}
                        style={styles.iconInnerStyle}
                      />
                    </LinearGradient>
                    <Text style={styles.txtBillStyle}>Transfer</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Section>

        <Section title={title}>
          <View style={styles.helpContainer}>
            {dataTicket.map((itemTicket) => {
              let sum = itemTicket.tickets.reduce((number, t) => {
                return number + t.tokens;
              }, 0);
              return (
                <ListItem
                  key={itemTicket._id}
                  leftAvatar={
                    <ImageBackground
                      source={defaultAvatar}
                      style={styles.avatarStyle}
                    >
                      {!itemTicket._id ? (
                        <Image
                          source={marketPlaceIcon}
                          style={styles.avatarStyle}
                        />
                      ) : (
                        <Image
                          source={{ uri: trans.logoUrl }}
                          style={styles.avatarStyle}
                        />
                      )}
                    </ImageBackground>
                  }
                  title={
                    <Text numberOfLines={1} style={styles.txtNameStyle}>
                      {itemTicket.translatedName}
                    </Text>
                  }
                  subtitle={
                    <Text style={styles.sourceWallet} numberOfLines={1}>
                      {itemTicket.ticketCount}{" "}
                      {itemTicket.ticketCount === 1 ? "item" : "items"}
                      {/* {itemTicket.ticketCount === 1 ? "stuk" : "stuks"} */}
                    </Text>
                  }
                  titleStyle={{
                    lineHeight: 19,
                    fontSize: 16,
                    marginBottom: 5,
                  }}
                  rightElement={
                    <PriceBlock
                      price={fixDecimals(sum)}
                      price2={fixDecimals(
                        convertTokensToCurrency(sum, conversionRate)
                      )}
                      userId={userId}
                      data={trans}
                      // TODO add isbar here
                      isBar={false}
                    />
                  }
                  iconStyle={{ backgroundPosition: "cover" }}
                  containerStyle={{
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingVertical: 15,
                  }}
                />
              );
            })}
          </View>
        </Section>

        <Section title="Paid Using">
          <View style={styles.helpContainer}>
            <ListItem
              key={trans.sourceType}
              leftAvatar={{
                source: icApp,
                rounded: false,
                placeholderStyle: { backgroundColor: "transparent" },
                imageProps: {
                  resizeMode: "contain",
                  backgroundColor: "transparent",
                },
                avatarStyle: {
                  backgroundColor: "transparent",
                  height: 44,
                  width: 44,
                  borderRadius: 22,
                },
                overlayContainerStyle: {
                  backgroundColor: "transparent",
                },
              }}
              // rightElement={
              //   <Image
              //     source={ImageCustoms.icDotHorizontal}
              //     style={{
              //       height: 4,
              //       width: 16,
              //       resizeMode: "contain",
              //       tintColor: "gray",
              //     }}
              //   />
              // }
              title={<Text numberOfLines={1}>App</Text>}
              titleStyle={{
                lineHeight: 19,
                fontSize: 16,
                marginBottom: 5,
              }}
              // subtitle={
              //   <Text style={styles.sourceWallet} numberOfLines={1}>
              //     {trans.buyerWallet}
              //   </Text>
              // }
              iconStyle={{ backgroundPosition: "cover" }}
              containerStyle={{
                paddingLeft: 0,
                paddingRight: 0,
                paddingVertical: 15,
              }}
            />
          </View>
        </Section>

        <View style={{ marginBottom: 30 }}>
          <Button
            type="clear"
            title="Report a problem"
            titleStyle={{
              color: "#4487C6",
              fontSize: 16,
              fontFamily: "Lato",
            }}
            onPress={() => Linking.openURL("mailto:support@eventx.network")}
          />
        </View>
      </ScrollView>
    );
  };

  let title = trans.eventName;
  if (isSoldTicket) {
    title = "TICKET SOLD";
  }

  return (
    <View style={styles.container}>
      <AppHeader params={{ isGoBack: true }} title={title}>
        {renderData()}
        {renderLoading()}
      </AppHeader>
    </View>
  );
};

const mapStateToProps = (state) => ({
  wallets: state.wallets,
});

export default connect(mapStateToProps)(BuyEventTransactionScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingTop: 0,
  },
  helpContainer: {
    paddingRight: 15,
    paddingLeft: 15,
    justifyContent: "center",
  },
  helpLinkText: {
    fontSize: 16,
    textTransform: "uppercase",
  },
  mainSection: {
    // paddingTop: 25,
    justifyContent: "center",
  },
  sourceWallet: {
    opacity: 0.4,
    fontSize: 14,
    lineHeight: 17,
  },
  viewItemPrice: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  txtNameStyle: {
    fontSize: 16,
    fontFamily: "Lato",
  },
  mainPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#EA5284",
  },
  txtStyle: {
    textTransform: "uppercase",
    color: "#EA5284",
    fontFamily: "Lato-bold",
    fontSize: 40,
    marginTop: -2,
  },
  txtStyleMinus: {
    textTransform: "uppercase",
    color: "#EA5284",
    fontFamily: "Lato-bold",
    marginRight: 5,
    fontSize: 40,
    marginTop: -2,
  },
  avatarStyle: {
    resizeMode: "cover",
    backgroundColor: "transparent",
    width: 44,
    height: 44,
  },
  viewLoadingStyle: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  rowStyle: {
    flexDirection: "row",
    marginVertical: 15,
    alignItems: "center",
  },
  centerStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconInnerStyle: {
    width: 22,
    height: 23,
    resizeMode: "contain",
  },
  totalStyle: {
    color: "#EA5284",
    fontFamily: "Lato-bold",
    fontSize: 40,
  },
  rowViewStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  xButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
  },
  circle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  txtBillStyle: {
    fontSize: 14,
    marginTop: 10,
  },
});
