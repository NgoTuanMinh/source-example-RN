import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Image, Text, TouchableOpacity } from 'react-native';
import * as ImageCustom from '../../../components/Icons/CircleIcons/index'
import { translate } from '../../../../App';
import NavigationService from '../../../NavigationService';
import Strings from '../../../constants/String'
import { enumEvent } from '../../../utils/enum'

export default FilterEventComponent = props => {
    const { location, setFilterLocation, isAvailable, setIsAvailable, filterTime, setFilterTime } = props;

    let lablePosition = Strings.AnyWhere;
    let isFilterLocation = false;

    if (location.key == Strings.AnyWhere) {
        lablePosition = translate('Anywhere');
    } else if (location.key == Strings.CurrentLocation) {
        lablePosition = translate('CurrentLocation');
        isFilterLocation = true
    } else {
        lablePosition = location.name;
        isFilterLocation = true
    }

    const onPressAvaible = useCallback(() => {
        setIsAvailable(!isAvailable);
    }, [isAvailable]);

    const onPressCountry = useCallback(() => {
        NavigationService.navigate('FilterCountryScreen', { onSelectCountry });
    }, []);

    const onPressTime = useCallback(() => {
        NavigationService.navigate('FilterTimeScreen', { onSelectTime, filterTime });
    }, [filterTime]);

    const onSelectCountry = useCallback(item => {
        setFilterLocation(item);
    }, []);

    const onSelectTime = useCallback(item => {
        setFilterTime(item);
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView horizontal
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}>
                <TouchableOpacity onPress={onPressCountry} style={isFilterLocation ? { ...styles.viewItemStyle, borderColor: '#EA5284' } : styles.viewItemStyle}>
                    <Image source={ImageCustom.icLocation} style={styles.icStyle} />
                    <Text style={styles.txtStyle}>{lablePosition}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressTime} style={filterTime.key != enumEvent.ANYTIME ? { ...styles.viewItemStyle, borderColor: '#EA5284' } : styles.viewItemStyle}>
                    <Image source={ImageCustom.icCalendar} style={styles.icCalendarStyle} />
                    <Text style={styles.txtStyle}>{filterTime.values}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onPressAvaible}
                    style={isAvailable ? { ...styles.viewItemStyle, borderColor: '#EA5284' } : styles.viewItemStyle}>
                    <Image source={ImageCustom.icTick} style={styles.icTickStyle} />
                    <Text style={styles.txtStyle}>{translate("Tickets_Available")}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    contentContainer: {
        flexDirection: 'row',
        paddingLeft: 10
    },
    txtStyle: {
        fontSize: 14,
        marginLeft: 4,
        fontFamily: 'Lato'
    },
    viewItemStyle: {
        height: 46,
        minWidth: 120,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 4,
        paddingVertical: 14,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 5
    },
    icStyle: {
        height: 16, width: 14,
        resizeMode: 'contain',
        tintColor: '#000'
    },
    icCalendarStyle: {
        height: 17, width: 17,
        resizeMode: 'contain',
        tintColor: '#000'
    },
    icTickStyle: {
        height: 9, width: 12,
        resizeMode: 'contain',
        tintColor: '#000'
    },

})
