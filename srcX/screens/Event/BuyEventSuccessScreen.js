import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from '../../../App';
import NavigationService from '../../NavigationService';
import BuyEventSuccessComponent from '../../components/Event/BuyEventSuccessComponent';
import { StackActions, NavigationActions } from 'react-navigation';

const BuyEventSuccessScreen = props => {
    const { navigation } = props;
    const event = navigation.state.params.event;
    const onBackPress = () => {
        NavigationService.navigate("TicketsStack")
    }

    const onNextDetailEvent = () => {
        NavigationService.navigate("EventDetailScreen", { isReset: true, eventId: event._id });

    }

    return (
        <BuyEventSuccessComponent
            onBackPress={onBackPress}
            onNextDetailEvent={onNextDetailEvent}

        />
    )
}
const mapStateToProps = state => {
    return {}
};

export default connect(mapStateToProps)(BuyEventSuccessScreen);