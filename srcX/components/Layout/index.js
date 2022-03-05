import React from "react";
import { View, StyleSheet, Text } from "react-native";
//import { Text } from 'react-native-elements';

const style = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: "#fff",
    marginBottom: 16,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16.0,
    elevation: 15,
    paddingTop: 20,
    paddingBottom: 15,
    // justifyContent: "center",
    // zIndex: -5,
  },

  title: {
    fontSize: 14,
    textTransform: "uppercase",
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    fontFamily: "Lato",
    fontWeight: "bold",
    color: "#000000",
    opacity: 0.4,
  },
});

export const Section = ({ children, title, customStyle, customTextStyle }) => {
  return (
    <View style={[style.wrapper, customStyle]}>
      {title ? (
        <Text style={[style.title, customTextStyle]} h4>
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
};
