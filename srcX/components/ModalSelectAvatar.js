import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import Modal from "react-native-modal";

const ModalSelectAvatar = (props) => {
  const {
    isShowModal,
    onCloseModal,
    selectImageLibary,
    takeImageLibary,
    deleteAvatar,
  } = props;

  return (
    <Modal
      style={{ margin: 0 }}
      isVisible={isShowModal}
      onBackdropPress={onCloseModal}
      onBackButtonPress={onCloseModal}
    >
      <View style={styles.containeStyle}>
        <Text style={styles.titleStyle}>Update avatar</Text>
        <View style={styles.viewLineStyle} />
        <TouchableOpacity onPress={deleteAvatar} style={styles.btnStyle}>
          <Text style={styles.txtStyle}>Delete photo</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={takeImageLibary} style={styles.btnStyle}>
          <Text style={styles.txtStyle}>Take photo</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={selectImageLibary} style={styles.btnStyle}>
          <Text style={styles.txtStyle}>Photo library</Text>
        </TouchableOpacity>

        <View style={styles.rowStyle}>
          <TouchableOpacity onPress={onCloseModal} style={styles.btnStyle}>
            <Text style={styles.txtBoldStyle}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalSelectAvatar;

const styles = StyleSheet.create({
  containeStyle: {
    width: "60%",
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  titleStyle: {
    width: "100%",
    paddingVertical: 10,
    textAlign: "center",
    fontSize: 18,
    //textTransform: 'uppercase',
    fontWeight: "bold",
    color: "#EA5284",
  },
  viewLineStyle: {
    backgroundColor: "rgba(0, 0, 0, .3)",
    height: 1,
    width: "100%",
  },
  btnStyle: {
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0, 0, 0, .3)",
    justifyContent: "center",
    alignItems: "center",
  },
  txtStyle: {
    fontSize: 15,
  },
  txtBoldStyle: {
    fontSize: 15,
    // fontWeight: 'bold',
    // color: '#EA5284'
  },
  rowStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
