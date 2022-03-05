import React, {
  Component,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import {
  View,
  StyleSheet,
  Dimensions,
  AppState,
  Text,
  ImageBackground,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import EventCarouselScreen from "./EventCarouselScreen";
import { NavigationEvents } from "react-navigation";

import { setCurrentCard } from "../../redux/reducers/Wallets/index";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

const CarouselEvent = (props) => {
  const { wallets, onPressItem, data, dataComing } = props;

  // console.log("thai data", data);

  let dataShow = data.slice(0, 3);
  if (dataShow.length < 3) {
    const lengthDataShow = 3 - dataShow.length;
    let newData = dataComing.slice(0, lengthDataShow);
    dataShow = [...dataShow, ...newData];
  }
  // console.log("thai data3", dataShow);

  const [activeSlide, setActiveSlide] = useState(0);
  const carousel = useRef(null);

  const _renderItem = ({ item, index }) => {
    return (
      <EventCarouselScreen
        item={item}
        onPressItem={onPressItem}
        index={index}
      />
    );
  };

  const onBeforeSnapChange = (index) => {
    setActiveSlide(index);
  };

  const pagination = () => {
    return (
      <Pagination
        dotsLength={dataShow.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.containerDot}
        dotStyle={styles.dotStyle}
        inactiveDotStyle={{
          width: 8,
          height: 8,
          backgroundColor: "#000000",
          opacity: 0.2,
        }}
        inactiveDotOpacity={0.2}
        inactiveDotScale={0.9}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        data={dataShow}
        ref={carousel}
        renderItem={_renderItem}
        sliderWidth={viewportWidth}
        itemWidth={viewportWidth - 100}
        layout={"default"}
        // inactiveSlideOpacity={0.4}
        // inactiveSlideScale={0.8}
        containerCustomStyle={{ overflow: "visible" }}
        onBeforeSnapToItem={onBeforeSnapChange}
      />
      {pagination()}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    wallets: state.wallets,
    event: state.events.data,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setCurrentCard: (id) => dispatch(setCurrentCard(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(CarouselEvent));

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    color: "white",
    fontSize: 40,
  },
  dotStyle: {
    width: 24,
    height: 8,
    borderRadius: 4,
    marginHorizontal: -5,
    backgroundColor: "#FF6195",
  },
  containerDot: {
    backgroundColor: "transparent",
    position: "relative",
    marginTop: -30,
  },
});
