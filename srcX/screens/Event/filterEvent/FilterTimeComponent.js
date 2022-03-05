import React, { useState, useCallback } from 'react';
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
    PermissionsAndroid
} from 'react-native';
import CountriesCodeItem from '../../../components/CountriesCodeItem';
import SearchComponent from '../../../components/SearchComponent';
import * as ImageCustom from '../../../components/Icons/CircleIcons/index'
import { translate } from '../../../../App';
import Geolocation from '@react-native-community/geolocation';
import NavigationService from '../../../NavigationService';
import Strings from '../../../constants/String'
import AppHeader from '../../../components/HeaderComponent/index'
import { enumEvent } from '../../../utils/enum'

export default FilterTimeComponent = props => {
    const { navigation } = props;

    const onSelectTime = navigation.state.params.onSelectTime;
    const filterTime = navigation.state.params.filterTime;

    const onPressAnyTime = useCallback(() => {
        onSelectTime({
            key: enumEvent.ANYTIME,
            values: translate("Anytime")
        });
        NavigationService.goBack()
    }, [filterTime]);

    const onPressToday = useCallback(() => {
        onSelectTime({
            key: enumEvent.TODAY,
            values: translate("Today")
        });
        NavigationService.goBack()
    }, [filterTime]);

    const onPressTomorrow = useCallback(() => {
        onSelectTime({
            key: enumEvent.TOMORROW,
            values: translate("Tomorrow")
        });
        NavigationService.goBack()
    }, [filterTime]);

    const onPressThisWeek = useCallback(() => {
        onSelectTime({
            key: enumEvent.THIS_WEEK,
            values: translate("ThisWeek")
        });
        NavigationService.goBack()
    }, [filterTime]);

    const onPressThisMonth = useCallback(() => {
        onSelectTime({
            key: enumEvent.THIS_MOUNT,
            values: translate("ThisMonth")
        });
        NavigationService.goBack()
    }, [filterTime]);

    const params = { isGoBack: true }
    return (
        <AppHeader params={params}>
            <View style={styles.contentStyle}>
                <Text onPress={onPressAnyTime} style={[filterTime.key == enumEvent.ANYTIME ? { ...styles.txtStyle, color: '#EA5284' } : styles.txtStyle]}>{translate("Anytime")}</Text>
                <Text onPress={onPressToday} style={[filterTime.key == enumEvent.TODAY ? { ...styles.txtStyle, color: '#EA5284' } : styles.txtStyle]}>{translate("Today")}</Text>
                <Text onPress={onPressTomorrow} style={[filterTime.key == enumEvent.TOMORROW ? { ...styles.txtStyle, color: '#EA5284' } : styles.txtStyle]}>{translate("Tomorrow")}</Text>
                <Text onPress={onPressThisWeek} style={[filterTime.key == enumEvent.THIS_WEEK ? { ...styles.txtStyle, color: '#EA5284' } : styles.txtStyle]}>{translate("ThisWeek")}</Text>
                <Text onPress={onPressThisMonth} style={[filterTime.key == enumEvent.THIS_MOUNT ? { ...styles.txtStyle, color: '#EA5284' } : styles.txtStyle]}>{translate("ThisMonth")}</Text>
            </View>

        </AppHeader>
    )
}

const styles = StyleSheet.create({
    contentStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtStyle: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'Lato',
        fontWeight: 'bold',
        marginVertical: 20,
        textTransform: 'uppercase'
    }
})