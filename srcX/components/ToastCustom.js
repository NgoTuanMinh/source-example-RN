import React from "react";
import { StyleSheet, TouchableOpacity, View, Text, Image } from "react-native";

const ToastCustom = (props) => {
  const { content, onPress } = props;

  return (
    <View style={styles.mainToast}>
      <View style={{ width: "85%", padding: 10 }}>
        <Text style={styles.textToast}>{content}</Text>
      </View>
      <View
        style={{
          width: "15%",
          padding: 15,
          alignItems: "center",
          justifyContent: "flex-end",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity onPress={() => onPress}>
          <Image
            source={require("../../assets/images/icClose.png")}
            style={{
              height: 14,
              width: 14,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ToastCustom;

const styles = StyleSheet.create({
  textToast: {
    fontSize: 14,
    fontWeight: "400",
    color: "#fff",
    lineHeight: 20,
  },
  mainToast: {
    // width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#666666",
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 4,
  },
});
