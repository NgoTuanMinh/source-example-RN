import React, { Component } from "react";
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
import {
  renderTypeItemDetail,
  renderTitleItem,
  renderTypeItem,
  getNameUser,
  getNameAvatar,
  renderLeftItem,
} from "../../utils/CheckTypeToken";
import defaultAvatar from "../../../assets/images/avatar.png";
import icIdealNew from "../../../assets/images/ic_ideal_new.png";
import iconCreditCard from "../../../assets/images/icCreditCard.png";
import PriceBlock from "../../components/ListItemComponent/PriceBlock";
import { getTransactionDetail } from "../../redux/actions/index";
import { getDataKeystore } from "../../redux/actions/keyStore";
import { is24HourFormat } from "react-native-device-time-format";
import ReportProblem from "../../components/ReportProblem";

class TokenTransactionScreen extends Component {
  constructor() {
    super();
    this.state = {
      trans: null,
      isLoading: true,
      is24Hour: false,
      userId: null,
    };
  }

  componentDidMount = () => {
    this.transactionDetail();
  };

  transactionDetail = async () => {
    const transactionID = this.props.navigation.state.params.transactionID;
    const trans = await getTransactionDetail(transactionID);
    // console.log("thai trans", trans);
    const userId = await getDataKeystore("@userId");
    const is24Hour = await is24HourFormat();

    this.setState({
      trans,
      isLoading: false,
      is24Hour: is24Hour,
      userId,
    });
  };

  renderLoading = () => {
    if (this.state.isLoading)
      return (
        <View style={styles.viewLoadingStyle}>
          <ActivityIndicator size="large" color="#EA5284" />
        </View>
      );
  };

  getTitle = (userId, trans) => {
    try {
      return renderTitleItem(userId, trans);
    } catch (error) {
      return "TOKENS";
    }
  };

  renderPrice = (trans, size = 28) => {
    if (!trans) return null;
    const userId = this.state.userId;
    return (
      <View style={styles.viewItemPrice}>
        <CircleIcons
          background="transparent"
          //style={{ marginTop: 2 }}
          name="logo-regular"
          color={"#EA5284"}
          //noCircle="true"
          size={{ width: size, height: size }}
        />
        <Text style={styles.txtStyleMinus}>
          {renderTypeItem(userId, trans)}
        </Text>
        <Text style={styles.txtStyle}>{fixDecimals(trans.tokens)}</Text>
      </View>
    );
  };

  renderRightItem = () => {
    const trans = this.state.trans;
    if (!trans) return null;
    const userId = this.state.userId;
    return trans.kind == "RefundTransaction" ? (
      <Text style={{ fontSize: 16, fontWeight: "400" }}>
        € {fixDecimals(trans.price / 100)}
      </Text>
    ) : (
      <PriceBlock
        price={trans.tokens ? fixDecimals(trans.tokens) : 0}
        price2={fixDecimals(trans.price / 100)}
        userId={userId}
        data={trans}
      />
    );
  };

  getFinalDate = (trans) => {
    try {
      const formattedDay = moment(trans.updatedAt).format("DD MMMM");
      const formattedtime = moment(trans.updatedAt)
        .format("HH:mm")
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
      return finalDate;
    } catch (error) {
      return "";
    }
  };

  getAvatar = (userId) => {
    try {
      let image = defaultAvatar;
      image = getNameAvatar(userId, this.state.trans);
      if (image && image.includes("http")) {
        image = { uri: image };
      } else {
        image = defaultAvatar;
      }
      return image;
    } catch (error) {
      return defaultAvatar;
    }
  };

  getIcon = (userId, trans) => {
    try {
      return renderLeftItem(userId, trans);
    } catch (error) {
      return null;
    }
  };

