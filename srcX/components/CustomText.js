import React from 'react';
import { Text, StyleSheet } from 'react-native';

const CustomText = (props) => {
  return (
    <Text {...props} style={[props.style, styles.text]} />
  )
}

export default CustomText;

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Lato',
  }
})

