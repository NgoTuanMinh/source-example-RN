import React from "react";
import { StyleSheet, Image } from "react-native";
import { withTheme } from "react-native-elements";
import { ListItem } from "react-native-elements";
import PriceBlock from "./PriceBlock";
import { fixDecimals, convertTokensToCurrency } from "../../halpers/utilities";
import { connect } from "react-redux";
import { renderTitleItem, renderLeftItem } from "../../utils/CheckTypeToken";

const ListItemComponent = ({
  data,
  theme,
  onPress,
  formattedtime,
  wallets,
  userId,
  conversionRate,
}) => {
  if (!data.tokens) data.tokens = 0;
  if (!data.price)
    data.price = convertTokensToCurrency(data.tokens, conversionRate);
  else data.price /= 100;
  return (
    <ListItem
      key={data._id}
      title={renderTitleItem(userId, data)}
      subtitle={formattedtime}
      onPress={onPress}
      titleStyle={styles.title}
      subtitleStyle={{ color: theme.colors.gray }}
      leftElement={renderLeftItem(userId, data)}
      rightElement={
        <PriceBlock
          price={data.tokens ? fixDecimals(data.tokens) : 0}
          price2={data.price ? fixDecimals(data.price) : 0}
          userId={userId}
          data={data}
        />
      }
    />
  );
};

const mapStateToProps = (state) => ({
  wallets: state.wallets,
});

export default connect(mapStateToProps)(withTheme(ListItemComponent));

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    paddingBottom: 4,
    fontWeight: "bold",
  },
});
