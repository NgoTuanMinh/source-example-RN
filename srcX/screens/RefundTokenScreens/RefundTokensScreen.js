import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import EditIcon from "../../components/Icons/Svg/Edit-icon";
import LogoRegularIcon from "../../components/Icons/CircleIcons/LogoRegularIcon";
import CircleIcons from "../../components/Icons/CircleIcons";
import { buyTokens, refundFee } from "../../redux/actions/index";
import styles from "./RefundScreensStyles";
import { fixDecimals } from "../../halpers/utilities";
import { translate } from "../../../App";
import NavigationService from "../../NavigationService";
import ScrollPickerCustom from "../../components/ScrollPickerCustom";
import Logo from "../../components/Icons/TabIcons/Logo";
import Picker from "@gregfrench/react-native-wheel-picker";
import { convertTokensToCurrency } from "../../halpers/utilities";
const dataItems = [
  //{ title: '4', value: 4 },
  { title: "9", value: 9 },
  { title: "15", value: 15 },
  { title: "18", value: 18 },
  { title: "24", value: 24 },
  { title: "36", value: 36 },
  { title: "50", value: 50 },
];
var PickerItem = Picker.Item;

const wheelPickerData = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];

class RefundTokenScreen extends Component {
  constructor(props) {
    super(props);
    const tokens = this.props.navigation.state.params.tokens;
    let selectedIndex = 0;
    if (tokens) {
      dataItems.forEach((item, index) => {
        if (item.value.toString() == tokens.toString()) selectedIndex = index;
      });
    }

    this.state = {
      selectedData: dataItems[selectedIndex].value,
      selectedIndex,
      showInput: false,
      progress: false,
      selectedDataValue: dataItems[selectedIndex].value,
      fee: 1,
    };
    this.scrollPic = React.createRef();
    this.valuesInput = dataItems[3].value;
  }

  static navigationOptions = ({ navigation }) => {
    const funBack = navigation.state.params
      ? navigation.state.params.changeSelectData
      : false;
    return {
      title: translate("RefundTokens"),
      headerLeft: (
        <TouchableOpacity
          onPress={funBack}
          style={{ marginLeft: 15, padding: 5 }}
        >
          <Icon name="close" type="antdesign" size={25} color="white" />
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
        // borderWidth: 0,
        textAlign: "center",
        // flexGrow: 1,
        alignSelf: "center",
      },
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ changeSelectData: this.onCloseInput });
    refundFee(this.onFeeCallback);
  }

  onFeeCallback = (response) => {
    console.log("response===", response);
    if (response.success) {
      const fee = +response.data.feePrice;
      console.log("fee==", fee);
      this.setState({ fee });
    }
  };

  onPickerSelect(selectedIndex) {
    if (this.state.progress) return;
    this.valuesInput = dataItems[selectedIndex].value;

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

    let valueCurrent = selectedData;
    let selectedDataFormat = valueCurrent.replace(".", ",");

    const { conversionRate } = this.props.wallets;
    const sum = convertTokensToCurrency(
      parseFloat(selectedData),
      conversionRate
    );
    if (sum > 2499) {
      selectedDataFormat = String(2499 * conversionRate);
      selectedDataFormat = selectedDataFormat.replace(".", ",");

      this.setState({ selectedData: 2499 * conversionRate });
    } else {
      this.setState({ selectedData: selectedData });
    }
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
              style={{
                fontSize: 63,
                fontWeight: "bold",
                overflow: "visible",
                color: "white",
              }}
              keyboardType="decimal-pad"
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
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
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
            <Picker
              style={{ width: 400, height: 630 }}
              selectedValue={this.state.selectedIndex}
              itemStyle={{
                color: "#ffffff",
                fontSize: 63,
                height: 630,
                fontWeight: "bold",
                backgroundColor: "transparent",
              }}
              onValueChange={(index) => this.onPickerSelect(index)}
            >
              {dataItems.map((value, i) => (
                <PickerItem
                  label={value.title}
                  value={i}
                  key={"money" + value.title}
                  placeholderTextColor="white"
                />
              ))}
            </Picker>
          </View>
        </View>
      );
    }
  }

  onCloseInput = () => {
    if (!this.state.showInput) {
      this.props.navigation.navigate("Wallet");
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
  };

  changeSelectData = () => {
    this.setState({
      showInput: !this.state.showInput,
    });
  };

  submitHandler = () => {
    let value = this.state.selectedData;
    const payinId = this.props.navigation.state.params.trandId;
    NavigationService.navigate("RefundPaymentScreen", {
      selectedData: value,
      payinId,
      fee: this.state.fee,
    });
  };

  isDisabled = () => {
    return this.state.selectedData <= 0;
  };

  render() {
    const { selectedData } = this.state;
    const { conversionRate } = this.props.wallets;

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.form}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          keyboardVerticalOffset="120"
        >
          {this.renderInput()}

          <Text style={styles.txtContentStyle}>{`Includes ??? ${fixDecimals(
            this.state.fee
          )} service fee`}</Text>

          <View style={{ backgroundColor: "#EA5284" }}>
            <TouchableOpacity
              style={[styles.btnSubmit, this.isDisabled() && styles.disabled]}
              onPress={this.submitHandler}
              disabled={this.isDisabled()}
            >
              <Text style={styles.btnSubmitText}>
                {translate("Refund")} ???{" "}
                {fixDecimals(
                  convertTokensToCurrency(selectedData, conversionRate) -
                    this.state.fee
                )}
              </Text>
            </TouchableOpacity>
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
  { buyTokens }
)(RefundTokenScreen);
