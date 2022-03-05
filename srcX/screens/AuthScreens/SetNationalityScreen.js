import React, { useState } from "react";
import {
  View,
  TextInput,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  FlatList,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import RegistrationStatusBar from "../../components/RegistrationStatusBar";
import { Button, ThemeProvider, Text, ListItem } from "react-native-elements";
import theme from "../../styles/themeStyles";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import { useEffect } from "react";

import { bindActionCreators } from "redux";
import { fetchGetNationalities } from "../../redux/actions/getNationalitiesAction";
import { saveScreenName } from "../../redux/actions/index";
import { translate } from "../../../App";
import SearchComponent from "../../components/SearchComponent";
import HeaderLeftComponent from "../../components/HeaderComponent/HeaderLeftComponent";
import { Icon } from "react-native-elements";
import { getDataKeystore } from "../../redux/actions/keyStore";
import { color } from "react-native-reanimated";
import { isIphoneXorAbove } from "../../utils/CheckTypeToken";

const primary = "#EA5284";

const SetNationalityScreen = (props) => {
  const {
    navigation,
    countries,
    getNationalities,
    saveScreenName,
    countryCode,
  } = props;

  const [nationality, setNationality] = useState("");
  const [country, setCountry] = useState("");

  const [visibleCountryCode, setVisibleCountryCode] = useState(false);
  const [searchedValue, setSearchedValue] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [typeModal, setTypeModal] = useState("");

  useEffect(() => {
    getCountryCode();
  }, []);

  const getCountryCode = async () => {
    const countryCode = await getDataKeystore("@countryCode");
    const nationalityItem = filteredCountries.filter((item) => {
      if (countryCode == item.code) return true;
      return false;
    });
    if (nationalityItem.length > 0) {
      setNationality(nationalityItem[0]);
      setCountry(nationalityItem[0]);
    }
  };

  useEffect(() => {
    // getNationalities()
    var countryRegister = countries.find(function(element) {
      return element.code == countryCode;
    });
    if (countryRegister) {
      setNationality(countryRegister);
      setCountry(countryRegister);
    }
  }, [countryCode]);

  useEffect(() => {
    const newFilteredList = countries.filter((item) =>
      item.name.toLowerCase().includes(searchedValue.toLowerCase())
    );
    setFilteredCountries(newFilteredList);
  }, [searchedValue]);

  const _onContinue = () => {
    const params = {
      ...navigation.state.params,
      country,
      nationality,
    };
    saveScreenName(params);
  };

  const onPressItemNationality = (item) => {
    if (typeModal === "NATIONALITY") {
      setNationality(item);
    } else if (typeModal === "COUNTRY") {
      setCountry(item);
    }
    setVisibleCountryCode(false);
  };

  const checkDiableBtnContinue = () => {
    let check = true;
    if (nationality.name && country.name) {
      check = false;
    }
    return check;
  };

  const onPressNationality = (TYPE) => {
    setVisibleCountryCode(true);
    setTypeModal(TYPE);
  };

  return (
    <ThemeProvider theme={theme}>
      {/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> */}
      <SafeAreaView style={[theme.droidSafeArea, { paddingTop: 0 }]}>
        <View style={theme.container}>
          <RegistrationStatusBar step={5} />
          <View style={styles.backButton}>
            <HeaderLeftComponent params={{ isGoBack: true }} />
          </View>

          <View style={styles.contentStyle}>
            <Text h1 h1Style={{ textAlign: "center" }}>
              ENTER YOUR NATIONALITY AND COUNTRY OF RESIDENCE
            </Text>

            <TouchableOpacity
              onPress={() => onPressNationality("NATIONALITY")}
              activeOpacity={1}
              style={styles.rowInput}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: "gray", fontSize: 14 }}>
                  {translate("Nationality")}
                </Text>

                <View style={styles.viewNationalityStyle}>
                  <Text
                    style={[
                      styles.input,
                      { marginRight: 7, borderColor: primary, fontSize: 24 },
                    ]}
                  >
                    {nationality.name}
                  </Text>
                  <View style={styles.viewIconStyle}>
                    <Icon name="angle-down" type="font-awesome" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onPressNationality("COUNTRY")}
              activeOpacity={1}
              style={[styles.rowInput, { paddingTop: 0 }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: "gray", fontSize: 14 }}>
                  {translate("CountryOfResidence")}
                </Text>
                <View style={styles.viewNationalityStyle}>
                  <Text
                    style={[
                      styles.input,
                      { marginRight: 7, borderColor: primary, fontSize: 24 },
                    ]}
                  >
                    {country.name}
                  </Text>
                  <View style={styles.viewIconStyle}>
                    <Icon name="angle-down" type="font-awesome" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
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
              title={translate("Continue").toUpperCase()}
              titleStyle={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "700",
                fontFamily: "Lato",
              }}
              disabledTitleStyle={{ color: "#fff" }}
              disabledStyle={{ opacity: 0.3 }}
              disabled={checkDiableBtnContinue()}
              onPress={() => _onContinue()}
              buttonStyle={{ alignSelf: "center", paddingVertical: 15 }}
            />
          </View>
        </View>

        <ModalCountryCode
          visible={visibleCountryCode}
          data={filteredCountries}
          setVisibleCountryCode={setVisibleCountryCode}
          setNationality={setNationality}
          onPressItem={onPressItemNationality}
        />
      </SafeAreaView>
      {/* </TouchableWithoutFeedback> */}
    </ThemeProvider>
  );
};

