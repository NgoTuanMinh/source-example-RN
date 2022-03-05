import React from 'react';
import Svg, { Path } from 'react-native-svg';

const ParkingSVG = ({ color }) => {
    return (
        <Svg width="13" height="19" viewBox="0 0 13 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M7.2 8.99805H4V4.99805H7.2C8.303 4.99805 9.2 5.89305 9.2 6.99805C9.2 8.10305 8.303 8.99805 7.2 8.99805ZM7 0.998047H0V18.998H4V12.998H7C10.312 12.998 13 10.312 13 6.99805C13 3.68405 10.312 0.998047 7 0.998047Z" fill={color}/>
        </Svg>
    )
};

export default ParkingSVG;