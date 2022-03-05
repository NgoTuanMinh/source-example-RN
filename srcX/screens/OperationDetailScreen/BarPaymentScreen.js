import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
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
import * as ImageCustoms from "../../components/Icons/CircleIcons";
import LinearGradient from "react-native-linear-gradient";
import { is24HourFormat } from "react-native-device-time-format";
import { getProducts } from "../../redux/actions";
import { getDataKeystore } from "../../redux/actions/keyStore";

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
  title: {
    fontSize: 16,
    paddingBottom: 4,
    // fontWeight: "bold",
  },
  circle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    // backgroundColor: "red",
  },
  xButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
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
  txtStyle: {
    fontSize: 14,
    marginTop: 5,
  },
  totalStyle: {
    color: "#EA5284",
    fontFamily: "Lato-bold",
    fontSize: 40,
    // marginLeft: 2,
    // backgroundColor: "red",
  },
  rowViewStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  viewCenterStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
  txtStyleMinus: {
    textTransform: "uppercase",
    color: "#EA5284",
    fontFamily: "Lato-bold",
    marginRight: 2,
    fontSize: 40,
    marginTop: -2,
    // backgroundColor: "green",
  },
});

class BarPaymentScreen extends Component {
  constructor() {
    super();
    this.state = {
      is24Hour: false,
      products: null,
      date: "DD MMMM",
    };
  }

  componentDidMount = () => {
    this.getTransDetail();
  };

  getTransDetail = async () => {
    // call production detail
    // console.log("thai");
    const formatDate = await getDataKeystore("@locale");
    if (formatDate) {
      this.setState({ date: formatDate });
      console.log(formatDate);
    }
    const trans = this.props.navigation.state.params.data;

    if (trans.products) {
      const productIds = trans.products.map((s) => s.id);
      const response = await getProducts(productIds);

      if (response.success) {
        for (let i = 0; i < trans.products.length; i++) {
          const product = response.data.filter(
            (s) => s._id === trans.products[i].id
          );
          if (product && product.length > 0) {
            trans.products[i].translatedName = product[0].translatedName;
          }
        }
      }
    }
    const is24Hour = await is24HourFormat();
    this.setState({ is24Hour, products: trans.products });
    this.getCurrentHourFormat();
  };

  onProductCallback = (response) => {
    if (response.success) {
    }
  };

  ListItemComponent = (item, index) => {
    const subTitle = `${item.quantity} ${
      item.quantity == 1 ? "item" : "items"
      // item.quantity == 1 ? "stuk" : "stuks"
    }`;
    return (
      item.quantity > 0 && (
        <ListItem
          key={index}
          // title={item.translatedName}
          title={item.translatedName || item.name[0].content}
          subtitle={subTitle}
          titleStyle={[styles.title]}
          subtitleStyle={{ color: "gray" }}
          leftElement={
            <Image
              source={{ uri: item.imageUrl }}
              style={[styles.circle, { width: 41, marginLeft: -4 }]}
            />
          }
          rightElement={
            <PriceBlock
              price={item.tokens ? fixDecimals(item.tokens * item.quantity) : 0}
              price2={
                item.price ? fixDecimals((item.price * item.quantity) / 100) : 0
              }
              isBar={false}
              item={item}
              userId={this.props.navigation.state.params.userId}
              data={this.props.navigation.state.params.data}
            />
          }
        />
      )
    );
  };

  render() {
    const trans = this.props.navigation.state.params.data;
    const userId = this.props.navigation.state.params.userId;

    let longitude = 4.46944;
    let latitude = 51.92398;
    if (trans.location) {
      longitude = trans.location.longitude || longitude;
      latitude = trans.location.latitude || latitude;
    }

    // console.log("thai trans", trans.products[0].name[0].content);

    let sum = trans.products.reduce((number, item) => {
      return (number += item.quantity * item.tokens);
    }, 0);
    const formattedDay = moment(trans.updatedAt).format(this.state.date);

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
      isNotification: true,
    };

    return (
      <View style={styles.container}>
        <AppHeader params={params} title="Bar Payment">
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
                <Image source={ImageCustoms.icBeer} style={styles.circle} />
                <View
                  style={[
                    styles.viewCenterStyle,
                    { marginBottom: 10, marginTop: 10 },
                  ]}
                >
                  <View style={styles.rowViewStyle}>
                    {userId === trans.buyer && (
                      <Text style={styles.txtStyleMinus}>-</Text>
                    )}
                    <CircleIcons
                      // background="transparent"
                      style={{ marginTop: 2, marginRight: 0 }}
                      name="logo-regular"
                      color={"#EA5284"}
                      //noCircle="true"
                      size={{ width: 28, height: 28 }}
                    />
                    <Text style={[styles.helpLinkText, styles.totalStyle]}>
                      {fixDecimals(sum)}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[
                    styles.helpLinkText,
                    { textTransform: "none", marginBottom: 15 },
                  ]}
                >
                  <Text>{userId === trans.buyer ? "-" : ""}</Text>€{" "}
                  {fixDecimals(trans.price / 100)}
                </Text>
                <Text
                  style={[
                    { opacity: 0.4, textTransform: "none", fontSize: 14 },
                  ]}
                >
                  {finalDate}
                </Text>
                {/* <View style={styles.rowStyle}>
                  <View style={styles.centerStyle}>
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
                    <Text style={styles.txtStyle}>Split bill</Text>
                  </View>

                  <View style={styles.centerStyle}>
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
                    <Text style={styles.txtStyle}>Share</Text>
                  </View>
                </View> */}
              </View>
            </Section>

            <Section title="Ordered items">
              <View style={styles.helpContainer}>
                <FlatList
                  data={this.state.products}
                  keyExtractor={(item, index) => String(index)}
                  contentContainerStyle={styles.list}
                  nestedScrollEnabled={true}
                  renderItem={({ item, index }) => {
                    return this.ListItemComponent(item, index);
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
                    source: icApp,
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
                  title={
                    <Text
                      style={{
                        marginTop: 15,
                      }}
                      numberOfLines={1}
                    >
                      Wristband
                    </Text>
                  }
                  titleStyle={{
                    lineHeight: 19,
                    fontSize: 16,
                    // marginBottom: 5,
                  }}
                  subtitle={
                    <Text style={styles.sourceWallet} numberOfLines={1}>
                      {trans.sourceWallet}
                    </Text>
                  }
                  iconStyle={{ backgroundPosition: "cover" }}
                  containerStyle={{
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingVertical: 15,
                  }}
                />
              </View>
            </Section>

            <Section title="Location">
              <View style={styles.helpContainer}>
                <MapView
                  style={{
                    flex: 1,
                    height: 165,
                    marginTop: 15,
                    marginBottom: 15,
                    marginLeft: -15,
                    marginRight: -15,
                  }}
                  initialRegion={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.0012,
                    longitudeDelta: 0.0001,
                    scrollEnabled: false,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: latitude,
                      longitude: longitude,
                    }}
                    centerOffset={{ x: 0, y: -35 }}
                  >
                    <Image
                      source={require("../../../assets/images/map-pin.png")}
                      style={{ width: 54, height: 70 }}
                    />
                  </Marker>
                </MapView>
                {/* <Text style={{ fontSize: 16 }}>{data.location.addr} </Text> */}
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
const mapStateToProps = (state) => ({
  wallets: state.wallets,
});
export default connect(
  mapStateToProps,
  () => ({})
)(BarPaymentScreen);
