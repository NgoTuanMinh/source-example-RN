import React from "react";
import { Icon } from "react-native-elements";
// import { TouchableOpacity } from "react-native-gesture-handler";
import { withNavigation } from "react-navigation";
import NavigationService from "../../NavigationService";
import LogoRegularIcon from "../Icons/CircleIcons/LogoRegularIcon";
import * as Images from "../Icons/CircleIcons";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const HeaderLeftComponent = ({
  theme,
  navigation,
  params,
  handleClick,
  onPressSearch,
}) => {
  const onPressIconSearch = () => {
    if (onPressSearch) {
      onPressSearch();
    } else {
      NavigationService.navigate("SearchOperation");
    }
  };

  const onPressClick = () => {
    if (handleClick) {
      handleClick();
    } else {
      NavigationService.goBack();
    }
  };

  if ((params && params.isGoBack) || handleClick) {
    if (params && params.typeIcon != null) {
      return (
        <Icon
          name={params.nameIcon}
          type={params.typeIcon}
          onPress={onPressClick}
          size={25}
        />
      );
    }

    if (params && params.isLogo) {
      return (
        <TouchableOpacity onPress={onPressClick}>
          <LogoRegularIcon size={{ width: 30, height: 30 }} color="#EA5284" />
        </TouchableOpacity>
      );
    }

    return <Icon name="arrowleft" type="antdesign" onPress={onPressClick} />;
  }
  // return <Icon name="search" onPress={onPressIconSearch} size={25} />;
  return (
    <TouchableOpacity onPress={onPressIconSearch}>
    <Image
      source={Images.icSearch}
      
      style={{ width: 18, height: 18, resizeMode: "contain" }}
    />
    </TouchableOpacity>
  );
};

export default withNavigation(HeaderLeftComponent);
