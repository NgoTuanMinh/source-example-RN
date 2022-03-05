import React from 'react';
import { Text } from 'react-native-elements';
import { View } from 'react-native';

const ThemeSettings = () => {
  /**
   * Go ahead and delete View and replace it with your content;
   * we just wanted to give you a quick view of your config.
   */
  return (
    <View
      style={{
        flexDirection: 'row',
        color: '#000',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text h5>Theme Settings Content</Text>
    </View>
  );
};

export default ThemeSettings;

ThemeSettings.navigationOptions = {
  title: 'Theme Settings'
};
