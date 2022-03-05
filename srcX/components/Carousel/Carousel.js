import React, { Component } from "react";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import {
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import CarouselScreen from "./CarouselScreen";
import CardsCarouselScreen from "./CardsCarouselScreen";

import ImageCarousel_1 from "../../../assets/images/carousel-img.png";
import ImageCarousel_2 from "../../../assets/images/carousel-img2.png";
import ImageCarousel_3 from "../../../assets/images/carousel-img3.png";

//images for wallet Carousel
import WalletBg from "../../../assets/images/MYS19_TOKENS_wallet.png";

// Data for carousels
import { WelcomeCarouselEntries } from "./static/Entries";
import { setCurrentCard } from "../../redux/reducers/Wallets/index";
import Bugfender from "@bugfender/rn-bugfender";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";

const setImage = (image) => {
  switch (image) {
    case "slide-1":
      return ImageCarousel_1;

    case "slide-2":
      return ImageCarousel_2;

    case "slide-3":
      return ImageCarousel_3;
  }
};

const walletImage = (image) => {
  switch (image) {
    case true:
      return WalletBg;
  }
};

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

class CustomCarousel extends Component {
  constructor() {
    super();
    this.carousel = null;
    this.state = {
      activeSlide: 0,
    };
    Bugfender.d("evtx-wallet-carousel", "CustomCarousel component called");
  }

  onBeforeSnapChange = (index) => {
    if (this.props.walletCarousel) {
      const currentCardId = this.props.wallets.cards[index].id;
      this.props.setCurrentCard(currentCardId);
      this.setState({ activeSlide: index });
    } else {
      this.setState({ activeSlide: index });
      // if (++index === WelcomeCarouselEntries.length) {
      //   this.props.navigation.navigate('Main');
      // }
    }
  };

  _renderItem = ({ item }) => {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    const slideImage = setImage(item.image);
    const image = walletImage(item.bgImage);
    return this.props.walletCarousel ? (
      <CardsCarouselScreen
        item={item}
        conversionRate={this.props.wallets.conversionRate}
        bgImage={image ? image : null}
      />
    ) : item.id != 3 ? (
      <CarouselScreen item={item} slideImage={slideImage} />
    ) : (
      <GestureRecognizer
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        onSwipeUp={(state) => this.onSwipeUp(state)}
        onSwipeDown={(state) => this.onSwipeDown(state)}
        onSwipeLeft={(state) => this.onSwipeLeft(state)}
        onSwipeRight={(state) => this.onSwipeRight(state)}
        config={config}
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <CarouselScreen item={item} slideImage={slideImage} />
      </GestureRecognizer>
    );
  };

  onSwipeUp = (gestureState) => {
    //this.setState({myText: 'You swiped up!'});
  };

  onSwipeDown = (gestureState) => {};

  onSwipeLeft = (gestureState) => {
    this.props.navigation.navigate("Main");
  };

  onSwipeRight = (gestureState) => {};

  onSwipe = (gestureName, gestureState) => {
    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    //this.setState({gestureName: gestureName});
    switch (gestureName) {
      case SWIPE_UP:
        break;
      case SWIPE_DOWN:
        break;
      case SWIPE_LEFT:
        break;
      case SWIPE_RIGHT:
        break;
    }
  };

  pagination = () => {
    const { activeSlide } = this.state;

    const stylesPagination = {
      wellcomeComponent: {
        container: {
          backgroundColor: "transparent",
          position: "absolute",
          zIndex: 10,
          bottom: 10,
        },
        dotStyle: {
          width: 24,
          height: 8,
          borderRadius: 4,
          marginHorizontal: -2,
          backgroundColor: "rgba(255, 255, 255, 0.92)",
        },
      },
      walletComponent: {
        container: {
          backgroundColor: "transparent",
          position: "relative",
          marginTop: -30,
        },
        dotStyle: {
          width: 24,
          height: 8,
          borderRadius: 4,
          marginHorizontal: -2,
          backgroundColor: "rgba(0, 0, 0, 0.92)",
        },
      },
    };

    return (
      <Pagination
        dotsLength={
          this.props.walletCarousel
            ? this.props.wallets.dataWallet.length
            : WelcomeCarouselEntries.length
        }
        activeDotIndex={activeSlide}
        containerStyle={
          this.props.walletCarousel
            ? stylesPagination.walletComponent.container
            : stylesPagination.wellcomeComponent.container
        }
        dotStyle={
          this.props.walletCarousel
            ? stylesPagination.walletComponent.dotStyle
            : stylesPagination.wellcomeComponent.dotStyle
        }
        inactiveDotStyle={{
          width: 8,
          height: 8,
        }}
        inactiveDotOpacity={0.2}
        inactiveDotScale={this.props.walletCarousel ? 0.9 : 1}
      />
    );
  };

  render() {
    /*
      Here we chack if there are currentCard
      Then we find index of card
      and set slide index to card index
    */
    const { wallets } = this.props;
    let slideIndex =
      wallets.currentCardId || wallets.currentCardId === 0
        ? wallets.cards.findIndex(
            (item, index) => item.id === wallets.currentCardId
          )
        : 0;
    return (
      <View style={styles.container}>
        <Carousel
          data={
            this.props.walletCarousel
              ? this.props.wallets.dataWallet
              : WelcomeCarouselEntries
          }
          ref={(c) => {
            this.carousel = c;
          }}
          renderItem={this._renderItem}
          sliderWidth={viewportWidth}
          itemWidth={
            this.props.walletCarousel ? viewportWidth - 100 : viewportWidth
          }
          firstItem={slideIndex}
          layout={"default"}
          inactiveSlideOpacity={this.props.walletCarousel ? 0.4 : 1}
          inactiveSlideScale={this.props.walletCarousel ? 0.8 : 1}
          containerCustomStyle={{ overflow: "visible" }}
          onBeforeSnapToItem={this.onBeforeSnapChange}
          //onScroll={this.onScroll}
        />
        {this.pagination()}
      </View>
    );
  }
}

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
)(withNavigation(CustomCarousel));

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
});
