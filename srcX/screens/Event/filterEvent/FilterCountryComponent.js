import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
    StyleSheet,
    FlatList,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
    Text,
    TouchableOpacity,
    View,
    PermissionsAndroid,
    Alert
} from 'react-native';
import CountriesCodeItem from '../../../components/CountriesCodeItem';
import SearchComponent from '../../../components/SearchComponent';
import * as ImageCustom from '../../../components/Icons/CircleIcons/index'
import { translate } from '../../../../App';
import Geolocation from '@react-native-community/geolocation';
import NavigationService from '../../../NavigationService';
import Strings from '../../../constants/String'
import { check, request, PERMISSIONS, openSettings } from 'react-native-permissions';

const FilterCountryComponent = ({ countries, navigation }) => {
    const onSelectCountry = navigation.state.params.onSelectCountry;

    const [searchedValue, setSearchedValue] = useState('');
    const [filteredCountries, setFilteredCountries] = useState(countries);

    const _keyExtractor = item => item.countryCode;

    useEffect(() => {
        const newFilteredList = countries.filter(item => {
            let isCheck = item.name.toLowerCase().includes(searchedValue.toLowerCase().replace(/\s{2,}/g, ' ').trim());
            if (!isCheck) {
                isCheck = item.code.toLowerCase().includes(searchedValue.toLowerCase());
            }
            return isCheck;
        }
        );
        setFilteredCountries(newFilteredList);
    }, [searchedValue]);

    const setCountryCode = (item) => {
        onSelectCountry({
            key: Strings.Country,
            ...item,
        })
    }

    const onPressAnyWhere = () => {
        onSelectCountry({ key: Strings.AnyWhere })
        NavigationService.goBack();
    }

    const getCurrentPosition = () => {
        Geolocation.getCurrentPosition(location => {
            onSelectCountry({
                key: Strings.CurrentLocation,
                ...location,
            })
            NavigationService.goBack();
        }, error => {
            console.log('error ', error);
            Alert.alert(
                "Alert",
                error.message,
                [
                    { text: 'Go to Setting', onPress: () => { openSettings() } },
                    { text: 'OK', onPress: () => { } }
                ],
                { cancelable: false }
            );
        });
    }

    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            getCurrentPosition();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Access Required',
                        message: 'This App needs to Access your location',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getCurrentPosition()
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={styles.wrapper}
                behavior={Platform.OS == "ios" ? "padding" : "height"} enabled>
                <View style={[styles.viewHeaderStyle]}>
                    <View style={[styles.boxWithShadow]}>
                        <SearchComponent
                            placeHolder="Search by country or city"
                            customStyle={styles.searchStyle}
                            setSearchedValue={setSearchedValue}
                            values={searchedValue} />

                        <TouchableOpacity onPress={onPressAnyWhere} style={styles.viewItemStyle}>
                            <Image source={ImageCustom.icLocation} style={styles.icStyle} />
                            <Text style={styles.txtStyle}>{translate("Anywhere")}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={requestLocationPermission} style={styles.viewItemStyle}>
                            <Image source={ImageCustom.icCurrentLocation} style={styles.icStyle} />
                            <Text style={styles.txtStyle}>{translate("CurrentLocation")}</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <FlatList
                    style={styles.wrapper}
                    data={filteredCountries}
                    keyExtractor={_keyExtractor}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => <CountriesCodeItem
                        isShowCode={false}
                        onPressCountry={setCountryCode} item={item} setSearchedValue={setSearchedValue} />}
                />

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const mapStateToProps = state => ({
    countries: state.countryCodes.countries
});

export default connect(mapStateToProps)(FilterCountryComponent);

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
    },
    viewHeaderStyle: {
        backgroundColor: '#fff',
        paddingBottom: 15
    },
    searchField: {
        flex: 1,
        minWidth: 50,
        overflow: 'hidden',
        paddingLeft: 10,
        height: 50
    },
    list: {
        paddingBottom: 30
    },
    viewItemStyle: {
        paddingVertical: 14,
        paddingHorizontal: 8,

        flexDirection: 'row',
        marginHorizontal: 8
    },
    txtStyle: {
        fontSize: 14,
        marginLeft: 23,
        fontFamily: 'Lato'
    },
    searchStyle: {
        marginBottom: 0,
        shadowColor: '#fff',
        elevation: 0
    },
    icStyle: {
        marginLeft: 3,
        width: 22,
        height: 20,
        resizeMode: 'contain',
        tintColor: '#000'
    },
    boxWithShadow: {
        shadowOpacity: 0.8,
        shadowRadius: 10,
        shadowOffset: { height: 0, width: 10 },
        shadowColor: 'rgba(0,0,0,0.2)',
        elevation: 10,
        backgroundColor: '#fff',
    },
});
