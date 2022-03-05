import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { BackHandler } from 'react-native';
import TransferTicketsSuccessComponent from '../../../components/Ticket/TransferTickets/TransferTicketsSuccessComponent'
import NavigationService from '../../../NavigationService'

const TransferTicketsSuccessScreen = (props) => {
    const { navigation } = props;

    useEffect(() => {

    }, []);

    const onBackPress = () => {
        NavigationService.goBack();
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, [])

    const handleBackButtonClick = () => {
        NavigationService.navigate('mainWllet');
        
    }

    return (
        <TransferTicketsSuccessComponent
            onBackPress={handleBackButtonClick}
            navigation={navigation}
        />
    )
}

TransferTicketsSuccessScreen.navigationOptions = {
    headerShown: false,
};

const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(TransferTicketsSuccessScreen);