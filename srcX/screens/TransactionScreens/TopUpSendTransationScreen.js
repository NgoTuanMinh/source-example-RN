import React, { Component } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Icon } from "react-native-elements";
import EditIcon from "../../components/Icons/Svg/Edit-icon";
import CircleIcons from "../../components/Icons/CircleIcons";
import { sendTokens } from "../../redux/actions/index";
import Bugfender from "@bugfender/rn-bugfender";
import LogoRegularIcon from "../../components/Icons/CircleIcons/LogoRegularIcon";
import ScrollPickerCustom from "../../components/ScrollPickerCustom";
import Picker from "@gregfrench/react-native-wheel-picker";
import * as LocalAuthentication from "expo-local-authentication";
import * as Keychain from "react-native-keychain";
import { getDataKeystore } from "../../redux/actions/keyStore";
import { fixDecimals, convertTokensToCurrency } from "../../halpers/utilities";
import NavigationService from "../../NavigationService";
import { MaterialIndicator } from "react-native-indicators";
import Logo from "../../components/Icons/TabIcons/Logo";
import FingerprintScanner from "react-native-fingerprint-scanner";

const dataItems = [
  { title: "4", value: 4 },
  { title: "9", value: 9 },
  { title: "15", value: 15 },
  { title: "18", value: 18 },
  { title: "24", value: 24 },
  { title: "36", value: 36 },
  { title: "50", value: 50 },
];
var PickerItem = Picker.Item;
//const dataSelect = dataItems.map(item => item.title);
const dataSelect = dataItems.map((item) => {
  return (
    <>
      <View
        style={{
          width: 32,
          height: 32,
          ...Platform.select({
            android: {
              width: 42,
              height: 28,
            },
          }),
        }}
      >
        <LogoRegularIcon size={{ width: 32, height: 32 }} color="#fff" />
      </View>
      <Text style={{ fontSize: 50, alignItems: "center" }}>{item.title}</Text>
    </>
  );
});

class TopUpSendTransationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultIndex: 3,
      selectedData: dataItems[3].value,
      selectedIndex: 3,
      showInput: false,
      progress: false,
      selectedDataValue: dataItems[3].value,
      isFaceId: false,
    };
    this.scrollPic = React.createRef();
    this.valuesInput = dataItems[3].value;
  }

  static navigationOptions = ({ navigation }) => {
    const funBack = navigation.state.params
      ? navigation.state.params.changeSelectData
      : false;
    let reciveName = "";

    if (navigation.state.params) {
      const item = navigation.state.params;
      if (item.givenName) {
        reciveName = `${item.givenName}`;
      } else if (item.displayName) {
        reciveName = item.displayName;
      }
    }
    return {
      title: "SENDING TO " + reciveName.trim(),
      headerLeft: (
        <TouchableOpacity onPress={funBack} style={{ marginLeft: 15 }}>
          <Icon name="angle-left" type="font-awesome" size={35} color="white" />
        </TouchableOpacity>
      ),
      headerRight: <View style={{ marginRight: 15 }} />,
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
        borderColor: "#EA5284",
        backgroundColor: "#EA5284",
      },
      headerTitleStyle: {
        fontWeight: "bold",
        color: "white",
        textTransform: "uppercase",
        textAlign: "center",
        alignSelf: "center",
      },
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ changeSelectData: this.onCloseInput });
    //this.scrollPic.current.scrollToIndex(3);
    this.checkPermisstionFaceId();
  }

  onPickerSelect(selectedIndex) {
    if (this.state.progress) return;
    this.setState({
      selectedData: dataItems[selectedIndex].value,
      selectedIndex: selectedIndex,
      selectedDataValue: dataItems[selectedIndex].value,
    });
  }

  onChangTextInput(selectedData) {
    selectedData = selectedData.replace("-", "");
    selectedData = selectedData.replace(",", ".");
    let countDotInString = this.searchDotOnString(".", selectedData);
    if (countDotInString > 1) {
      return;
    }

    let arraySplit = selectedData.split(".");
    if (arraySplit.length > 1 && arraySplit[1].length > 2) {
      return;
    }

    this.setState({ selectedData: selectedData });
    let valueCurrent = selectedData;
    let selectedDataFormat = valueCurrent.replace(".", ",");
    this.setState({ selectedDataValue: selectedDataFormat });
  }

  searchDotOnString(stringSearch, stringMain) {
    var count = 0;
    for (var i = 0; i < stringMain.length; i++) {
      if (stringMain[i] == stringSearch) {
        count = count + 1;
      }
    }
    return count;
  }

  renderInput() {
    if (this.state.showInput) {
      return (
        <View style={styles.inputContainer}>
          <CircleIcons
            name="logo-regular"
            color="white"
            size={{ width: 48, height: 48 }}
            style={{ marginTop: 2, marginRight: 8 }}
          />
          <View style={[styles.inputPrefix]}>
            <TextInput
              theme={{ colors: { primary: "red" } }}
              style={styles.textInputStyles}
              keyboardType="numeric"
              autoFocus={true}
              placeholderTextColor={"#fff"}
              value={`${this.state.selectedDataValue}`}
              onChangeText={(selectedData) =>
                this.onChangTextInput(selectedData)
              }
              maxLength={10}
              selectionColor="#fff"
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.viewStyles}>
          <View style={styles.contentContainer}>
            <TouchableOpacity
              style={styles.btn}
              onPress={this.changeSelectData.bind(this)}
            >
              <EditIcon color="#fff" />
            </TouchableOpacity>

            <View style={styles.logoXicon}>
              {/* <CircleIcons name='logo-regular' color='white' size={{ width: 44, height: 48 }} style={{ marginTop: 2, marginRight: 8 }} /> */}
              <Logo color="white" width={44} height={48} />
            </View>
            {/* <ScrollPickerCustom
              ref={this.scrollPic}
              dataSource={dataItems}
              onValueChange={(data, selectedIndex) => {
                Bugfender.d("evtx-token", `TopUpSendTransationScreen  amount to buy tokens ${dataItems[selectedIndex].value}`);
                if (this.state.progress) return;
                this.setState({
                  selectedData: dataItems[selectedIndex].value,
                  selectedIndex: selectedIndex,
                })
              }}
              selectedIndex={this.state.defaultIndex}
              wrapperHeight={styles.scrollPickerWrap.height}
              wrapperWidth={styles.scrollPickerWrap.width}
              wrapperBackground={styles.scrollPickerWrap.backgroundColor}
              itemHeight={65}
              highlightColor={'#dc4676'}
              highlightBorderWidth={1}
              itemTextStyle={styles.itemTextStyle}
              activeItemTextStyle={styles.activeItemTextStyle}
              renderItem={(item, index, selectedIndex) => {
                if (!selectedIndex) {
                  return (
                    <View style={styles.eventxIcon}>
                      <LogoRegularIcon size={{ width: 30, height: 30 }} color="#f297b5" />
                      <Text style={styles.txtPriceStyle}>{item.title}</Text>
                    </View>
                  )
                }
                return (
                  <View style={styles.eventxIcon}>
                    <LogoRegularIcon size={{ width: 32, height: 32 }} color="#fff" />
                    <Text style={styles.txtPriceChooseStyle}>{item.title}</Text>
                  </View>
                )
              }}
            /> */}

            <Picker
              style={{ width: 400, height: 630 }}
              selectedValue={this.state.selectedIndex}
              itemStyle={{
                color: "white",
                fontSize: 65,
                height: 630,
                fontWeight: "bold",
                opacity: 1,
              }}
              onValueChange={(index) => this.onPickerSelect(index)}
            >
              {dataItems.map((value, i) => (
                <PickerItem
                  label={value.title}
                  value={i}
                  key={"money" + value.title}
                >
                  {/* <LogoRegularIcon size={{ width: 30, height: 30 }} color="#f297b5" />
                           <Text style={styles.txtPriceStyle}>{value.title}</Text> */}
                </PickerItem>
              ))}
            </Picker>
          </View>
        </View>
      );
    }
  }

  onCloseInput = () => {
    if (!this.state.showInput) {
      const nameScreen = this.props.navigation.state.params.nameScreen;
      this.props.navigation.navigate(nameScreen);
      return;
    }

    if (this.state.selectedData == 0) {
      this.setState({
        showInput: !this.state.showInput,
        selectedData: this.valuesInput,
        selectedDataValue: this.valuesInput,
      });
    } else {
      this.setState({
        showInput: !this.state.showInput,
        selectedData: dataItems[this.state.selectedIndex].value,
        selectedDataValue: dataItems[this.state.selectedIndex].value,
      });
    }

    // this.setState({
    //   showInput: !this.state.showInput,
    // });
  };

  changeSelectData = () => {
    this.setState({
      showInput: !this.state.showInput,
    });
  };

  scanFingerprint = async () => {
    FingerprintScanner.authenticate({
      description: "Confirm your fingerprint/faceid to log in",
    })
      .then(async function(res) {
        FingerprintScanner.release();
        this.submitToken();
      })
      .catch((error) => {
        if (
          error.message &&
          error.message.includes("was canceled by the user")
        ) {
          hiddenInput.current && hiddenInput.current.focus();
        }
      });
  };

  checkPermisstionFaceId = async () => {
    const faceIdEnabled = await getDataKeystore("@faceIdEnabled");
    if (faceIdEnabled) {
      this.setState({ isFaceId: faceIdEnabled });
    }
  };

  sendToken = async () => {
    Keyboard.dismiss();
    let value = this.state.selectedData;
    const wallets = this.props.wallets;
    const currentWallet = wallets.dataWallet.filter(
      (item) => item.id == wallets.currentCardId
    );
    const currentPrice = parseInt(
      currentWallet[0] ? currentWallet[0].mainPrice : 0
    );
    if (currentPrice == 0 || currentPrice < parseInt(value)) {
      Alert.alert(
        "Warning!",
        "You don't have enough tokens",
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
      return;
    }

    const { conversionRate } = this.props.wallets;

    const sum = convertTokensToCurrency(parseFloat(value), conversionRate);
    if (sum > 250) {
      Alert.alert(
        "Limit exceeded",
        "You can only send maximum €250 worth of tokens per transaction. Please try again with a lower amount.",
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ],
        { cancelable: false }
      );
      return;
    }
    // NavigationService.navigate("Login", { submitToken: this.submitToken });
    NavigationService.navigate("LookerScreen", {
      submitToken: this.submitToken,
    });
  };

  submitToken = () => {
    this.setState({ progress: true });
    let value = this.state.selectedData;
    if (typeof value === "string") {
      value = parseFloat(value.replace(",", "."), 10);
    }

    if (this.props.navigation.state.params) {
      const item = this.props.navigation.state.params;
      this.props.sendTokens(item, value, this.callBack);
    }
  };

  callBack = (isProgress) => {
    if (!isProgress) {
      Alert.alert(
        "Warning!",
        "Can't transfer tokens. Please try again!",
        [{ text: "OK", onPress: () => {} }],
        { cancelable: false }
      );
    }
    this.setState({ progress: isProgress });
  };

  renderLoading = () => {
    const { progress } = this.state;
    if (!progress) return null;
    return (
      <View style={[styles.viewLoading, progress && { opacity: 1.0 }]}>
        <MaterialIndicator color="#FFF" size={25} />
      </View>
    );
  };

  isDisabled = () => {
    return this.state.selectedData <= 0;
  };

  render() {
    const { progress, selectedData } = this.state;
    const { conversionRate } = this.props.wallets;
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.form}
          behavior="padding"
          keyboardVerticalOffset="74"
        >
          {this.renderInput()}
          <View style={{ backgroundColor: "#EA5284" }}>
            <TouchableOpacity
              style={[
                styles.btnSubmit,
                (progress || this.isDisabled()) && styles.disabled,
              ]}
              onPress={this.sendToken}
              disabled={progress || this.isDisabled()}
            >
              <Text style={[styles.btnSubmitText]}>SEND</Text>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  marginLeft: 5,
                }}
              >
                {/* <LogoRegularIcon
                  size={{
                    width: 13,
                    height: 11,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  color="#EA5284"
                /> */}
                <CircleIcons
                  name="logo-regular"
                  color="#EA5284"
                  size={{ width: 13, height: 14 }}
                />
                <Text style={[styles.btnSubmitText]}>
                  {fixDecimals(selectedData)}
                </Text>
              </View>
            </TouchableOpacity>
            {this.renderLoading()}
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tokens: state.tokens,
    wallets: state.wallets,
  };
};