const _keyExtractor = (item, index) => String(index);

export const ModalCountryCode = ({
  visible,
  data,
  setVisibleCountryCode,
  setNationality,
  onPressItem,
}) => {
  const [dataCountry, setDataCountry] = useState(data);
  const [values, setValues] = useState("");

  const setSearchedValue = (txt) => {
    setValues(txt);
    const newFilteredList = data.filter((item) =>
      item.name.toLowerCase().includes(
        txt
          .toLowerCase()
          .replace(/\s{2,}/g, " ")
          .trim()
      )
    );
    setDataCountry(newFilteredList);
  };

  useEffect(() => {
    setDataCountry(data);
  }, [visible]);

  const hiddenModal = () => {
    setVisibleCountryCode(false);
    setSearchedValue("");
  };

  const onClickItem = (item) => {
    onPressItem(item);
    setSearchedValue("");
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={hiddenModal}>
      <SafeAreaView style={styles.wrapper}>
        <SearchComponent
          setSearchedValue={setSearchedValue}
          hiddenModal={hiddenModal}
          values={values}
        />
        <FlatList
          style={{ flex: 1 }}
          data={dataCountry}
          keyExtractor={_keyExtractor}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <CountriesCodeItem
              item={item}
              setVisibleCountryCode={setVisibleCountryCode}
              setNationality={setNationality}
              onPressItem={onClickItem}
            />
          )}
        />
      </SafeAreaView>
    </Modal>
  );
};

const CountriesCodeItem = ({ item, onPressItem }) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => onPressItem(item)}
      style={{ height: 50 }}
    >
      <ListItem
        title={item.name}
        titleStyle={{ fontSize: 16, marginTop: 0 }}
        leftElement={
          <Text style={{ fontSize: 28, marginTop: 0 }}>{item.flag}</Text>
        }
        // rightElement={<Text style={styles.code}>{item.code}</Text>}
        containerStyle={{ alignItems: "center", justifyContent: "center" }}
      />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  input: {
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
    paddingTop: 40,
    alignItems: "center",
    flexDirection: "column",
  },
  rowInput: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 15,
    borderBottomWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.2)",
  },
  wrapper: {
    flex: 1,
  },
  backButton: {
    alignItems: "flex-start",
    width: "100%",
  },
  viewNationalityStyle: {
    flexDirection: "row",
  },
  viewIconStyle: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  code: {
    color: "#EA5284",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 0,
  },
});

const mapStateToProps = (state) => {
  return {
    user: state.registration.profile,
    countries: state.countryCodes.countries,
    countryCode: state.registration.userInfo.code.code,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNationalities: bindActionCreators(fetchGetNationalities, dispatch),
    saveScreenName: bindActionCreators(saveScreenName, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetNationalityScreen);
