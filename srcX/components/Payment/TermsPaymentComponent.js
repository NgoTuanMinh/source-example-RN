import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native'
import { translate } from '../../../App';
import PDFView from 'react-native-view-pdf';
import { Icon } from 'react-native-elements';

export default TermsPaymentComponent = (props) => {
    const { onCloseScreen } = props;

    const resources = {
        url: 'https://eventx.network/data/eventx-gebruiksvoorwaarden.pdf',
    };
    const resourceType = 'url';
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                onPress={onCloseScreen}
                style={styles.viewIconStyle}>
                <Icon name="close" color='black' type="antdesign" />
            </TouchableOpacity>

            <PDFView
                fadeInDuration={250.0}
                style={{ flex: 1, alignItems:'center', width: "100%" }}
                resource={resources[resourceType]}
                resourceType={resourceType}
                onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
                onError={(error) => console.log('Cannot render PDF', error)}
            />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
       
    },
    viewIconStyle: {
        width: 52,
        marginTop: 10 
    }
})