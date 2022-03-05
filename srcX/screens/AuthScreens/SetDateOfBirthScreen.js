import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import RegistrationStatusBar from "../../components/RegistrationStatusBar";
import { Button, ThemeProvider, Text } from "react-native-elements";
import theme from "../../styles/themeStyles";
import LinearGradient from "react-native-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import HeaderLeftComponent from "../../components/HeaderComponent/HeaderLeftComponent";
import { translate } from "../../../App";
import { isIphoneXorAbove } from "../../utils/CheckTypeToken";

const SetDateOfBirthScreen = (props) => {
  const { navigation } = props;

  let datePickerIOS = moment().format("MM-DD-YYYY");

  const [birthDay, setBirthDay] = useState("01-01-1990");
  const [visibleModalBirthDay, setVisibleModalBirthDay] = useState(false);

  const primary = "#EA5284";

  const _onContinue = () => {
    if (String(birthDay).length == 0) return;
    const params = {
      ...navigation.state.params,
      birthDay: birthDay,
    };
    navigation.navigate("SetNationality", params);
  };

  const onChangeDatePicker = (event, date) => {
    setVisibleModalBirthDay(false);
    if (date) {
      setBirthDay(moment(date).format("MM-DD-YYYY"));
    }
  };

  const onChangeDatePickerIOS = (event, date) => {
    datePickerIOS = moment(date).format("MM-DD-YYYY");
  };

  const onDatePickerIOS = (action) => {
    switch (action) {
      case "CLEAR":
        {
          setVisibleModalBirthDay(false);
        }
        break;
      case "DONE":
        {
          setBirthDay(datePickerIOS);
          setVisibleModalBirthDay(false);
        }
        break;
      default:
        break;
    }
  };

  let valueStartDate = new Date();

  if (birthDay) {
    valueStartDate = birthDay && birthDay.split("-");
  }

  if (!Array.isArray(valueStartDate)) {
    valueStartDate = new Date();
  } else {
    let date =
      valueStartDate[0] + "/" + valueStartDate[1] + "/" + valueStartDate[2];
    valueStartDate = new Date(date);
  }

  return (
    <ThemeProvider theme={theme}>
      {/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> */}
      <SafeAreaView style={[theme.droidSafeArea, { paddingTop: 0 }]}>
        <View style={[theme.container, { alignItems: "stretch" }]}>
          <RegistrationStatusBar step={4} />
          <View style={styles.backButton}>
            <HeaderLeftComponent params={{ isGoBack: true }} />
          </View>

          <View style={styles.contentStyle}>
            <Text h1Style={{ textAlign: "center" }} h1>
              {" "}
              ENTER YOUR DATE OF BIRTH{" "}
            </Text>

            <View style={[styles.btnSelectDate, { borderColor: primary }]}>
              <Text style={{ color: "grey", fontSize: 14 }}>Date of birth</Text>

              <TouchableOpacity onPress={() => setVisibleModalBirthDay(true)}>
                <Text style={styles.textDate}>{birthDay}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              marginBottom: isIphoneXorAbove() ? 0 : 20,
            }}
          >
            <Button
              ViewComponent={LinearGradient}
              linearGradientProps={{
                colors: ["#FF6195", "#C2426C"],
                start: { x: 0, y: 0.5 },
                end: { x: 1, y: 0.5 },
              }}
              disabled={!birthDay}
              disabledTitleStyle={{ color: "#fff" }}
              disabledStyle={{ opacity: 0.3 }}
              title={translate("Continue").toUpperCase()}
              titleStyle={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "700",
                fontFamily: "Lato",
              }}
              onPress={_onContinue}
              buttonStyle={{ alignSelf: "center", paddingVertical: 15 }}
            />
          </View>
        </View>

        {visibleModalBirthDay &&
          (Platform.OS === "ios" ? (
            <DatePickerIOS
              value={valueStartDate}
              datePickerIOS={datePickerIOS}
              onChangeDatePickerIOS={onChangeDatePickerIOS}
              isVisible={visibleModalBirthDay}
              onDatePickerIOS={onDatePickerIOS}
            />
          ) : (
            <DateTimePicker
              value={valueStartDate}
              mode="date"
              display="default"
              onChange={onChangeDatePicker}
              maximumDate={new Date()}
            />
          ))}
      </SafeAreaView>
      {/* </TouchableWithoutFeedback> */}
    </ThemeProvider>
  );
};

const DatePickerIOS = ({
  datePickerIOS,
  onChangeDatePickerIOS,
  isVisible,
  onDatePickerIOS,
  value,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      style={styles.bgModal}
      onBackButtonPress={() => onDatePickerIOS("CLEAR")}
      onBackdropPress={() => onDatePickerIOS("CLEAR")}
    >
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: 10,
          }}
        >
          <TouchableOpacity
            style={styles.viewStyle}
            onPress={() => onDatePickerIOS("CLEAR")}
          >
            <Text style={styles.txtStyle}>CLEAR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.viewStyle}
            onPress={() => onDatePickerIOS("DONE")}
          >
            <Text style={styles.txtStyle}>DONE</Text>
          </TouchableOpacity>
        </View>

        <DateTimePicker
          display="spinner"
          value={value}
          mode="date"
          onChange={onChangeDatePickerIOS}
          maximumDate={new Date()}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.2)",
    fontSize: 24,
    color: "#000",
    minHeight: 40,
    width: "100%",
  },
  form: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column",
    width: "100%",
    paddingTop: 95,
  },
  contentStyle: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 40,
  },
  btnSelectDate: {
    paddingVertical: 10,
    borderBottomWidth: 2,
  },
  textDate: {
    fontSize: 24,
    marginTop: 0,
  },
  bgModal: {
    flex: 1,
    margin: 0,
    backgroundColor: "transparent",
  },
  viewStyle: {
    alignItems: "center",
    justifyContent: "center",
  },
  txtStyle: {
    fontSize: 15,
    color: "#000",
    fontWeight: "bold",
  },
  backButton: {
    alignItems: "flex-start",
    width: "100%",
  },
});

export default SetDateOfBirthScreen;
