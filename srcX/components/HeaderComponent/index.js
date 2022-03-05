import React, { Fragment } from "react";
import { SafeAreaView, Platform, View } from "react-native";
import { Header, Icon } from "react-native-elements";
import HeaderLeftComponent from "./HeaderLeftComponent";
import { connect } from "react-redux";
import XNavComponent from "../Navigation/XNavComponent";
import { getStatusBarHeight } from "../Constants/Constants";
import HeaderRightComponent from "./HeaderRightComponent";
const AppHeader = ({
  style,
  children,
  isSearch,
  title,
  params,
  handleClick,
  onPressSearch,
}) => {
  const renderLeftComponent = () => {
    if (isSearch) {
      return <HeaderLeftComponent onPressSearch={onPressSearch} />;
    }
    if ((params && params.isGoBack) || handleClick) {
      return <HeaderLeftComponent params={params} handleClick={handleClick} />;
    }
    return null;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SafeAreaView
        style={{
          flex: 1,
          position: "relative",
          height: "100%",
          width: "100%",
        }}
      >
        <Header
          leftComponent={renderLeftComponent}
          rightComponent={
            params ? (
              params.isNotification ? (
                <HeaderRightComponent params={params} />
              ) : null
            ) : null
          }
          centerComponent={{
            text: title,
            style: {
              color: "#000",
              textTransform: "uppercase",
              fontWeight: "bold",
              fontSize: 16,
            },
          }}
          backgroundColor="transparent"
          containerStyle={{
            ...Platform.select({
              ios: {
                paddingTop: 20,
              },
              android: {
                paddingTop: 10,
              },
            }),
            paddingHorizontal: 15,
            borderBottomWidth: 0,
            height: 56,
            margin: 0,
            width: "100%",
            backgroundColor: "#fff",
            ...style,
          }}
        />
        <View style={{ flex: 1 }}>{children}</View>
      </SafeAreaView>

      <XNavComponent
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />
    </View>
  );
};

export default connect(
  null,
  () => ({})
)(AppHeader);
