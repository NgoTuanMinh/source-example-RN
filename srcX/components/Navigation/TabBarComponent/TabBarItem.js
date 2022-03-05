import React, { useMemo } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import TabNavIcon from "../../Icons/TabIcons";
import { connect } from "react-redux";
import { openXNav, closeXNav } from "../../../redux/reducers/appInterface";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const TabBarItem = ({
  navigation,
  route,
  index,
  active,
  openNav,
  closeNav,
  isNavOpen,
  isCrewMode,
}) => {
  const navigateTo = () => {
    if (isNavOpen) {
      closeNav();
    }
    if (route.routeName != "XNavStack") navigation.navigate(route.routeName);
  };

  const displayTabs = useMemo(() => {
    let color = "#999";
    if (active) {
      //color = isCrewMode ? '#4D54AF' : '#EA5284';
      color = "#EA5284";
    }
    return (
      <TouchableWithoutFeedback style={styles.item}>
        {index !== 2 ? (
          <TouchableOpacity onPress={navigateTo} style={styles.tabWrapper}>
            <View style={styles.imageWrapper}>
              <TabNavIcon color={color} name={route.routes[0].routeName} />
            </View>
            <Text style={{ color }}>{route.routes[0].routeName}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.itemWhite} />
        )}
      </TouchableWithoutFeedback>
    );
  }, [isCrewMode, active]);

  return <>{displayTabs}</>;
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
)(TabBarItem);

const styles = StyleSheet.create({
  item: {
    height: "100%",
    minWidth: 60,
  },
  itemWhite: {
    height: "100%",
    width: 30,
  },
  tabWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 55,
  },
  imageWrapper: {
    height: 26,
    justifyContent: "center",
    alignItems: "center",
  },
});