  renderData = () => {
    const conversionRate = this.props.wallets.conversionRate;
    const trans = this.state.trans;
    console.log("thai trans", trans);
    const userId = this.state.userId;
    let image = this.getAvatar(userId);
    var subTitleContact = "";
    console.log(this.props.wallets.contacts.unEvtxContacts);
    this.props.wallets.contacts.evtxContacts.forEach((elm, index) => {
      if (elm.id == trans.receiver) {
        subTitleContact = elm.value;
      }
    });

    // console.log("thai props", this.props.wallets.contacts.evtxContacts);
    // console.log("Thai value", subTitleContact);

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
              { alignItems: "center" },
            ]}
          >
            {this.getIcon(userId, trans)}
            {this.renderPrice(trans)}
            {trans.kind == "RefundTransaction" ? null : (
              <Text
                style={[
                  styles.helpLinkText,
                  { textTransform: "none", marginBottom: 15 },
                ]}
              >
                € {renderTypeItem(userId, trans)}{" "}
                {fixDecimals(
                  convertTokensToCurrency(trans.tokens, conversionRate)
                )}
              </Text>
            )}
            <Text
              style={[
                styles.helpLinkText,
                { opacity: 0.4, textTransform: "none", marginLeft: 10 },
              ]}
            >
              {this.getFinalDate(trans)}
            </Text>
          </View>
        </Section>

        <Section title={renderTypeItemDetail(userId, trans)}>
          <View style={styles.helpContainer}>
            <ListItem
              key={trans.sourceType}
              key={trans.sourceType}
              key={trans.sourceType}
              leftAvatar={
                trans.kind == "RefundTransaction" ? (
                  <View
                    style={{
                      height: trans.paymentMethod == "IDEAL" ? 32 : 15,
                      width: trans.paymentMethod == "IDEAL" ? 32 : 20,
                      justifyContent: "center",
                    }}
                  >
                    {trans.paymentMethod == "IDEAL" ? (
                      <Image
                        source={icIdealNew}
                        style={{ height: 24, width: 28, marginLeft: 12 }}
                      />
                    ) : (
                      <Image
                        source={iconCreditCard}
                        style={{
                          height: 20,
                          width: 27,
                          marginLeft: 12,
                          marginTop: 2,
                        }}
                      />
                    )}
                  </View>
                ) : (
                  <ImageBackground
                    source={defaultAvatar}
                    style={styles.avatarStyle}
                  >
                    <Image source={image} style={styles.avatarStyle} />
                  </ImageBackground>
                )
              }
              title={
                trans.kind == "RefundTransaction" ? (
                  <Text
                    style={{
                      fontSize: 16,
                      marginLeft: 15,
                      marginTop: 14,
                    }}
                  >
                    {trans.paymentMethod == "IDEAL" ? "iDeal" : "Credit card"}
                  </Text>
                ) : (
                  <Text numberOfLines={1} style={styles.txtNameStyle}>
                    {getNameUser(userId, trans)}
                  </Text>
                )
              }
              subtitle={subTitleContact}
              subtitleStyle={{
                fontSize: 14,
                fontWeight: "400",
                color: "rgba(0, 0, 0, 0.4)",
                lineHeight: 20,
              }}
              titleStyle={{
                lineHeight: 19,
                fontSize: 16,
                marginBottom: 5,
              }}
              rightElement={this.renderRightItem()}
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

  render() {
    const trans = this.state.trans;
    const userId = this.state.userId;
    const title = this.getTitle(userId, trans);

    const params = {
      isGoBack: true,
    };

    return (
      <View style={styles.container}>
        <AppHeader params={params} title={title}>
          {trans ? this.renderData() : null}
        </AppHeader>
        {this.renderLoading()}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  wallets: state.wallets,
  evtxContactsProps: state.wallets.contacts.evtxContacts,
  unEvtxContactsProps: state.wallets.contacts.unEvtxContacts,
});

export default connect(mapStateToProps)(TokenTransactionScreen);

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
    marginTop: 5,
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
    marginLeft: -7,
    fontSize: 40,
    marginTop: -2,
  },
  txtStyleMinus: {
    textTransform: "uppercase",
    color: "#EA5284",
    fontFamily: "Lato-bold",
    marginRight: 10,
    marginLeft: -7,
    fontSize: 40,
    marginTop: -2,
  },
  avatarStyle: {
    resizeMode: "cover",
    backgroundColor: "transparent",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  viewLoadingStyle: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
