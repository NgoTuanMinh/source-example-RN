import React from 'react';
import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

export default HeaderCustomComponent = (props) => {
    const {
        isLeft,
        iconLeft,
        title,
        onPressLeft,
        isRight,
        iconRight,
        onPressRight
    } = props;

    return (
        <View style={styles.contain}>
            {isLeft && <TouchableOpacity
                onPress={onPressLeft}
                style={styles.btnLeftStyle}
            >
                <Image
                    source={iconLeft}
                    style={styles.iconStyle}
                />
            </TouchableOpacity>
            }
            <Text style={styles.titleStyle}>{title}</Text>
            {isRight && <TouchableOpacity
                style={styles.btnRightStyle}
                onPress={onPressRight}
            >
                <Image
                    source={iconRight}
                    style={styles.iconStyle}
                />
            </TouchableOpacity>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    contain: {
        height: 56,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    iconStyle: {
        height: 15,
        width: 15,
        resizeMode: 'contain',
    },
    titleStyle: {
        fontSize: 16,
        fontFamily: 'Lato',
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    btnLeftStyle: {
        position: 'absolute',
        left: 15,
        padding: 5,
    },
    btnRightStyle:{
        position: 'absolute',
        right: 15,
        padding: 5,
    }
})

HeaderCustomComponent.defaultProps = {
    title: "",
    isLeft: false,
    isRight: false,
};

HeaderCustomComponent.propTypes = {
    title: PropTypes.string.isRequired,
    isLeft: PropTypes.bool,
    isRight: PropTypes.bool,
}