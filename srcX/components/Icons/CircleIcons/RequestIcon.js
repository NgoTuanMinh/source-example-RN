import React from 'react';
import Svg, { Path } from 'react-native-svg';

const RequestIcon = ({ color }) => {
    return (
        <Svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M16 16.99L13 14L16 11V13H20V14.99H16V16.99ZM8 0C10.21 0 12 1.79 12 4C12 6.21 10.21 8 8 8C5.79 8 4 6.21 4 4C4 1.79 5.79 0 8 0ZM8 10C9.155 10 10.252 10.122 11.243 10.342C10.463 11.355 10 12.623 10 14C10 14.701 10.12 15.374 10.341 16H0V14C0 11.79 3.582 10 8 10Z" fill={color}/>
        </Svg>
    )
};

export default RequestIcon;