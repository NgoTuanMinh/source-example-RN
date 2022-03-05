import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, withTheme } from 'react-native-elements';
import CircleIcons from '../Icons/CircleIcons';
import { renderTypeItem } from '../../utils/CheckTypeToken'

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column'
  },
  mainPrice: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  price: {
    fontSize: 14,
    textAlign: 'right'
  },
  rowImg: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 4
  }
});

const PriceBlock = ({ price, price2, theme, userId, data, isBar = false }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.rowImg}>

        <CircleIcons
          name="logo-regular"
          color={theme.colors.primary}
          size={{ width: 11, height: 11 }}
        />
        <Text style={[styles.mainPrice, { color: theme.colors.primary }]}>
          {!isBar ? <Text style={[styles.mainPrice, { color: theme.colors.primary, marginRight: 5, }]}> {renderTypeItem(userId, data)}</Text> : " "}
          {price}
        </Text>
      </View>
      {!isBar ? <Text style={[styles.price, { color: theme.colors.gray }]}>
        € {renderTypeItem(userId, data)}{price2}
      </Text> : <Text style={[styles.price, { color: theme.colors.gray }]}>
          € {price2}
        </Text>}
    </View>
  );
};

export default withTheme(PriceBlock);
