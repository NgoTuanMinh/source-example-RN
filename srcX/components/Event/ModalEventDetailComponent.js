import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { translate } from "../../../App";
import { Icon } from "react-native-elements";
import * as ImageSvg from "../Icons/CircleIcons/ImageSvg";
import * as ImageCustom from "../Icons/CircleIcons/index";
import CustomImageBackground from "../CustomImageBackground";
import Carousel, { Pagination } from "react-native-snap-carousel";
import CircleIcons from "../Icons/CircleIcons";
import { fixDecimals } from "../../halpers/utilities";
import Modal from "react-native-modal";
import { getEventImage } from "../../halpers/utilities";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

export default (ModalEventDetailComponent = (props) => {
  const { onCloseModal, data, currentTicket, isShowDetail, event } = props;
  const refCarousel = useRef(null);

  useEffect(() => {
    if (isShowDetail) {
      setTimeout(() => {
        refCarousel.current && refCarousel.current.snapToItem(currentTicket);
      }, 500);
    }
  }, [isShowDetail]);

  const renderEventItem = ({ item, index }) => {
    return (
      <View style={[styles.viewItemEventStyle, styles.shadownStyle]}>
        <View style={styles.borderTiketStyle}>
          <CustomImageBackground style={styles.imgBackGround}>
            <Image
              source={{ uri: getEventImage(event, false) }}
              style={styles.imgBackGround}
            />
          </CustomImageBackground>

          <Text
            numberOfLines={2}
            style={[
              styles.nameTiketStyle,
              { marginLeft: 15, marginRight: "10%" },
            ]}
          >
            {item.translatedName}
          </Text>
        </View>
        <ScrollView>
          <Text style={[styles.txtContentStyle, {}]}>
            {item.translatedDescription}
          </Text>
        </ScrollView>
      </View>
    );
  };
  return (
    <Modal
      style={{ margin: 0 }}
      isVisible={isShowDetail}
      onBackdropPress={onCloseModal}
      onBackButtonPress={onCloseModal}
    >
      <SafeAreaView style={styles.containeStyle}>
        <View style={styles.viewContentStyle}>
          {/* <View> */}
          <Carousel
            ref={refCarousel}
            layout={"default"}
            data={data}
            sliderWidth={deviceWidth}
            itemWidth={deviceWidth * 0.8}
            renderItem={renderEventItem}
            removeClippedSubviews={false}
            useScrollView={true}
            // currentScrollPosition={currentTicket}
            //currentIndex={currentTicket}
          />

          {/* </View> */}
        </View>
        <TouchableOpacity onPress={onCloseModal} style={styles.viewBtnStyle}>
          <Icon name="close" color="black" type="antdesign" size={22} />
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  containeStyle: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  viewContentStyle: {
    flex: 1,
  },
  viewBtnStyle: {
    position: "absolute",
    bottom: "5%",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    alignSelf: "center",
    // marginTop: 20
  },
  txtCloseStyle: {
    fontSize: 20,
    fontFamily: "Lato",
    fontWeight: "bold",
  },
  viewItemEventStyle: {
    height: deviceHeight * 0.75,
    marginTop: "10%",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  borderTiketStyle: {
    flexDirection: "row",
    paddingRight: 16,
    paddingVertical: 15,

    margin: 5,
    alignItems: "center",
  },
  imgBackGround: {
    height: 56,
    width: 56,
    resizeMode: "stretch",
  },
  viewNumberStyle: {
    position: "absolute",
    right: 16,
    flexDirection: "row",
    height: 48,
    width: 48,
    borderRadius: 25,
    backgroundColor: "#EA5284",
    justifyContent: "center",
    alignItems: "center",
  },
  nameTiketStyle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  txtContentStyle: {
    fontSize: 16,
    color: "#000",
    opacity: 0.8,
    fontFamily: "Lato",
    textAlign: "left",
  },
  shadownStyle: {
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: "rgba(0,0,0,0.3)",
    elevation: 10,
  },
});
