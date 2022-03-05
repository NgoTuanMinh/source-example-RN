import React, { useMemo } from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { BlurView } from "@react-native-community/blur";
import { Button } from "react-native-elements";
import CircleIcons from "../../components/Icons/CircleIcons";
import { getStatusBarHeight } from "../../components/Constants/Constants";
import { connect } from "react-redux";
import { setCrewMode } from "../../redux/actions";

const XNavScreen = ({ navigation, isCrewMode }) => {
  const normalModeDisplay = useMemo(() => {
    return (
      <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,.3)",
            padding: 20,
          }}
        >
          <BlurView
            tint="default"
            intensity={92}
            style={[
              styles.notBlurred,
              {
                alignContent: "flex-end",
                flexDirection: "column-reverse",
                flexWrap: "wrap",
                paddingBottom: 130,
                top: 0,
              },
            ]}
          >
            <Button
              buttonStyle={styles.buttons}
              title="Refund tokens"
              titleStyle={styles.navText}
              disabledStyle={{ opacity: 0.2 }}
              icon={<CircleIcons name={"refound"} color="#72C05E" />}
              disabledTitleStyle={{ color: "#fff", opacity: 1 }}
            />
            <Button
              buttonStyle={styles.buttons}
              title="Request tokens"
              titleStyle={styles.navText}
              disabledStyle={{ opacity: 0.2 }}
              icon={<CircleIcons name={"request"} color="#FCB96A" />}
              disabledTitleStyle={{ color: "#fff", opacity: 1 }}
            />
            <Button
              buttonStyle={styles.buttons}
              title="Send tokens"
              titleStyle={styles.navText}
              icon={<CircleIcons name={"arrow-right"} />}
              disabledStyle={{ opacity: 0.2 }}
              disabledTitleStyle={{ color: "#fff", opacity: 1 }}
            />
            <Button
              buttonStyle={styles.buttons}
              title="Top up tokens"
              icon={<CircleIcons name={"cart"} />}
              titleStyle={styles.navText}
              disabledStyle={{ opacity: 0.2 }}
              disabledTitleStyle={{ color: "#fff", opacity: 1 }}
              onPress={() => navigation.navigate("TopUpTokens")}
            />
          </BlurView>
        </View>
      </TouchableWithoutFeedback>
    );
  }, [isCrewMode]);

  return <>{!isCrewMode && normalModeDisplay}</>;
};

XNavScreen.navigationOptions = {
  headerShown: false,
  mode: "modal",
};

const mapStateToProps = (state) => {
  return {
    isCrewMode: state.profile.isCrewMode,
  };
};

export default connect(
  mapStateToProps,
  { setCrewMode }
)(XNavScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navText: {
    fontSize: 16,
    color: "black",
    marginLeft: 8,
  },
  iconContainerStyle: {
    marginRight: 5,
    backgroundColor: "red",
  },
  buttons: {
    backgroundColor: "#fff",
    margin: 15,
    height: 56,
    borderRadius: 8,
  },
  notBlurred: {
    ...StyleSheet.absoluteFill,
    top: getStatusBarHeight(),
  },
});
