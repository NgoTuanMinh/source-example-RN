import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

const style = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: '#fff',
    marginBottom: 16,
    paddingTop: 20,
    paddingBottom: 15
  },

  title: {
    textTransform: 'uppercase',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    fontFamily: 'Lato-bold',
    fontWeight: 'bold'
  }
});

export const SectionNoShahow = ({ children, title }) => {
  return (
    <View style={style.wrapper}>
      {title ? (
        <Text style={style.title} h4>
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
};
