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
import CardsCarouselScreen from "./CardsCarouselScreen";
import { NavigationEvents } from "react-navigation";

//images for wallet Carousel
import WalletBg from "../../../assets/images/MYS19_TOKENS_wallet.png";

import { setCurrentCard } from "../../redux/reducers/Wallets/index";

const walletImage = (image) => {
  switch (image) {
    case true:
      return WalletBg;
  }
};

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

const CarouselWallet = (props) => {
  const { wallets } = props;
  //   console.log("thai wallet", wallets.dataWallet.splice(1, 1));
  //   console.log("thai wwall", wallets.dataWallet);
  var newArr = [];
  wallets.dataWallet.forEach((elm, index) => {
    if (index != 1) {
      newArr.push(elm);
    }
  });
  //   console.log("thai new", newArr);
  let slideIndex =
    wallets.currentCardId || wallets.currentCardId === 0
      ? wallets.cards.findIndex(
          (item, index) => item.id === wallets.currentCardId
        )
      : 0;

  const [activeSlide, setActiveSlide] = useState(0);
  const carousel = useRef(null);

  const onBeforeSnapChange = (index) => {
    const currentCardId = wallets.cards[index].id;
    props.setCurrentCard(currentCardId);
    setActiveSlide(index);
  };

  const _renderItem = ({ item, index }) => {
    const image = walletImage(item.bgImage);
    return (
      <CardsCarouselScreen
        item={item}
        index={index}
        conversionRate={wallets.conversionRate}
        bgImage={image ? image : null}
      />
    );
  };

  const pagination = () => {
    return (
      <Pagination
        dotsLength={newArr.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.containerDot}
        dotStyle={styles.dotStyle}
        inactiveDotStyle={{ width: 8, height: 8 }}
        inactiveDotOpacity={0.2}
        inactiveDotScale={0.9}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        data={newArr}
        ref={carousel}
        renderItem={_renderItem}
        sliderWidth={viewportWidth}
        itemWidth={viewportWidth - 100}
        firstItem={slideIndex}
        layout={"default"}
        inactiveSlideOpacity={0.4}
        inactiveSlideScale={0.8}
        containerCustomStyle={{ overflow: "visible" }}
        onBeforeSnapToItem={onBeforeSnapChange}
        keyExtractor={(item, index) => String(index)}
      />
      {pagination()}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    wallets: state.wallets,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setCurrentCard: (id) => dispatch(setCurrentCard(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(CarouselWallet));

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
    marginHorizontal: -2,
    backgroundColor: "rgba(0, 0, 0, 0.92)",
  },
  containerDot: {
    backgroundColor: "transparent",
    position: "relative",
    marginTop: -30,
  },
});
