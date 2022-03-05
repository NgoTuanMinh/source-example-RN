import React, { useState } from "react";
import { connect } from "react-redux";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { Text, Icon } from "react-native-elements";
import { withNavigation } from "react-navigation";
import { getStatusBarHeight } from "../Constants/Constants";
import { translate } from "../../../App";
import NavigationService from "../../NavigationService";
import { debounce } from "lodash";

const SearchComponent = (props) => {
  const {
    setSearchedValue,
    hiddenModal,
    values,
    isShowBack = true,
    customStyle,
    placeHolder,
  } = props;

  const onBack = () => {
    setSearchedValue("");
    hiddenModal ? hiddenModal() : NavigationService.goBack();
  };

  return (
    <View style={style.wrapper}>
      <StatusBar barStyle="dark-content" />
      <View style={[style.header, style.boxWithShadow, customStyle]}>
        {isShowBack && (
          <TouchableOpacity onPress={onBack} style={style.buttons}>
            {/*  */}
            <Icon name="arrowleft" type="antdesign" size={22} />
          </TouchableOpacity>
        )}
        <View style={style.searchField}>
          <TextInput
            placeholder={placeHolder}
            onChangeText={(text) => setSearchedValue(text)}
            //onChangeText={debounce((text) => { setSearchedValue(text) }, 300)}
            style={{
              fontSize: 16,
              alignItems: "center",
              display: "flex",
              paddingLeft: 10,
            }}
            value={values}
            {...Platform.select({
              ios: {
                autoCorrect: false,
                textContentType: "Username",
              },
            })}
          />
        </View>
        <View>
          <TouchableOpacity
            onPress={() => setSearchedValue("")}
            style={style.buttons}
          >
            {values ? (
              <Icon name="close" color="black" type="antdesign" size={22} />
            ) : (
              <Icon name="search" size={22} type="material" color="black" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

SearchComponent.defaultProps = {
  placeHolder: "Search" + "...",
};

const mapStateToProps = (state) => ({
  countries: state.countryCodes.countries,
});

export default connect(
  mapStateToProps,
  () => ({})
)(withNavigation(SearchComponent));

const style = StyleSheet.create({
  wrapper: {
    width: "100%",
    height: 70,
  },
  header: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    marginVertical: 2,
  },
  searchField: {
    flex: 1,
    overflow: "hidden",
    textAlign: "left",
  },
  buttons: {
    paddingBottom: 12,
    paddingTop: 12,
    paddingLeft: 15,
    paddingRight: 15,
  },
  boxWithShadow: {
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: "rgba(0,0,0,0.1)",
    elevation: 5,
  },
});
