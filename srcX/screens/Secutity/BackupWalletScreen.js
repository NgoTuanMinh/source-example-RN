import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";
import * as Images from "../../components/Icons/CircleIcons";
import LinearGradient from "react-native-linear-gradient";
import { bindActionCreators } from "redux";
import NavigationService from "../../../src/NavigationService";
import { ButtonLinear } from "./SecurityScreen";
import { Icon } from "react-native-elements";
import { storeKey, getDataKeystore } from "../../redux/actions/keyStore";
import { isIphoneXorAbove } from "../../utils/CheckTypeToken";

const widthScreen = Dimensions.get("window").width;

function BackupWalletScreen(props) {
  const { navigation, user } = props;
  const isRegister = navigation.state.params
    ? navigation.state.params.isRegister
    : false;
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const memonic = await getDataKeystore("@memonic");
    if (memonic) {
      setData(memonic.split(" "));
    }
  };

  const nextScreen = () => {
    if (isRegister) {
      NavigationService.navigate("FinishRegistration");
    } else {
      onBack();
    }
  };

  const onBack = () => {
    NavigationService.goBack();
  };

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          width: widthScreen * 0.3,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={styles.txtItemIndexStyle}>{index + 1}</Text>
        <Text style={styles.txtItemStyle}> {item}</Text>
      </View>
    );
  };
  return (
    <View style={styles.droidSafeArea}>
      <SafeAreaView style={styles.droidSafeArea}>
        <View style={{ flex: 9, alignItems: "center", paddingTop: "20%" }}>
          <Text style={styles.textEnterCode}>RECOVERY PHRASE</Text>
          <Text
            style={{
              opacity: 0.4,
              marginTop: 20,
              paddingHorizontal: 20,
              textAlign: "center",
              fontSize: 16,
            }}
          >
            These 12 words are the only keys to recovering your wallet if you
            ever lose your device. Write them down carefully now and do not
            share with anyone.
          </Text>

          <View style={{ marginTop: 50, height: 250, marginVertical: "8%" }}>
            <FlatList
              data={data}
              renderItem={renderItem}
              numColumns={3}
              keyExtractor={(item, index) => String(index)}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            paddingBottom: 15,
            marginBottom: isIphoneXorAbove() ? 0 : 20,
          }}
        >
          <ButtonLinear
            label="I MADE A BACKUP"
            style={styles.buttonVerify}
            textStyle={styles.textVerify}
            onPress={nextScreen}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  textEnterCode: {
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: 24,
  },
  buttonVerify: {
    paddingVertical: 15,
    borderRadius: 3,
    alignItems: "center",
    alignSelf: "center",
    width: widthScreen - 30,
    //marginBottom: 15,
  },
  textVerify: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Lato",
  },
  viewIconStyle: {
    position: "absolute",
    top: 25,
    left: 0,
    height: 45,
    width: 45,
  },
  txtItemStyle: {
    marginVertical: 5,
    fontSize: 16,
    color: "#000",
    width: widthScreen * 0.3 - 20,
    paddingLeft: 3,
  },
  txtItemIndexStyle: {
    marginVertical: 5,
    fontSize: 16,
    color: "rgba(0,0,0,0.3)",
    textAlign: "right",
    width: 20,
  },
});
const mapStateToProps = (state) => {
  return {
    user: { ...state.registration.profile, ...state.registration.screenName },
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BackupWalletScreen);
