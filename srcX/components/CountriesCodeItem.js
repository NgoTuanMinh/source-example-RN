import React from 'react';
import { connect } from 'react-redux'
import { StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import { ListItem } from 'react-native-elements';
import { setCountryCode } from '../redux/reducers/Registration/index';

const CountriesCodeItem = ({ item, setCountryCode, navigation, setSearchedValue, onPressCountry, isShowCode = true }) => {

    const touchHandler = () => {
        if (onPressCountry) {
            onPressCountry(item);
            navigation.goBack();
            return;
        }
        setCountryCode(item);
        navigation.goBack();
        setSearchedValue && setSearchedValue("");
    }

    return (
        <TouchableWithoutFeedback onPress={touchHandler}>
            <ListItem
                title={item.name}
                titleStyle={{ fontSize: 16, marginTop: 0 }}
                leftElement={<Text style={{ fontSize: 32 }}>{item.flag}</Text>}
                rightElement={isShowCode && <Text style={style.code}>{item.code}</Text>}
                containerStyle={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}
            />
        </TouchableWithoutFeedback>
    );
}

const mapDispatchToProps = dispatch => ({
    setCountryCode: payload => dispatch(setCountryCode(payload))
})

export default connect(() => ({}), mapDispatchToProps)(withNavigation(CountriesCodeItem))

const style = StyleSheet.create({
    code: {
        color: '#EA5284',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 0,
    }
})