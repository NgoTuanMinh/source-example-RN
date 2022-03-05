import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import { Button, ThemeProvider, Text } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

export default DatePickerIOS = ({ onChangeDatePickerIOS, isVisible, onDatePickerIOS, value, }) => {
    return (
        <Modal
            isVisible={isVisible}
            style={styles.bgModal}
            onBackButtonPress={() => onDatePickerIOS('CLEAR')}
            onBackdropPress={() => onDatePickerIOS('CLEAR')}
        >
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff'
                }}
            >
                <View style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    paddingVertical: 5
                }}>
                    <TouchableOpacity
                        style={styles.viewStyle}
                        onPress={() => onDatePickerIOS('CLEAR')}>
                        <Text style={styles.txtStyle}>CLEAR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.viewStyle}
                        onPress={() => onDatePickerIOS('DONE')}>
                        <Text style={styles.txtStyle}>DONE</Text>
                    </TouchableOpacity>
                </View>

                <DateTimePicker
                    display="spinner"
                    value={value}
                    mode='date'
                    onChange={onChangeDatePickerIOS}
                    maximumDate={new Date()}
                />
            </View>

        </Modal>
    )
}

const styles = StyleSheet.create({
    bgModal: {
        flex: 1,
        margin: 0,
        backgroundColor: 'transparent'
    },
    viewStyle: {
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    txtStyle: {
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold'
    }
});