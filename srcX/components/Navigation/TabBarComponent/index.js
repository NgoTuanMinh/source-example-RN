import React from "react";
import { connect } from "react-redux";
import {
  View,
  Dimensions,
  StyleSheet,
  Image,
  Platform,
  ImageBackground,
} from "react-native";
import TabBarItem from "./TabBarItem";
import XNavButton from "./XNavButton";
import { TouchableOpacity } from "react-native-gesture-handler";
//import { TouchableOpacity } from 'react-native'
import LinearGradient from "react-native-linear-gradient";
import TabNavIcon from "../../Icons/TabIcons";
import { openXNav, closeXNav } from "../../../redux/reducers/appInterface";
import { isIphoneXorAbove } from "../../../utils/CheckTypeToken";

const TabBarComponent = (props) => {
  const { isNavOpen } = props;
  const { state } = props.navigation;
  const { routes } = state;
  // console.log("thai route", routes);
  return (
    <>
      {/* <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          paddingBottom: 8,
          backgroundColor: isNavOpen ? "rgba(0, 0, 0, .7)" : "#fff",
          marginBottom: isIphoneXorAbove() ? 15 : 5,
        }}
      > */}
      <ImageBackground
        source={require("../../../../assets/images/shape.png")}
        // style={styles.tabs}
        style={
          isNavOpen
            ? {
                height: isIphoneXorAbove() ? 105 : 75,
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                width: "100%",
                marginBottom: isIphoneXorAbove() ? 0 : 0,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                // paddingBottom: 8,
                paddingTop: 5,
              }
            : {
                height: 75,
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                width: "100%",
                marginBottom: isIphoneXorAbove() ? 15 : 0,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                // paddingBottom: 8,
                paddingTop: 5,
              }
        }
      >
        {routes.map((item, index) => {
          return (
            <TabBarItem
              key={item.key}
              route={item}
              navigation={props.navigation}
              index={index}
              active={index === state.index}
            />
          );
        })}
      </ImageBackground>
      {/* </View> */}
      <XNavButton />
    </>
  );
};

const mapStateToProps = (state) => ({
  isNavOpen: state.appInterface.isNavOpen,
});

const mapDispatchToProps = (dispatch) => ({
  openNav: () => dispatch(openXNav()),
  closeNav: () => dispatch(closeXNav()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabBarComponent);

const styles = StyleSheet.create({
  tabs: {
    height: 80,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
  },
});
