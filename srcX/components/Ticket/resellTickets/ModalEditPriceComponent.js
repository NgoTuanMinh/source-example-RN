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
  Keyboard,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Icon } from "react-native-elements";
import EditIcon from "../../../components/Icons/Svg/Edit-icon";
import CircleIcons from "../../../components/Icons/CircleIcons";
import Picker from "@gregfrench/react-native-wheel-picker";
import Logo from "../../../components/Icons/TabIcons/Logo";
import { fixDecimalsF, fixDecimals } from "../../../halpers/utilities";
const deviceHeight = Dimensions.get("window").height;

let dataItems = [];
var PickerItem = Picker.Item;

class ModalEditPriceComponent extends Component {
  constructor(props) {
    super(props);
    const { originalToken, lowestToken } = props;
    let items =
      lowestToken === originalToken
        ? [lowestToken]
        : [lowestToken, originalToken];
    items.push(
      ...[originalToken * 1.025, originalToken * 1.05, originalToken * 1.1]
    );
    dataItems = items
      .sort((a, b) => a - b)
      .map((s) => {
        return { title: fixDecimals(s), value: fixDecimalsF(s) };
      });

    const defaultIndex = dataItems
      .map((s) => s.value)
      .indexOf(fixDecimalsF(originalToken));
    if (defaultIndex < 0) defaultIndex = 0;
    this.state = {
      defaultIndex: defaultIndex,
      selectedData: dataItems[defaultIndex].value,
      selectedIndex: defaultIndex,
      showInput: false,
      selectedDataValue: fixDecimals(dataItems[defaultIndex].value),
      selectedDataTemp: dataItems[defaultIndex].value,
    };
    this.scrollPic = React.createRef();
    this.valuesInput = dataItems[defaultIndex].value;
  }

  onPickerSelect(selectedIndex) {
    this.setState({
      selectedData: dataItems[selectedIndex].value,
      selectedIndex: selectedIndex,
      selectedDataValue: fixDecimals(dataItems[selectedIndex].value),
      selectedDataTemp: dataItems[selectedIndex].value,
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

          <View
            style={{
              backgroundColor: "#EA5284",
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <TouchableOpacity
              style={[styles.btnSubmit, this.isDisabled() && styles.disabled]}
              onPress={this.sendToken}
              disabled={this.isDisabled()}
            >
              <Text style={[styles.btnSubmitText]}>DONE</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.viewStyles}>
        <View style={styles.contentContainer}>
          <TouchableOpacity
            style={styles.btn}
            onPress={this.changeSelectData.bind(this)}
          >
            <EditIcon color="#fff" />
          </TouchableOpacity>

          <View
            style={[
              styles.logoXicon,
              { left: dataItems[0].value >= 100 ? 40 : 70 },
            ]}
          >
            <Logo color="white" width={44} height={48} />
          </View>
          {/* {console.log(dataItems)} */}
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
              />
            ))}
          </Picker>
        </View>

        <View
          style={{
            backgroundColor: "#EA5284",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <TouchableOpacity
            style={styles.btnSubmit}
            onPress={this.sendToken}
            // disabled={this.isDisabled()}
          >
            <Text style={[styles.btnSubmitText]}>DONE</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  changeSelectData = () => {
    this.setState({
      showInput: !this.state.showInput,
    });
  };

  sendToken = async () => {
    let value = this.state.selectedData;
    // console.log("value===", value);
    // console.log("data Items===", dataItems[dataItems.length - 1].value);
    if (value > dataItems[dataItems.length - 1].value) {
      alert(
        `You are not allowed to set price more than ${
          dataItems[dataItems.length - 1].value
        }`
      );
      return;
    }
    Keyboard.dismiss();
    this.props.onCallBackPrice && this.props.onCallBackPrice(value);
  };

  isDisabled = () => {
    return this.state.selectedData <= 0;
  };

  onBack = () => {
    if (this.state.showInput) {
      this.setState({
        selectedData: this.state.selectedDataTemp,
      });
      this.changeSelectData();
      return;
    }
    this.props.onCallBackPrice && this.props.onCallBackPrice(0);
  };

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.form}>
          <KeyboardAvoidingView
            style={styles.form}
            behavior={Platform.OS == "ios" ? "padding" : ""}
          >
            <View style={styles.viewHeaderStyle}>
              <TouchableOpacity
                style={{ paddingHorizontal: 10 }}
                onPress={this.onBack}
              >
                <Icon
                  name="angle-left"
                  type="font-awesome"
                  size={35}
                  color="white"
                />
              </TouchableOpacity>

              <Text style={styles.titleHeaderStyle} numberOfLines={1}>
                EDIT PRICE
              </Text>
              <View style={{ width: 30 }} />
            </View>
            {this.renderInput()}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    wallets: state.wallets,
  };
};

export default connect(mapStateToProps)(ModalEditPriceComponent);

const styles = StyleSheet.create({
  form: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#EA5284",
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
    minHeight: 630,
    zIndex: -1,
    alignSelf: "center",
    // backgroundColor: '#fff'
  },
  inputContainer: {
    zIndex: -1,
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
    // left: 40,
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
  viewHeaderStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    flexDirection: "row",
    paddingHorizontal: 15,
    height: 56,
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleHeaderStyle: {
    fontWeight: "bold",
    fontSize: 16,
    paddingHorizontal: 10,
    maxWidth: "80%",
    fontFamily: "Lato",
    textTransform: "uppercase",
    color: "#fff",
  },
});
