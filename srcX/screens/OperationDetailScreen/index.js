import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { connect } from "react-redux";
import { ListItem, Button, Icon } from "react-native-elements";
import MapView, { Marker } from "react-native-maps";
import moment from "moment";
import { Section } from "../../components/Layout";
import CircleIcons from "../../components/Icons/CircleIcons";
import PriceBlock from "../../components/ListItemComponent/PriceBlock";
import { fixDecimals } from "../../halpers/utilities";
import AppHeader from "../../components/HeaderComponent";
import icApp from "../../../assets/images/icApp.png";
import icPos from "../../../assets/images/icPosTopup.png"
import iconIdealNew from "../../../assets/images/ic_ideal_new.png";
import iconCreditCard from "../../../assets/images/icCreditCard.png";
import { is24HourFormat } from "react-native-device-time-format";
import CardType from "../../constants/CardType";
import LinearGradient from "react-native-linear-gradient";
import * as ImageCustoms from "../../components/Icons/CircleIcons";

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
  txtNameStyle: {
    fontSize: 16,
    marginLeft: 13,
  },
  refundStyle: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  xButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
  },
  iconInnerStyle: {
    width: 22,
    height: 23,
    resizeMode: "contain",
  },
  iconPlusStyle: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
  txtRefundStyle: {
    fontSize: 14,
    marginTop: 10,
  },
  logoPlusStyle: {
    height: 58,
    width: 58,
    backgroundColor: "#48A44A",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

class OperationDetailScreen extends Component {
  constructor() {
    super();
    this.state = {
      is24Hour: false,
    };
  }

  componentDidMount = () => {
    this.getCurrentHourFormat();
  };

  getCurrentHourFormat = async (date) => {
    const is24Hour = await is24HourFormat();
    if (is24Hour) {
      this.setState({ is24Hour });
    }
  };

  refundTokens = async () => {
    const trans = this.props.navigation.state.params.data;
    this.props.navigation.navigate("RefundTokenScreen", {
      tokens: trans.tokens,
      price: trans.price,
      trandId: trans.topupId,
    });
  };

  render() {
    const trans = this.props.navigation.state.params.data;

    const formattedDay = moment(trans.updatedAt)
      .format("DD MMM")
      .toUpperCase();

    let showTime = "";
    if (!this.state.is24Hour) {
      const timeformat = moment(trans.updatedAt).format("llll");
      const indexDot = timeformat.split(",");
      let arrTime = String(indexDot[2]);
      arrTime = arrTime.trim().split(" ");
      showTime = arrTime[1] + " " + arrTime[2];
    } else {
      showTime = moment(trans.updatedAt).format("HH:mm");
    }

    const finalDate = `${formattedDay}, ${showTime.toUpperCase()}`;
    const params = {
      isGoBack: true,
    };

    function getPaymentMethod(paymentMethod) {
      console.log("PaymentMetod", paymentMethod);
      if (paymentMethod == "IDEAL") {
        return "iDeal";
      } else if (paymentMethod == CardType.CB_VISA_MASTERCARD) {
        return "Credit Card";
      }else if (paymentMethod === "CASH") {
        return "Cash";
      }
      return "Credit Card";
    }

    function getIcon(paymentMethod) {
      if (paymentMethod == "IDEAL") {
        return iconIdealNew;
      } else if (paymentMethod == CardType.CB_VISA_MASTERCARD) {
        return iconCreditCard;
      }
      return "";
    }

    return (
      <View style={styles.container}>
        <AppHeader params={params} title="TOP-UP DETAILS">
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
          >
            <Section>
              <View
                style={[
                  styles.mainSection,
                  styles.helpContainer,
                  { alignItems: "center" },
                ]}
              >
                {/* <CircleIcons
                  //content={transactionTypeImage}
                  background={'#EA5284'}
                  name="logo-regular"
                  size={{ width: 28, height: 28 }}
                /> */}

                <View style={styles.logoPlusStyle}>
                  <Image
                    source={ImageCustoms.icPlusWhite}
                    style={styles.iconPlusStyle}
                  />
                </View>

                {/* <CircleIcons
                  content={transactionTypeImage}
                  background={['#e8e8e8', '#d1d1d1']}
                /> */}
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CircleIcons
                      background="transparent"
                      style={{ marginTop: 2 }}
                      name="logo-regular"
                      color={"#EA5284"}
                      noCircle="true"
                      size={{ width: 28, height: 28 }}
                    />
                    <Text
                      style={[
                        styles.helpLinkText,
                        {
                          color: "#EA5284",
                          fontFamily: "Lato-bold",
                          fontSize: 40,
                          marginLeft: -7,
                        },
                      ]}
                    >
                      {fixDecimals(trans.tokens)}
                    </Text>
                  </View>
                  {}
                </View>
                <Text
                  style={[
                    styles.helpLinkText,
                    { opacity: 0.4, textTransform: "none" },
                  ]}
                >
                  {finalDate}
                </Text>
                {!trans.posId && <View style={styles.refundStyle}>
                  <TouchableOpacity
                    style={styles.refundStyle}
                    onPress={() => this.refundTokens()}
                  >
                    <LinearGradient
                      colors={["#FCC27D", "#FCB96A"]}
                      style={styles.xButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Image
                        source={ImageCustoms.icRefund}
                        style={styles.iconInnerStyle}
                      />
                    </LinearGradient>
                    <Text style={styles.txtRefundStyle}>Refund</Text>
                  </TouchableOpacity>
                </View>}
              </View>
            </Section>

            <Section title="PAYMENT METHOD">
              <View style={styles.helpContainer}>
                <ListItem
                  key={trans.sourceType}
                  leftAvatar={{
                    //source: { uri: trans._links.walletImage.href },
                    source: getIcon(trans.paymentMethod),
                    rounded: false,
                    //size: 40,
                    placeholderStyle: { backgroundColor: "transparent" },
                    imageProps: {
                      resizeMode: "contain",
                      backgroundColor: "transparent",
                      marginTop: trans.paymentMethod == "IDEAL" ? 3 : 12,
                      marginLeft: 15,
                    },
                    avatarStyle: {
                      backgroundColor: "transparent",
                      height: trans.paymentMethod == "IDEAL" ? 32 : 15,
                      width: trans.paymentMethod == "IDEAL" ? 32 : 20,
                    },
                    overlayContainerStyle: {
                      backgroundColor: "transparent",
                    },
                  }}
                  title={
                    <Text numberOfLines={1} style={styles.txtNameStyle}>
                      {getPaymentMethod(trans.paymentMethod)}
                    </Text>
                  }
                  titleStyle={{
                    lineHeight: 19,
                    fontSize: 16,
                    marginBottom: 5,
                  }}
                  rightElement={
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={[
                          styles.helpLinkText,
                          { textTransform: "none", color: "#000" },
                        ]}
                      >
                        {" "}
                        € {fixDecimals(trans.price / 100)}
                      </Text>
                    </View>
                  }
                  iconStyle={{ backgroundPosition: "cover" }}
                  containerStyle={{
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingVertical: 15,
                    justifyContent: "center",
                    alignItems: "center",
                    // flexDirection: "row",
                    // backgroundColor: "red",
                  }}
                />
              </View>
            </Section>

            <Section title="Paid Using">
              <View style={styles.helpContainer}>
                <ListItem
                  key={trans.sourceType}
                  leftAvatar={{
                    //source: { uri: trans._links.walletImage.href },
                    source: trans.posId ? icPos : icApp,
                    rounded: false,
                    //size: 50,
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
                  title={<Text numberOfLines={1}>{trans.posId ? "POS" : "App"}</Text>}
                  titleStyle={{
                    lineHeight: 19,
                    fontSize: 16,
                    marginBottom: 5,
                  }}
                  // subtitle={
                  //   <Text style={styles.sourceWallet} numberOfLines={1}>
                  //     {trans.sourceWallet}
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
        </AppHeader>
      </View>
    );
  }
}

OperationDetailScreen.navigationOptions = ({ navigation }) => ({
  title: "TOP-UP DETAILS",
  headerMode: "float",
  headerLeft: (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{ marginLeft: 15 }}
    >
      <Icon name="arrowleft" type="antdesign" />
    </TouchableOpacity>
  ),
  headerRight: <View style={{ marginRight: 15 }} />,
});

export default connect(
  null,
  () => ({})
)(OperationDetailScreen);
