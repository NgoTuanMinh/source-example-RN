import React from 'react';
import Svg, { Path } from 'react-native-svg'

const BarSVG = ({ color }) => {
    return (
        <Svg width="10" height="20" viewBox="0 0 10 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M8.51 19.27L7.66 19.18C6.896 19.11 6.246 18.596 6 17.87C5.468 15.905 5.468 13.835 6 11.87C8.317 11.397 9.986 9.365 10 7C10 5 8 0 8 0H2C2 0 0 5 0 7C0 9.376 1.672 11.425 4 11.9C4.532 13.865 4.532 15.935 4 17.9C3.759 18.617 3.122 19.129 2.37 19.21L1.52 19.3C1.52 19.3 1 19.28 1 20H9C9 19.28 8.51 19.27 8.51 19.27ZM2.44 5L3.44 2H6.56L7.56 5H2.44Z" fill={color}/>
        </Svg>
    )
}

export default BarSVG;