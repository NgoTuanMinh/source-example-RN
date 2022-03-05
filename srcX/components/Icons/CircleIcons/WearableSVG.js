import React from 'react';
import Svg, { Path } from 'react-native-svg'

const WearableSVG = ({ color }) => {
    return (
        <Svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M11 18L14.6 13.2C13.597 12.446 12.35 12 11 12C9.65001 12 8.40301 12.446 7.40001 13.2L11 18ZM11 0C6.94801 0 3.20801 1.34 0.200012 3.6L2.00001 6C4.50701 4.116 7.62301 3 11 3C14.377 3 17.493 4.116 20 6L21.8 3.6C18.793 1.34 15.053 0 11 0ZM11 6C8.29801 6 5.80501 6.893 3.80001 8.4L5.60001 10.8C7.10401 9.67 8.97401 9 11 9C13.026 9 14.896 9.67 16.4 10.8L18.2 8.4C16.195 6.892 13.702 6 11 6Z" fill={color}/>
        </Svg>
    )
}

export default WearableSVG;