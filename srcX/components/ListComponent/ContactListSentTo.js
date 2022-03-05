import React, { useCallback, useMemo } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  FlatList,
  Text,
  RefreshControl,
} from "react-native";
import { connect } from "react-redux";
import { withTheme } from "react-native-elements";
import ContactItem from "../ListItemComponent/ContactItem";
import { translate } from "../../../App";

const ContactListSentTo = (props) => {
  const {
    allContacts,
    theme,
    evtxContacts,
    unEvtxContacts,
    isLoading,
    isLoadingEvtContact,
    nameScreen,
    isNotPermission,
    refreshing,
    onRefresh,
    isShowSentTo,
    onPressContact,
  } = props;

  //   console.log("thai list", evtxContacts);

  const renderItemFlatlist = useCallback(({ item, index }) => {
    return (
      <ContactItem
        key={index}
        contact={item}
        nameScreen={nameScreen}
        isUsers={false}
        isShowSentTo={isShowSentTo}
        onPressContact={onPressContact}
      />
    );
  }, []);

  const renderItemEventXFlatlist = useCallback(({ item, index }) => {
    return (
      <ContactItem
        key={index}
        contact={item}
        nameScreen={nameScreen}
        isUsers={true}
        isShowSentTo={isShowSentTo}
        onPressContact={onPressContact}
      />
    );
  }, []);

  const renderItemKey = (item, index) => String(item.key);

  const renderUnEventX = useMemo(() => {
    return (
      <FlatList
        data={unEvtxContacts}
        renderItem={renderItemFlatlist}
        keyExtractor={renderItemKey}
        removeClippedSubviews={true}
        maxToRenderPerBatch={15}
        initialNumToRender={10}
      />
    );
  }, [unEvtxContacts]);

  function displayContacts() {
    return (
      <ScrollView
        style={styles.wrapper}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={[styles.day]} h4>
          {evtxContacts.length} {translate("EvtxContacts")}
        </Text>
        <FlatList
          data={evtxContacts}
          renderItem={renderItemEventXFlatlist}
          keyExtractor={renderItemKey}
          removeClippedSubviews={true}
          maxToRenderPerBatch={30}
          initialNumToRender={10}
        />
        <Text style={[styles.day, { marginTop: 15 }]} h4>
          {translate("NoEvtxContacts")}
        </Text>
        {renderUnEventX}
      </ScrollView>
    );
  }

  const loadingView = () => {
    if (isNotPermission) {
      return (
        <View style={styles.wrapper}>
          <Text style={[styles.coming, { color: "gray" }]}>
            You have no permission to access Contacts
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.wrapper}>
        <Text style={[styles.coming, { color: theme.colors.gray }]}>
          {translate("LoadingContacts")}
        </Text>
      </View>
    );
  };

  const renderLoadingContact = useMemo(() => {
    if (isLoadingEvtContact) {
      return (
        <ScrollView style={styles.wrapper} contentContainerStyle={styles.list}>
          <Text style={[styles.day]} h4>
            {translate("EvtxContacts")}
          </Text>
          <Text style={[styles.day]} h4>
            {translate("Progress")}
          </Text>
          <Text style={[styles.day]} h4>
            {translate("NoEvtxContacts")}
          </Text>
          <FlatList
            data={allContacts}
            renderItem={renderItemFlatlist}
            keyExtractor={renderItemKey}
            removeClippedSubviews={true}
            maxToRenderPerBatch={30}
            initialNumToRender={10}
          />
        </ScrollView>
      );
    }
    return null;
  }, [isLoadingEvtContact, allContacts]);

  const renderData = useMemo(() => {
    if (isLoadingEvtContact) return renderLoadingContact;
    if (isLoading) return loadingView();
    return displayContacts();
  }, [
    isLoading,
    isLoadingEvtContact,
    unEvtxContacts,
    evtxContacts,
    allContacts,
    isNotPermission,
  ]);

  return <View style={styles.container}>{renderData}</View>;
};

const mapStateToProps = (state) => {
  return {};
};

ContactListSentTo.defaultProps = {
  isShowSentTo: false,
  onPressContact: null,
};

export default connect(
  mapStateToProps,
  {}
)(withTheme(ContactListSentTo));

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: "#fff",
  },
  wrapper: {
    backgroundColor: "#fff",
  },
  coming: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
  },
  day: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    opacity: 0.4,
    marginVertical: 5,
  },
  list: { paddingBottom: 130, backgroundColor: "#fff" },
  containerAlphaStyle: {
    justifyContent: "flex-start",
  },
  viewContent: {
    flex: 1,
    backgroundColor: "red",
  },
});
