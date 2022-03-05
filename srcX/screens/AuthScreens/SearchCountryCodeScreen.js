import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import CountriesCodeItem from "../../components/CountriesCodeItem";
import SearchComponent from "../../components/SearchComponent";

const SearchCountryCodeScreen = ({ countries }) => {
  const [searchedValue, setSearchedValue] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const _keyExtractor = (item) => item.countryCode;

  useEffect(() => {
    const newFilteredList = countries.filter((item) => {
      let isCheck = item.name.toLowerCase().includes(
        searchedValue
          .toLowerCase()
          .replace(/\s{2,}/g, " ")
          .trim()
      );
      if (!isCheck) {
        isCheck = item.code.toLowerCase().includes(searchedValue.toLowerCase());
      }
      return isCheck;
    });
    setFilteredCountries(newFilteredList);
  }, [searchedValue]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        enabled
      >
        <SearchComponent
          customStyle={{ marginVertical: 0 }}
          setSearchedValue={setSearchedValue}
          values={searchedValue}
        />
        <FlatList
          style={styles.wrapper}
          data={filteredCountries}
          keyExtractor={_keyExtractor}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <CountriesCodeItem
              item={item}
              setSearchedValue={setSearchedValue}
            />
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => ({
  countries: state.countryCodes.countries,
});

export default connect(
  mapStateToProps,
  () => ({})
)(SearchCountryCodeScreen);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  list: {
    paddingBottom: 30,
  },
});
