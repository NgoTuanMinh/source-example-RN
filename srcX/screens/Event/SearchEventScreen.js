import React, { useState, useEffect, useMemo } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    ActivityIndicator,
    Text,
    FlatList,
    RefreshControl
} from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-elements';
import SearchComponent from '../../components/SearchComponent';
import { translate } from '../../../App';
import FilterEventComponent from './filterEvent/FilterEventComponent'
import NavigationService from '../../NavigationService';
import Strings from '../../constants/String'
import ItemEventComponent from '../../components/ItemEventComponent'
import LinearGradient from 'react-native-linear-gradient';
import { searchEvent } from "../../redux/actions/index";
import { is24HourFormat } from 'react-native-device-time-format'
import { enumEvent } from '../../utils/enum'

const SearchEventScreen = (props) => {

    const { event, user, countries } = props;

    const [searchedValue, setSearchedValue] = useState('');
    const [location, setFilterLocation] = useState({ key: Strings.AnyWhere });
    const [filterTime, setFilterTime] = useState({ key: enumEvent.ANYTIME, values: translate("Anytime") });
    const [isAvailable, setIsAvailable] = useState(false);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [totalData, setTotalData] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadMore, setIsLoadMore] = useState(false);
    const [is24Hour, setIs24Hour] = useState(false);
    const [currentContry, setCurrentContry] = useState();

    useEffect(() => {
        const detailContry = countries.filter(item => {
            if (item.countryCode == user.countryOfResidence) return true;
            return false;
        })
        setCurrentContry(detailContry[0]);
        setIsLoading(true)
        getCurrentHourFormat();
        searchEvent(page, 10, "", "", "", false, onCallBackSearch);
    }, []);

    const onCallBackSearch = response => {
        setIsLoading(false);
        if (response.docs) {
            setData(response.docs);
            setPage(parseInt(response.page) + 1);
            setTotalPage(response.totalPages);
            setTotalData(response.totalDocs);
        }
    }

    const getCurrentHourFormat = async (date) => {
        const is24Hour = await is24HourFormat();
        if (is24Hour) {
            setIs24Hour(is24Hour);
        }
    }

    useEffect(() => {
        getDataEvent();
    }, [location]);

    const getDataEvent = () => {
        const countryCode = getCountryCode();
        setIsLoading(true)
        searchEvent(1, 10, searchedValue, filterTime.key, countryCode, isAvailable, onCallBackSearch);
    }

    const getCountryCode = () => {
        let country = "";
        if (location.key == "CurrentLocation") {
            country = currentContry.countryCode
        } else {
            country = location.countryCode;
        }
        return country;
    }

    useEffect(() => {
        getDataEvent();
    }, [searchedValue]);

    useEffect(() => {
        getDataEvent();
    }, [filterTime]);

    useEffect(() => {
        getDataEvent();
    }, [isAvailable]);

    const handleLoadMore = () => {
        if (page <= totalPage) {
            setIsLoadMore(true);
            const countryCode = getCountryCode();
            searchEvent(page, 10, searchedValue, filterTime.key, countryCode, isAvailable, callBackLoadMore);
        } else {
            setIsLoadMore(false);
        }
    }

    const callBackLoadMore = response => {
        setIsLoadMore(false);
        if (response.docs && response.docs.length > 0) {
            setData(data.concat(response.docs));
            setPage(parseInt(response.page) + 1);
        }
    }

    const onRefresh = () => {
        setIsRefreshing(true)
        getDataEvent();
    }

    const onPressItem = item => {
        NavigationService.navigate("EventDetailScreen", { item });
    }

    const renderItem = ({ item, index }) => {
        return <ItemEventComponent
            item={item}
            index={index}
            isShowNumberTicket={false}
            onPressItem={onPressItem}
            is24Hour={is24Hour}
        />
    }

    const listEmptyComponent = () => {
        return (
            <View style={styles.viewEmpty}>
                <Text style={[styles.txtStyle, { fontSize: 16 }]}>{translate("NoResultFound")}</Text>
                <Text style={[styles.txtStyle, { opacity: 0.6, fontSize: 16 }]}>{translate("TryAnotherSearchOrFilter")}</Text>
            </View>
        )
    }

    const renderFooter = () => {
        if (!isLoadMore) return null;
        return (
            <ActivityIndicator size="large" color="#FF6195" />
        )
    };

    const renderLoading = useMemo(() => {
        if (!isLoading) return null;
        return (
            <View style={styles.viewLoadingStyle}>
                <ActivityIndicator size="large" color="#FF6195" />
            </View>
        );
    }, [isLoading]);

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.container}>

                <SearchComponent
                    setSearchedValue={setSearchedValue}
                    values={searchedValue}
                    placeHolder={translate("Search_Event")}
                    customStyle={styles.searchStyle}
                />
                <FilterEventComponent
                    location={location}
                    setFilterLocation={setFilterLocation}

                    isAvailable={isAvailable}
                    setIsAvailable={setIsAvailable}

                    filterTime={filterTime}
                    setFilterTime={setFilterTime}
                />
                <LinearGradient colors={['#F2F2F2', '#FAFAFA', '#fff']} style={styles.linearGradient} />

                <View style={styles.flatlistStyle}>
                    <Text style={[styles.txtStyle, { textTransform: 'uppercase', fontWeight: 'bold', }]}>{totalData} events</Text>
                    {data && data.length > 0 ?
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => String(index)}
                            // refreshControl={
                            //     <RefreshControl
                            //         refreshing={isRefreshing}
                            //         onRefresh={onRefresh}
                            //     />
                            // }
                            onEndReachedThreshold={0.05}
                            onEndReached={handleLoadMore}
                            ListFooterComponent={renderFooter}
                        /> : listEmptyComponent()}


                </View>
                {renderLoading}
            </SafeAreaView>
        </View>
    );
};

const mapStateToProps = state => {
    return ({
        event: state.events,
        user: state.registration.profile,
        countries: state.countryCodes.countries,
    })
};

export default connect(mapStateToProps)(withTheme(SearchEventScreen));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    flatlistStyle: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 10,

    },
    searchStyle: {
        elevation: 0,
        shadowOpacity: 0
    },
    linearGradient: {
        height: 15,
    },
    txtStyle: {
        fontSize: 14,
        fontFamily: 'Lato',
        marginBottom: 10
    },
    viewEmpty: {
        flex: 1,
        alignItems: 'center',
        paddingTop: '20%'
    },
    viewLoadingStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
});