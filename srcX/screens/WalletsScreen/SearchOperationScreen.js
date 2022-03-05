import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-elements';
import SearchComponent from '../../components/SearchComponent';
import OperationList from '../../components/OperationList';
import { getTransactionsOfWallet, getWallet, getNumUnread, readNotifications, plusNumUnread } from "../../redux/actions/index";
import {
  getDataKeystore,
} from '../../redux/actions/keyStore'
import { renderTypeItemDetail, renderTitleItem } from '../../utils/CheckTypeToken'
import { fixDecimals } from '../../halpers/utilities'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center'
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7'
  }
});

const SearchOperationScreen = (props) => {

  const {
    navigation,
    wallets,
    transactions,
    getTransactionsOfWallet,
    theme
  } = props;

  const [searchedValue, setSearchedValue] = useState('');
  const [filteredOperations, setFilteredOperations] = useState(transactions);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (transactions.data) {
      const newFilteredList = transactions.data.filter(item => {
        const title = renderTitleItem(userId, item);
        let isCheck = title.toLowerCase().includes(searchedValue.toLowerCase().replace(/\s{2,}/g, ' ').trim())
        if (!isCheck) {
          isCheck = String(fixDecimals(item.amountToken)).includes(fixDecimals(searchedValue.replace(/\s{2,}/g, ' ').trim()));
        }
        return isCheck;
      })
      const transactionsFiltered = {
        data: newFilteredList
      }
      setFilteredOperations(transactionsFiltered);
    }
  }, [searchedValue]);

  useEffect(() => {
    getUserId();
  }, []);

  const getUserId = async () => {
    const userId = await getDataKeystore("@userId");
    setUserId(userId);
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={[theme.droidSafeArea]} style={styles.container}>
        <SearchComponent
          setSearchedValue={setSearchedValue}
          values={searchedValue}
        />
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} enabled>
          {/* <Animated.ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            scrollEventThrottle={16}
            onMomentumScrollEnd={({ nativeEvent }) => {
              if (isCloseToBottom(nativeEvent)) {
                getMoreDate()
              }
            }}
          > */}
          <View>
            <OperationList
              transactions={filteredOperations}
              currentCardId={wallets.currentCardId}
              conversionRate={wallets.conversionRate}
              //handleLoadMore={handleLoadMore}
              isLoadingMore={transactions.isLoadingMore}
              userId={userId}
            />
          </View>
          {/* </Animated.ScrollView> */}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = state => {
  return ({
    wallets: state.wallets,
    transactions: state.transactions,
  })
};

export default connect(mapStateToProps, { getTransactionsOfWallet })(withTheme(SearchOperationScreen));
