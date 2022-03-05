import React from 'react';
import Svg, { Path, Defs, Stop, LinearGradient } from 'react-native-svg'

const CartSVG = ({ color }) => {
    return (
        <Svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path d="M16 16.998C14.894 16.998 14.01 17.893 14.01 18.998C14.01 20.103 14.894 20.998 16 20.998C17.103 20.998 18 20.103 18 18.998C18 17.893 17.103 16.998 16 16.998ZM0 0.997986V2.99799H2L5.596 10.585L4.244 13.037C4.088 13.322 3.999 13.65 3.999 13.998C3.999 15.103 4.894 15.998 5.999 15.998H17.999V13.998H6.422C6.284 13.998 6.172 13.888 6.172 13.748C6.172 13.704 6.184 13.662 6.204 13.628L7.101 11.998H14.551C15.302 11.998 15.957 11.583 16.299 10.969L19.875 4.47999C19.955 4.33799 19.999 4.17299 19.999 3.99799C19.999 3.44499 19.551 2.99799 18.999 2.99799H4.212L3.265 0.997986H0ZM5.999 16.998C4.894 16.998 4.009 17.893 4.009 18.998C4.009 20.103 4.894 20.998 5.999 20.998C7.103 20.998 7.999 20.103 7.999 18.998C7.999 17.893 7.103 16.998 5.999 16.998Z" fill="url(#paint0_linear)"/>
        <Defs>
        <LinearGradient id="paint0_linear" x1="19.999" y1="20.998" x2="-4.1306" y2="11.5728" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#C2426C"/>
            <Stop offset="1" stopColor="#FF6195"/>
        </LinearGradient>
        </Defs>
        </Svg>    
    )
}

export default CartSVG;