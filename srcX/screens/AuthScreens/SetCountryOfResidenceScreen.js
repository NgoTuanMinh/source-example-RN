import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import RegistrationStatusBar from "../../components/RegistrationStatusBar";
import { Button, ThemeProvider, Text } from "react-native-elements";
import theme from "../../styles/themeStyles";
import LinearGradient from "react-native-linear-gradient";
import { ModalCountryCode } from "./SetNationalityScreen";
import { connect } from "react-redux";
import { saveScreenName } from "../../redux/actions/index";
import { translate } from "../../../App";

const primary = "#EA5284";

const SetCountryOfResidenceScreen = (props) => {
  const { navigation, countries, saveScreenName } = props;

  const [country, setCountry] = useState("");
  const [visibleCountryModal, setVisibleCountryModal] = useState(false);
  const [searchedValue, setSearchedValue] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);

  const [isFocus, setIsFocus] = useState({
    isFirst: false,
    isLast: false,
  });

  useEffect(() => {
    const newFilteredList = countries.filter((item) =>
      item.name.toLowerCase().includes(searchedValue.toLowerCase())
    );
    setFilteredCountries(newFilteredList);
  }, [searchedValue]);

  const onPressItemNationality = (item) => {
    setCountry(item);
    setVisibleCountryModal(false);
  };

  const _onContinue = () => {
    const data = {
      ...navigation.state.params,
      country,
    };
    saveScreenName(data);
  };

  const checkDiableBtnContinue = () => {
    let check = true;
    if (country.name) {
      check = false;
    }
    return check;
  };

  return (
    <ThemeProvider theme={theme}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={[theme.droidSafeArea, { paddingTop: 0 }]}>
          <View style={theme.container}>
            <RegistrationStatusBar step={5} />

            <View style={styles.contentStyle}>
              <Text h1>Country of residence</Text>

              <Text
                style={{ opacity: 0.3, textAlign: "center", marginTop: 10 }}
              >
                This is legally required and will only be used for purchases
              </Text>

              <View style={styles.rowInput}>
                <TouchableOpacity
                  onPress={() => setVisibleCountryModal(true)}
                  activeOpacity={1}
                  style={{ flex: 1, marginRight: 7 }}
                >
                  <Text style={{ color: primary }}>Country of residence</Text>

                  <Text
                    style={[
                      styles.input,
                      { marginRight: 7, borderColor: primary },
                    ]}
                  >
                    {country.name || "--Choose your country--"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Button
              ViewComponent={LinearGradient}
              linearGradientProps={{
                colors: ["#FF6195", "#C2426C"],
                start: { x: 0, y: 0.5 },
                end: { x: 1, y: 0.5 },
              }}
              title={translate("Continue").toUpperCase()}
              titleStyle={{ color: "#fff", fontSize: 14 }}
              disabledTitleStyle={{ color: "#fff" }}
              disabledStyle={{ opacity: 0.3 }}
              disabled={checkDiableBtnContinue()}
              onPress={() => _onContinue()}
            />
          </View>

          <ModalCountryCode
            visible={visibleCountryModal}
            data={filteredCountries}
            setVisibleCountryModal={setVisibleCountryModal}
            setCountry={setCountry}
            onPressItem={onPressItemNationality}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </ThemeProvider>
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
    marginTop: 5,
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
    // justifyContent: 'center',
    alignItems: "center",
    flexDirection: "column",
    paddingTop: 40,
  },
  rowInput: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 30,
  },
});

const mapStateToProps = (state) => {
  return {
    countries: state.countryCodes.countries,
  };
};

export default connect(
  mapStateToProps,
  { saveScreenName }
)(SetCountryOfResidenceScreen);