export default connect(
  mapStateToProps,
  { sendTokens }
)(TopUpSendTransationScreen);

const styles = StyleSheet.create({
  form: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#EA5284",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#EA5284",
    textTransform: "uppercase",
    position: "absolute",
    textAlign: "center",
    top: 30,
    left: 10,
    right: 10,
  },
  btnSubmit: {
    flexDirection: "row",
    // height: 50,
    paddingVertical: 15,
    borderRadius: 4,
    backgroundColor: "#fff",
    marginBottom: 25,
    marginHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  btnSubmitText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#EA5284",
    textAlign: "center",
    textTransform: "uppercase",
  },
  contentContainer: {
    height: 630,
  },
  inputContainer: {
    zIndex: 12,
    width: "100%",
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  inputPrefix: {
    fontSize: 63,
    fontWeight: "bold",
    // fontFamily: 'Lato',
    color: "#fff",
  },
  btn: {
    position: "absolute",
    top: "50%",
    zIndex: 10,
    width: 44,
    height: 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 44,
    backgroundColor: "#f398b7",
    right: 30,
    marginTop: -22,
  },

  logoXicon: {
    position: "absolute",
    top: "46%",
    zIndex: 10,
    width: 45,
    height: 52,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    left: 110,
  },

  itemTextStyle: {
    fontSize: 64,
    lineHeight: 64,
    fontWeight: "bold",
    fontFamily: "Lato-bold",
    color: "#f398b7",
    transform: [{ scaleY: 0.7 }],
  },
  activeItemTextStyle: {
    fontSize: 64,
    lineHeight: 64,
    fontWeight: "bold",
    fontFamily: "Lato-bold",
    color: "#fff",
    transform: [{ scaleY: 1 }, { translateY: 7 }],
  },
  scrollPickerWrap: {
    height: 630,
    width: 345,
    backgroundColor: "#EA5284",
  },
  disabled: {
    opacity: 0.5,
  },
  textInputStyles: {
    fontSize: 63,
    fontWeight: "bold",
    overflow: "visible",
    color: "white",
  },
  viewStyles: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  eventxIcon: {
    flexDirection: "row",
    paddingVertical: 10,
    alignSelf: "center",
    marginVertical: 5,
    height: 55,
    width: 70,
  },
  txtPriceStyle: {
    fontSize: 40,
    marginTop: Platform.OS == "android" ? -12 : -8,
    color: "#f297b5",
    fontWeight: "bold",
    marginLeft: 5,
  },
  txtPriceChooseStyle: {
    fontSize: 45,
    marginTop: Platform.OS == "android" ? -15 : -11,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  viewLoading: {
    position: "absolute",
    left: "25%",
    bottom: 38,
    zIndex: 999,
    opacity: 1,
    marginRight: 10,
  },
});
