import React from "react";
import { connect } from "react-redux";
import { View, StyleSheet, Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
//import { TouchableOpacity } from 'react-native'
import LinearGradient from "react-native-linear-gradient";
import TabNavIcon from "../../Icons/TabIcons";
import { openXNav, closeXNav } from "../../../redux/reducers/appInterface";
import { isIphoneXorAbove } from "../../../utils/CheckTypeToken";

const XNavButton = ({ openNav, closeNav, isNavOpen, isCrewMode }) => {
  const toggleXNav = () => {
    if (!isNavOpen) {
      openNav();
    } else {
      closeNav();
    }
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={
          !isNavOpen
            ? isCrewMode
              ? ["#4D54AF", "#4D54AF"]
              : ["#FF6195", "#C2426C"]
            : ["#fff", "#fff"]
        }
        style={styles.xButton}
      >
        <TouchableOpacity
          onPress={toggleXNav}
          style={{
            top: 0,
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TabNavIcon
            color={!isNavOpen ? "#fff" : isCrewMode ? "#4D54AF" : "#EA5284"}
            name="Logo"
          />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const mapStateToProps = (state) => ({
  isNavOpen: state.appInterface.isNavOpen,
  isCrewMode: state.profile.isCrewMode,
});

const mapDispatchToProps = (dispatch) => ({
  openNav: () => dispatch(openXNav()),
  closeNav: () => dispatch(closeXNav()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(XNavButton);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    bottom: isIphoneXorAbove() ? 50 : 40,
  },
  xButton: {
    // position: 'absolute',
    // top: -60,
    // left: Platform.OS == "ios" ? '42.4%' : '42.1%',
    // right: 0,
    width: 58,
    height: 58,
    borderRadius: 29,
    zIndex: 5,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
});
