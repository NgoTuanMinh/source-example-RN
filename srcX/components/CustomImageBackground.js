import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import * as Images from '../components/Icons/CircleIcons';

export default CustomImageBackground = (props) => {
    const { children, style, image, imageStyle } = props;

    return (
        <ImageBackground
            source={!image ? Images.defaulImage : image}
            style={[styles.imgStyle, style]}
            resizeMode="stretch"
            imageStyle={imageStyle}
        >
            {children}
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    imgStyle: {
        height: 90,
        width: 70,
        resizeMode: 'stretch',
        backgroundColor: 'transparent',
    }
})