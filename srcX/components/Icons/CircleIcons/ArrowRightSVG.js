import React from 'react';
import Svg, { Path } from 'react-native-svg'

const ArrowRightSVG = ({ color, size }) => {
    const svgSize = size && size.width && size.height ? size : false;
    return (
        <Svg width={svgSize ? svgSize.width : '21'} height={svgSize ? svgSize.height : '18'}
            viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M0.00996947 18L21 9L0.00996947 0L-3.05176e-05 7L15 9L-3.05176e-05 11L0.00996947 18Z" fill={color} />
        </Svg>
    )
}

export default ArrowRightSVG;