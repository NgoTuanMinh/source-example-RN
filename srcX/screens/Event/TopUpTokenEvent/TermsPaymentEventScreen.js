import React, { useEffect, useState, useContext } from 'react';
import { View, BackHandler, Alert } from 'react-native';
import { connect } from 'react-redux';
import PaymentComponent from '../../../components/Payment/PaymentComponent'
import { bindActionCreators } from 'redux';
import NavigationService from '../../../NavigationService'
import TermsPaymentComponent from '../../../components/Payment/TermsPaymentComponent'

const TermsPaymentEventScreen = (props) => {
    const { navigation, } = props;

    const onCloseScreen = () => {
        NavigationService.goBack();
    }

    return <TermsPaymentComponent
        onCloseScreen={onCloseScreen}
    />
}

const mapStateToProps = state => {
    return ({

    })
};

export default connect(mapStateToProps, {})(TermsPaymentEventScreen);
