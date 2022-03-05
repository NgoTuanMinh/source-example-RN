import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  SafeAreaView,
} from "react-native";
import Modal from "react-native-modal";
import { Text, ListItem } from "react-native-elements";
import SearchComponent from "../../components/SearchComponent";

export default (ModalCountryCode = ({
  visible,
  data,
  setVisibleCountryCode,
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

  const _keyExtractor = (item, index) => String(index);

  const hiddenModal = () => {
    setVisibleCountryCode(false);
    setSearchedValue("");
  };

  const CountriesCodeItem = ({ item, onPressItem }) => {
    return (
      <TouchableWithoutFeedback onPress={() => onPressItem(item)}>
        <ListItem
          title={item.name}
          titleStyle={{ fontSize: 16 }}
          leftElement={<Text style={{ fontSize: 32 }}>{item.flag}</Text>}
          //rightElement={<Text style={styles.code}>{item.code}</Text>}
          containerStyle={{ alignItems: "center", justifyContent: "center" }}
        />
      </TouchableWithoutFeedback>
    );
  };

  const onClickItem = (item) => {
    onPressItem(item);
    setSearchedValue("");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={hiddenModal}
      style={{ margin: 0 }}
    >
      <SafeAreaView style={styles.wrapper}>
        <SearchComponent
          setSearchedValue={setSearchedValue}
          hiddenModal={hiddenModal}
          values={values}
        />
        <FlatList
          style={{ flex: 1, backgroundColor: "#fff" }}
          data={dataCountry}
          keyExtractor={_keyExtractor}
          renderItem={({ item }) => (
            <CountriesCodeItem item={item} onPressItem={onClickItem} />
          )}
        />
      </SafeAreaView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  code: {
    color: "#EA5284",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 0,
  },
});
