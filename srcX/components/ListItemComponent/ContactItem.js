import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import CircleIcons from "../Icons/CircleIcons";
import { ListItem, withTheme } from "react-native-elements";
import NavigationService from "../../NavigationService";
import Logo from "../../components/Icons/TabIcons/Logo";

const ContactItem = ({
  contact,
  theme,
  isUsers = false,
  nameScreen,
  isShowSentTo,
  onPressContact,
}) => {
  //   console.log("thai contact", contact);
  const item = { ...contact, nameScreen };
  const number = item.phoneNumbers
    ? item.phoneNumbers[0]
      ? item.phoneNumbers[0].number
      : null
    : null;
  const sighIcon = `${item.givenName ? item.givenName.charAt(0) : ""}${
    item.familyName ? item.familyName.charAt(0) : ""
  }`;
  const leftElement =
    item.thumbnailPath && item.thumbnailPath.length > 0
      ? { uri: item.thumbnailPath }
      : sighIcon;

  const fullName =
    item.givenName && item.givenName.length > 0
      ? item.givenName
      : item.familyName;

  const onPressTopUp = () => {
    if (onPressContact) {
      onPressContact(item);
    } else {
      NavigationService.navigate("TopUpSendTransationScreen", item);
    }
  };

  const actionIcon = isUsers ? (
    <TouchableOpacity onPress={onPressTopUp} style={styles.listItem}>
      <CircleIcons
        background={theme.colors.primaryGradient}
        name="arrow-right"
        color="#fff"
      />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity style={styles.listItem}>
      <CircleIcons
        background={theme.colors.secondaryGradient}
        name="add-user"
      />
    </TouchableOpacity>
  );

  return (
    <TouchableOpacity onPress={onPressTopUp} disabled={!isUsers}>
      <ListItem
        key={number}
        title={fullName}
        subtitle={!isUsers ? number : contact.value}
        titleStyle={[styles.title]}
        subtitleStyle={{ color: theme.colors.gray }}
        leftElement={
          <View>
            <CircleIcons
              content={leftElement}
              background={["#e8e8e8", "#d1d1d1"]}
              style={styles.listItem}
            />
            {isUsers ? (
              <View style={styles.viewXStyle}>
                <Logo color="#EA5284" width={10} height={12} />

                {/* <CircleIcons
                            name="logo-regular"
                            color="#EA5284"
                            size={{ width: 10, height: 10 }}
                        /> */}
              </View>
            ) : null}
          </View>
        }
        rightElement={isShowSentTo ? actionIcon : null}
        containerStyle={{
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  viewXStyle: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    height: 20,
    width: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    paddingBottom: 4,
    fontWeight: "bold",
    color: "black",
  },
  listItem: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default withTheme(ContactItem);
