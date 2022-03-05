import React from 'react';
import { View, Button, Linking } from 'react-native';

export default function ReportProblem(props) {
    return (
        <View style={{ marginBottom: 30 }}>
            <Button
                type="clear"
                title="Report a problem"
                titleStyle={{
                    color: '#4487C6',
                    fontSize: 16,
                    fontFamily: 'Lato'
                }}
                onPress={() => Linking.openURL('mailto:support@eventx.network')}
            />
        </View>
    );
}