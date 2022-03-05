import React, { useMemo } from "react";
import {
  Animated,
  View,
  StyleSheet,
  ScrollView,
  Text,
  Dimensions,
  FlatList,
  ImageBackground,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import { withTheme } from "react-native-elements";
import ContactItem from "../../ListItemComponent/ContactItem";
import { translate } from "../../../../App";
import { Icon } from "react-native-elements";
import * as Images from "../../Icons/CircleIcons";
import moment from "moment";
import CustomImageBackground from "../../CustomImageBackground";
import * as ImageCustom from "../../Icons/CircleIcons/index";
import * as ImageSvg from "../../Icons/CircleIcons/ImageSvg";
import { SafeAreaView } from "react-native";
import ItemTicketComponent from "../../ItemTicketComponent";

const deviceWidth = Dimensions.get("window").width;

export default (SaleTiketComponent = (props) => {
  const {
    navigation,
    onBackPress,
    data,
    nextSaleScreen,
    isLoading,
    is24Hour,
    onRefresh,
    isRefreshing
  } = props;

  const renderItem = ({ item, index }) => {
    if (!item) return null;
    return (
      <ItemTicketComponent
        item={item}
        index={index}
        onPressItem={nextSaleScreen}
        isShowNumberTicket={true}
        is24Hour={is24Hour}
      />
    );
  };

  const renderLoading = useMemo(() => {
    return (
      <View style={styles.viewLoadingStyle}>
        <ActivityIndicator size="large" color="#FF6195" />
      </View>
    );
  }, [isLoading]);

  return (
    <View style={styles.containerStyle}>
      <SafeAreaView style={styles.containerStyle}>
        <Animated.ScrollView
          contentContainerStyle={[styles.contentContainer]}
          scrollEventThrottle={160}
          
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        >
          {data.length > 0 ? (
            <View style={[styles.flatlistStyle, styles.shadownStyle]}>
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => String(index)}
              />
            </View>
          ) : (
            <View style={styles.notData}>
              <Text style={styles.styleTextNotData}>
                You are not selling any ticket right now.
              </Text>
            </View>
          )}
        </Animated.ScrollView>
        {isLoading && renderLoading}
      </SafeAreaView>
    </View>
  );
});

const styles = StyleSheet.create({
  styleTextNotData: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(0, 0, 0, 0.4)",
  },
  notData: {
    // height: deviceHeight,
    width: deviceWidth,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "40%",
  },
  containerStyle: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingTop: 0,
    paddingBottom: 110,
  },
  viewItemStyle: {
    flexDirection: "row",
    marginVertical: 5,
    paddingVertical: 5,
  },
  titleFlatlistStyle: {
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 15,
    marginBottom: 5,
  },
  imgBackGround: {
    height: 80,
    width: 80,
    resizeMode: "stretch",
  },
  imageItemStyle: {
    height: 80,
    width: 80,
    resizeMode: "stretch",
  },
  txtTimeStyle: {
    color: "#EA5284",
    fontSize: 14,
    fontFamily: "Lato",
  },
  txtTileStyle: {
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Lato",
    marginVertical: 2,
  },
  txtLocalStyle: {
    color: "rgba(0, 0, 0, 0.6)",
    fontSize: 14,
    fontFamily: "Lato",
  },
  viewInfoItemStyle: {
    marginLeft: 15,
    flex: 1,
  },
  flatlistStyle: {
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    marginTop: 20,
    paddingVertical: 10,
  },
  shadownStyle: {
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: "rgba(0,0,0,0.3)",
    elevation: 10,
  },
  imageNumberStyle: {
    height: 40,
    width: 40,
    resizeMode: "stretch",
    position: "absolute",
    left: 0,
    bottom: 0,
    // justifyContent: 'center',
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 5,
  },
  txtNumberItemStyle: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Lato",
  },
  viewLoadingStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
});
