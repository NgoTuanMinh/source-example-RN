import React from 'react';
import Svg, { Path } from 'react-native-svg'

const ToiletSVG = ({ color }) => {
    return (
        <Svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M6 20H14V17.483C16.413 15.867 18 13.117 18 10V2C18 0.896 17.104 0 16 0H11.988C10.888 0.008 10 0.9 10 2V10H0C0.02 13.092 2 16 6 17.483V20ZM2.292 12H15.708C15.142 13.912 13.775 15.48 12 16.325V18H8V16.325C6 16 2.858 13.913 2.292 12ZM12 2H16V10H12V2ZM13 3V6H15V3H13Z" fill={color}/>
        </Svg>
    )
};

export default ToiletSVG;