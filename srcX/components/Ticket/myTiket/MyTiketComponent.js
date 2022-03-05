import React, { useMemo } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Dimensions,
  Animated,
  SafeAreaView,
} from "react-native";
import { translate } from "../../../../App";
import { Icon } from "react-native-elements";
import * as ImageSvg from "../../Icons/CircleIcons/ImageSvg";
import moment from "moment";
import CustomImageBackground from "../../CustomImageBackground";
import * as ImageCustom from "../../Icons/CircleIcons/index";
import ItemTicketComponent from "../../ItemTicketComponent";
import ItemTicketGayComponent from "../../ItemTicketGayComponent";
import { NavigationEvents } from "react-navigation";
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
import ToastCustom from "../../ToastCustom";

export default (MyTiketComponent = (props) => {
  const {
    navigation,
    isLoading,
    dataToday,
    onPressItem,
    dataComing,
    isRefreshing,
    onRefresh,
    is24Hour,
    onPressPassEvent,
    dataPassEvent,
    isLoadingPassEvent,
    isShowSeePassEvent,
    onPressItemGray,
    onCheckoutEvent,
    isMorePassEvent,
    isShowData,
    isShowToast,
    setIsShowToast,
    dateFormat,
  } = props;

  const renderItem = ({ item, index }) => {
    return (
      <ItemTicketComponent
        item={item}
        index={index}
        onPressItem={onPressItem}
        isShowNumberTicket={true}
        is24Hour={is24Hour}
        dateFormat={dateFormat}
      />
    );
  };

  const renderGrayItem = ({ item, index }) => {
    return (
      <ItemTicketGayComponent
        item={item}
        index={index}
        onPressItem={onPressItemGray}
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

  const renderToday = useMemo(() => {
    return (
      dataToday.length > 0 && (
        <View style={[styles.flatlistStyle, styles.shadownStyle]}>
          <Text style={styles.titleFlatlistStyle}>Ongoing events</Text>
          <FlatList
            data={dataToday}
            renderItem={renderItem}
            keyExtractor={(item, index) => String(index)}
          />
        </View>
      )
    );
  }, [dataToday]);

  const renderUpComing = useMemo(() => {
    return (
      dataComing.length > 0 && (
        <View style={[styles.flatlistStyle, styles.shadownStyle]}>
          <Text style={styles.titleFlatlistStyle}>UPCOMING events</Text>
          <FlatList
            data={dataComing}
            renderItem={renderItem}
            keyExtractor={(item, index) => String(index)}
          />
        </View>
      )
    );
  }, [dataComing]);

  const renderPassEvent = useMemo(() => {
    if (dataPassEvent.data.length == 0 || !isShowData) return;

    return (
      <View style={[styles.flatlistStyle, styles.shadownStyle]}>
        <Text style={styles.titleFlatlistStyle}>PAST events</Text>
        <FlatList
          data={dataPassEvent.data}
          renderItem={renderGrayItem}
          keyExtractor={(item, index) => String(index)}
        />
      </View>
    );
  }, [dataPassEvent, isShowData]);

  const renderBtnPassEvent = useMemo(() => {
    if (isMorePassEvent) return;
    if (isLoadingPassEvent) {
      return (
        <View style={{ marginTop: 10 }}>
          <ActivityIndicator size="large" color="#FF6195" />
        </View>
      );
    }
    let text = "see past events";
    if (dataPassEvent.data.length < dataPassEvent.totalDocs) {
      text = "SEE MORE PAST EVENTS";
    }
    return (
      <TouchableOpacity onPress={onPressPassEvent} style={styles.btnPassEvent}>
        <Text style={styles.txtPassEvent}>{text}</Text>
      </TouchableOpacity>
    );
    return null;
  }, [isLoadingPassEvent, dataPassEvent, isMorePassEvent, isShowData]);

  return (
    <View style={styles.containerStyle}>
      <SafeAreaView style={styles.containerStyle}>
        <Animated.ScrollView
          contentContainerStyle={styles.contentContainer}
          scrollEventThrottle={160}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          {renderToday}
          {renderUpComing}
          {renderPassEvent}
          {renderBtnPassEvent}
          {dataToday.length <= 0 &&
            dataComing.length <= 0 &&
            dataPassEvent.data.length == 0 &&
            !isShowData &&
            !isLoading && (
              <View style={styles.notData}>
                <Text style={styles.styleTextNotData}>
                  You have no ticket yet.
                </Text>
                <Text style={styles.styleTextNotData}>
                  Let's{" "}
                  <Text onPress={onCheckoutEvent} style={{ color: "#EA5284" }}>
                    check out some events.
                  </Text>
                </Text>
              </View>
            )}
        </Animated.ScrollView>
        {isShowToast == true ? (
          <View style={{ marginBottom: 80 }}>
            <ToastCustom
              content={"Ticket listing deleted successfully"}
              onPress={setIsShowToast(false)}
            />
          </View>
        ) : null}
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
    paddingBottom: 10,
  },
  shadownStyle: {
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: "rgba(0,0,0,0.3)",
    elevation: 10,
  },
  btnPassEvent: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
  },
  txtPassEvent: {
    color: "rgba(0, 0, 0, 0.2)",
    fontSize: 12,
    fontFamily: "Lato",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  viewNumberStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
