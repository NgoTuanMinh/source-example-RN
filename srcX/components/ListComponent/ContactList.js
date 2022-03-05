import React, { useCallback, useMemo } from "react";
import { ScrollView, View, StyleSheet, FlatList } from "react-native";
import { connect } from "react-redux";
import { Text } from "react-native-elements";
import { withTheme } from "react-native-elements";
import ContactItem from "../ListItemComponent/ContactItem";

const colors = {
  background: {
    light: "#fff",
    dark: "#0B3277",
  },

  seperatorLine: "#e6ebf2",

  text: {
    dark: "#363636",
  },

  primary: "#ff6100",
};
const sizes = {
  itemHeight: 40,
  headerHeight: 30,

  spacing: {
    small: 10,
    regular: 15,
    large: 20,
  },
};

const ContactList = (props) => {
  const {
    allContacts,
    theme,
    evtxContacts,
    unEvtxContacts,
    nameScreen,
    isLoading,
    isNotPermission,
    textSearch,
  } = props;

  const renderSectionHeader = (section) => {
    return null;
  };

  if (isNotPermission) {
    return (
      <View style={styles.wrapper}>
        <Text style={[styles.coming, { color: theme.colors.gray }]}>
          You have no permission to access Contacts
        </Text>
      </View>
    );
  }
  if (isLoading) {
    return (
      <View style={styles.wrapper}>
        <Text style={[styles.coming, { color: theme.colors.gray }]}>
          Loading Contacts
        </Text>
      </View>
    );
  }

  const renderAllContact = (data, isUsers = false) => {
    return null;
  };

  const renderUnContact = useCallback(() => {
    return renderAllContact(unEvtxContacts);
  }, [unEvtxContacts]);

  return (
    // <View style={styles.wrapper}>
    <ScrollView style={styles.wrapper} contentContainerStyle={styles.list}>
      <Text style={[styles.day]} h4>
        {evtxContacts.length} contacts on EventX
      </Text>
      {evtxContacts.length > 0 && renderAllContact(evtxContacts, true)}
      {unEvtxContacts.length < 1 && !textSearch && (
        <Text style={[styles.day]} h4>
          In Progress...
        </Text>
      )}
      <Text style={[styles.day]} h4>
        Not yet on EventX
      </Text>
      {renderUnContact()}
    </ScrollView>
    // </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // marginTop: 10,
    backgroundColor: "#fff",
  },
  coming: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
  },
  day: {
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  list: { paddingBottom: 130 },

  listItemContainer: {
    flex: 1,
    height: sizes.itemHeight,
    paddingHorizontal: sizes.spacing.regular,
    justifyContent: "center",
    borderTopColor: colors.seperatorLine,
    borderTopWidth: 1,
  },

  listItemLabel: {
    color: colors.text.dark,
    fontSize: 14,
  },

  sectionHeaderContainer: {
    height: sizes.headerHeight,
    backgroundColor: colors.background.dark,
    justifyContent: "center",
    paddingHorizontal: sizes.spacing.regular,
  },

  sectionHeaderLabel: {
    color: colors.background.light,
  },
  containerAlphaStyle: {
    justifyContent: "flex-start",
  },
});

const mapStateToProps = (state) => {
  return {
    // evtxContacts: state.wallets.contacts.evtxContacts,
    // unEvtxContacts: state.wallets.contacts.unEvtxContacts,
  };
};

export default connect(
  mapStateToProps,
  {}
)(withTheme(ContactList));
