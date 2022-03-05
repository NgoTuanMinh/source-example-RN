import React, { useMemo } from "react";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  Platform,
  Dimensions,
  PermissionsAndroid,
} from "react-native";
import CircleIcons from "../../Icons/CircleIcons";
import { closeXNav } from "../../../redux/reducers/appInterface";
import NavigationService from "../../../NavigationService";
import { sentBarAction } from "../../../redux/actions/index";
import Geolocation from "@react-native-community/geolocation";
import { isIphoneXorAbove } from "../../../utils/CheckTypeToken";
import { setShowScanTicket } from "../../../redux/actions/event";

const deviceHeight = Dimensions.get("window").height;
const heightModal = deviceHeight / 2 - 130;
const heightItem = heightModal / 5;

const crewHeightModal = heightItem * 2 - 50;

const XNavComponent = ({
  navigation,
  isNavOpen,
  closeNav,
  isCrewMode,
  setShowScanTicket,
}) => {
  const sentToken = () => {
    closeNav();
    NavigationService.navigate("SendTo");
  };

  const onNextWearables = () => {
    closeNav();
    NavigationService.navigate("Wearables");
  };

  const topUpTokens = () => {
    closeNav();
    navigation.navigate("TopUpTokens");
  };
  if (!isNavOpen) return null;

  const sentBar = () => {
    Geolocation.getCurrentPosition(
      (location) => {
        sentBarAction(location);
        closeNav();
      },
      (error) => {
        console.warn(error);
        alert(error.message || "error");
      }
    );
  };

  const inviteCrew = () => {
    closeNav();
    //navigation.navigate('TopUpTokens');
  };

  const ticketScanner = () => {
    setShowScanTicket(true);
    NavigationService.navigate("ScanTicketScreen");
    closeNav();
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === "ios") {
      sentBar();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Access Required",
            message: "This App needs to Access your location",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          sentBar();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const displayNormalMode = useMemo(() => {
    return (
      <TouchableWithoutFeedback onPress={closeNav}>
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, .7)",
            padding: 20,
          }}
        >
          <View style={styles.viewBottomStyle}>
            <TouchableOpacity style={styles.buttons} onPress={topUpTokens}>
              {/* <CircleIcons name={"cart"} color="skyblue" /> */}
              <CircleIcons name={"plus"} color="#48A44A" />
              <Text style={styles.navText}>Top up tokens</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttons} onPress={sentToken}>
              <CircleIcons name={"arrow-right"} color="skyblue" />
              <Text style={styles.navText}>Send tokens</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={styles.buttons}
              onPress={requestLocationPermission}
            >
              <CircleIcons name={"request"} color="#FCB96A" />
              <Text style={styles.navText}>Sent BarPayment</Text>
            </TouchableOpacity> */}

            {/* <TouchableOpacity style={styles.buttons}>
              <CircleIcons name={'refound'} color="#72C05E" />
              <Text style={styles.navText}>Refund tokens</Text>
            </TouchableOpacity> */}

            <TouchableOpacity onPress={onNextWearables} style={styles.buttons}>
              <CircleIcons name={"wearable"} color="#EA5284" />
              <Text style={styles.navText}>Wearables</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }, [isCrewMode]);

  const displayCrewMode = useMemo(() => {
    return (
      <TouchableWithoutFeedback onPress={closeNav}>
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, .7)",
            padding: 20,
          }}
        >
          <View style={styles.crewModeViewBottomStyle}>
            <TouchableOpacity style={styles.buttons} onPress={inviteCrew}>
              <CircleIcons name={"invite-crew"} color="#4487C6" />
              <Text style={styles.navText}>Invite crew</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttons} onPress={ticketScanner}>
              <CircleIcons name={"ticket-scanner"} color="#4D54AF" />
              <Text style={styles.navText}>Ticket scanner</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }, [isCrewMode]);

  return (
    <>
      {!isCrewMode && displayNormalMode}
      {isCrewMode && displayCrewMode}
    </>
  );
};

const mapStateToProps = (state) => ({
  wallets: state.wallets,
  isNavOpen: state.appInterface.isNavOpen,
  isCrewMode: state.profile.isCrewMode,
});

const mapDispatchToProps = (dispatch) => ({
  closeNav: () => dispatch(closeXNav()),
  sentBarAction: () => dispatch(sentBarAction()),
  setShowScanTicket: (a) => dispatch(setShowScanTicket(a)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(XNavComponent));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navText: {
    // fontSize: 20,
    // fontWeight: "700",
    fontSize: heightItem / 3.5,
    color: "black",
    marginLeft: 8,
  },
  iconContainerStyle: {
    marginRight: 5,
    backgroundColor: "red",
  },
  buttons: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: heightModal / 15,
    marginHorizontal: 15,

    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    height: heightItem,
    maxHeight: 100,
    // flexDirection: 'row',
    // backgroundColor: '#fff',
    // marginBottom: 15,
    // marginHorizontal: 15,
    // height: 56,
    // borderRadius: 8,
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  buttonsHide: {
    height: heightItem,

    flexDirection: "row",
    backgroundColor: "#fff",
    opacity: 0.5,
    marginBottom: heightModal / 15,
    marginHorizontal: 15,
    //height: 56,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  notBlurred: {
    ...StyleSheet.absoluteFill,
    top: StatusBar.currentHeight,
  },
  customeBlurView: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "black",
    opacity: 0.8,
  },
  tilesContainer: {
    flex: 1,
    flexDirection: "column-reverse",
    paddingBottom: 110,
    top: 0,
  },
  bottomStyle: {},
  viewBottomStyle: {
    position: "absolute",
    bottom: isIphoneXorAbove() ? 55 : Platform.OS == "android" ? 60 : 70,
    left: 0,
    right: 0,
    height: heightModal,
    // backgroundColor: "red",
    paddingTop: 10,
  },
  crewViewBottomStyle: {
    position: "absolute",
    bottom: isIphoneXorAbove() ? 140 : 120,
    left: 0,
    right: 0,
    height: crewHeightModal,
  },
  crewModeViewBottomStyle: {
    position: "absolute",
    bottom: isIphoneXorAbove() ? 200 : 180,
    left: 0,
    right: 0,
    height: crewHeightModal,
  },
});
