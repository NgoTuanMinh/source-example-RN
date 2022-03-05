import React from 'react';
import {  StyleSheet, TouchableOpacity, View, Text } from 'react-native';

const ButtonCustom = (props) => {
  return (
    <View style={[styles.container, props.bottom]}>
      <TouchableOpacity onPress={props.onPress}>
        <Text style={[styles.button, props.style]}>{props.title}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ButtonCustom;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ccc',
    borderRadius: 4,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    overflow: 'hidden',
    textTransform: 'uppercase',
    padding: 20,
    textAlign: 'center',
    width: '100%',
  },
  container: {
    width: '100%',
    position: "absolute",
    bottom: 20,
  },
});